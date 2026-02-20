import { getSupabaseClient } from '@/lib/supabase/client';
import type { EleveRow } from '@/types/supabase';
import { slugify, niveauxConfig } from '@/data/niveaux';

export async function getElevesByNiveau(creneau?: string) {
  const supabaseClient = getSupabaseClient();

  let query = supabaseClient
    .from('eleves')
    .select('*')
    .order('nom', { ascending: true });

  // Filtrer par créneau si spécifié
  if (creneau) {
    query = query.eq('creneau', creneau);
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

export async function findEleve(niveauSlug: string, eleveSlug: string) {
  const niveaux = await getNiveauxWithEleves();
  const niveau = niveaux.find((n) => n.slug === niveauSlug);

  if (!niveau) {
    return undefined;
  }

  return niveau.eleves.find((eleve) => eleve.slug === eleveSlug);
}
