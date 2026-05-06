import { getSupabaseClient } from '@/lib/supabase/client';
import type { EleveRow } from '@/types/supabase';
import { slugify, niveauxConfig } from '@/data/niveaux';

const creneauSlugToLabel: Record<string, string> = {
  'samedi-matin': 'Samedi matin',
  'samedi-aprem': 'Samedi après-midi',
  'dimanche-matin': 'Dimanche matin',
  'dimanche-aprem': 'Dimanche après-midi',
};

export async function getElevesByNiveau(creneau?: string) {
  const supabaseClient = getSupabaseClient();

  let query = supabaseClient
    .from('eleves')
    .select('*')
    .order('nom', { ascending: true });

  // Filtrer par créneau si spécifié
  if (creneau) {
    const creneauVariants = [creneau];
    const creneauLabel = creneauSlugToLabel[creneau];
    if (creneauLabel) {
      creneauVariants.push(creneauLabel);
    }
    query = query.in('creneau', creneauVariants);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erreur lors du chargement des élèves:', error);
    return [];
  }

  return (data ?? []) as EleveRow[];
}

export async function getNiveauxWithEleves(creneau?: string, qualificationFilter?: string) {
  const elevesFromDb = await getElevesByNiveau(creneau);

  const niveauxWithEleves = niveauxConfig.map((niveau) => {
    const elevesForNiveau = elevesFromDb
      .filter((eleve) => {
        // Filtrer par niveau
        if (eleve.niveau !== niveau.slug) return false;

        // Filtrer par qualification si spécifié
        if (qualificationFilter && eleve.qualification !== qualificationFilter) return false;

        return true;
      })
      .map((eleve) => ({
        id: eleve.id,
        name: `${eleve.prenom} ${eleve.nom}`,
        prenom: eleve.prenom,
        nom: eleve.nom,
        slug: slugify(`${eleve.nom} ${eleve.prenom}`),
        professeur: eleve.professeur ?? undefined,
        moyenne_qualif: eleve.moyenne_qualif ?? undefined,
        note1: eleve.note1 ?? undefined,
        note2: eleve.note2 ?? undefined,
        observation: eleve.observation ?? undefined,
        qualification: eleve.qualification ?? undefined,
        competition: eleve.competition ?? undefined,
      }))
      .sort((a, b) => a.prenom.localeCompare(b.prenom, 'fr', { sensitivity: 'base' }));

    return {
      ...niveau,
      eleves: elevesForNiveau,
    };
  });

  // Filtrer les niveaux qui ont au moins un élève
  return niveauxWithEleves.filter((niveau) => niveau.eleves.length > 0);
}

export async function getQualifiedIdsForPhase(phase: string): Promise<string[]> {
  const supabaseClient = getSupabaseClient();
  const { data, error } = await (supabaseClient.from('qualifications'))
    .select('eleve_id')
    .eq('phase', phase);

  if (error) {
    console.error('Erreur lors du chargement des qualifications:', error);
    return [];
  }

  return (data ?? []).map((row: { eleve_id: string }) => row.eleve_id);
}

export type NoteJury = {
  jury: string;
  total: number;
  moyenne: number;
  scores: Record<string, number | string>;
  recorded_at: string | null;
};

export type EleveResultat = {
  id: string;
  nom: string;
  prenom: string;
  name: string;
  niveau: string;
  qualified: boolean;
  notes: NoteJury[];
  /** Moyenne globale calculée depuis les notes (null si aucune note) */
  moyenneGlobale: number | null;
};

export type NiveauResultat = {
  slug: string;
  label: string;
  labelAr: string;
  eleves: EleveResultat[];
};

/**
 * Pour chaque élève de la base :
 * - vérifie s'il est qualifié (table qualifications, phase = phaseSaisie)
 * - récupère ses notes (table notes, phase = phaseSaisie)
 * Retourne les niveaux qui ont au moins un élève avec une note ou une qualification.
 */
export async function getResultatsByPhase(
  phaseSaisie: string,
  niveauxExclus: string[] = [],
): Promise<NiveauResultat[]> {
  const supabase = getSupabaseClient();
  const phasesQualificationSource =
    phaseSaisie === 'finale' ? (['demi_finale', 'finale'] as const) : ([phaseSaisie] as const);

  const [elevesRes, qualifsRes, notesRes] = await Promise.all([
    supabase.from('eleves').select('id, nom, prenom, niveau').order('nom', { ascending: true }),
    (supabase.from('qualifications'))
      .select('eleve_id')
      // En finale, on considère automatiquement les qualifiés de demi-finale
      // (et les éventuels enregistrements explicites déjà en finale).
      .in('phase', phasesQualificationSource),
    supabase
      .from('notes')
      .select('eleve_id, jury, total, moyenne, scores, recorded_at')
      .eq('phase', phaseSaisie),
  ]);

  if (elevesRes.error) {
    console.error('[getResultatsByPhase] eleves:', elevesRes.error.message);
    return [];
  }

  const elevesData = (elevesRes.data ?? []) as {
    id: string;
    nom: string;
    prenom: string;
    niveau: string;
  }[];

  const qualifiedIds = new Set<string>(
    (qualifsRes.data ?? []).map((r: { eleve_id: string }) => r.eleve_id),
  );

  const notesByEleve = (
    (notesRes.data ?? []) as {
      eleve_id: string;
      jury: string;
      total: number;
      moyenne: number;
      scores: Record<string, number | string>;
      recorded_at: string | null;
    }[]
  ).reduce<Record<string, NoteJury[]>>((acc, n) => {
    acc[n.eleve_id] = acc[n.eleve_id] ?? [];
    acc[n.eleve_id].push({ jury: n.jury, total: n.total, moyenne: n.moyenne, scores: n.scores, recorded_at: n.recorded_at });
    return acc;
  }, {});

  // Regrouper par niveau en respectant l'ordre de niveauxConfig
  const byNiveau: Record<string, EleveResultat[]> = {};

  for (const eleve of elevesData) {
    const isQualified = qualifiedIds.has(eleve.id);
    const eleveNotes = (notesByEleve[eleve.id] ?? [])
      .sort((a, b) => (a.recorded_at ?? '').localeCompare(b.recorded_at ?? ''));

    // N'afficher que les élèves qui ont une note ou une qualification pour cette phase
    if (!isQualified && eleveNotes.length === 0) continue;

    const moyenneGlobale =
      eleveNotes.length > 0
        ? eleveNotes.reduce((s, n) => s + n.total, 0) / eleveNotes.length
        : null;

    const resultat: EleveResultat = {
      id: eleve.id,
      nom: eleve.nom,
      prenom: eleve.prenom,
      name: `${eleve.prenom} ${eleve.nom}`,
      niveau: eleve.niveau,
      qualified: isQualified,
      notes: eleveNotes.sort((a, b) => a.jury.localeCompare(b.jury, 'fr')),
      moyenneGlobale,
    };

    byNiveau[eleve.niveau] = byNiveau[eleve.niveau] ?? [];
    byNiveau[eleve.niveau].push(resultat);
  }

  return niveauxConfig
    .filter((n) => !niveauxExclus.includes(n.slug) && byNiveau[n.slug]?.length)
    .map((n) => ({
      slug: n.slug,
      label: n.label,
      labelAr: n.labelAr,
      noHifdh: n.noHifdh,
      eleves: (byNiveau[n.slug] ?? []).sort((a, b) => {
        // Qualifiés d'abord, puis par moyenne décroissante, puis alphabétique
        if (b.qualified !== a.qualified) return b.qualified ? 1 : -1;
        const ma = a.moyenneGlobale ?? -1;
        const mb = b.moyenneGlobale ?? -1;
        if (mb !== ma) return mb - ma;
        return a.prenom.localeCompare(b.prenom, 'fr', { sensitivity: 'base' });
      }),
    }));
}

export async function findEleve(niveauSlug: string, eleveSlug: string) {
  const niveaux = await getNiveauxWithEleves();
  const niveau = niveaux.find((n) => n.slug === niveauSlug);

  if (!niveau) {
    return undefined;
  }

  return niveau.eleves.find((eleve) => eleve.slug === eleveSlug);
}
