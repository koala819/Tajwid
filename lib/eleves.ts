import { getSupabaseClient } from '@/lib/supabase/client';
import type { EleveRow } from '@/types/supabase';
import { slugify, niveauxConfig } from '@/data/niveaux';
import { phasePrecedentePourResultats, type PhaseSaisie } from '@/lib/phaseSaisie';

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

/**
 * Pour les pages `/creneau/...` (saisie des notes) : même règle que les résultats —
 * en demi-finale, seuls les qualifiés du tour qualification ; en finale, seuls les
 * qualifiés demi-finale. En phase qualification : `null` (tous les élèves du créneau).
 */
export async function getEligibleEleveIdsForNotesPhase(
  phaseSaisie: PhaseSaisie,
): Promise<Set<string> | null> {
  const prec = phasePrecedentePourResultats(phaseSaisie);
  if (prec == null) return null;

  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('qualifications')
    .select('eleve_id')
    .eq('phase', prec);

  if (error) {
    console.error('[getEligibleEleveIdsForNotesPhase]', error.message);
    return new Set();
  }

  return new Set((data ?? []).map((row: { eleve_id: string }) => row.eleve_id));
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
 * Page résultats selon `PHASE_SAISIE` :
 * - qualification : élèves avec au moins une note de qualification, ou pastille qualifié (tour actuel).
 * - demi_finale : uniquement les élèves qualifiés à la fin du tour **qualification** (phase précédente).
 * - finale : uniquement les élèves qualifiés à la fin de la **demi-finale** (phase précédente).
 * La pastille « Qualifié » sur la ligne = qualifié pour le tour **suivant** (ligne `qualifications` en `phaseSaisie`).
 */
export async function getResultatsByPhase(
  phaseSaisie: string,
  niveauxExclus: string[] = [],
): Promise<NiveauResultat[]> {
  const phase = phaseSaisie as PhaseSaisie;
  const phasePrec = phasePrecedentePourResultats(phase);

  const supabase = getSupabaseClient();
  const phasesACharger: PhaseSaisie[] =
    phase === 'qualification'
      ? ['qualification']
      : phase === 'demi_finale'
        ? ['qualification', 'demi_finale']
        : ['demi_finale'];

  const [elevesRes, qualifsRes, notesRes] = await Promise.all([
    supabase.from('eleves').select('id, nom, prenom, niveau').order('nom', { ascending: true }),
    (supabase.from('qualifications'))
      .select('eleve_id, phase')
      .in('phase', phasesACharger),
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

  const idsParPhase = (qualifsRes.data ?? []).reduce<Record<string, Set<string>>>(
    (acc, row: { eleve_id: string; phase: string }) => {
      acc[row.phase] = acc[row.phase] ?? new Set();
      acc[row.phase].add(row.eleve_id);
      return acc;
    },
    {},
  );

  const passesTourPrecedent =
    phasePrec != null ? (idsParPhase[phasePrec] ?? new Set<string>()) : null;
  const qualifiePourSuite = idsParPhase[phase] ?? new Set<string>();

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
    const eleveNotes = (notesByEleve[eleve.id] ?? [])
      .sort((a, b) => (a.recorded_at ?? '').localeCompare(b.recorded_at ?? ''));

    if (phase === 'demi_finale' && passesTourPrecedent != null) {
      /* Qualifiés en qualification, ou déjà une note demi-finale (relecture sans lignes `qualification` en base). */
      if (!passesTourPrecedent.has(eleve.id) && eleveNotes.length === 0) continue;
    } else if (phase === 'finale' && passesTourPrecedent != null) {
      if (!passesTourPrecedent.has(eleve.id)) continue;
    } else if (!qualifiePourSuite.has(eleve.id) && eleveNotes.length === 0) {
      continue;
    }

    const badgeQualifie =
      phase === 'finale' ? true : qualifiePourSuite.has(eleve.id);

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
      qualified: badgeQualifie,
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
