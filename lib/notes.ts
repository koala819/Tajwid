import { getSupabaseClient } from '@/lib/supabase/client';
import type { NoteRow } from '@/types/supabase';
import { niveauxConfig } from '@/data/niveaux';

const labelToSlug: Record<string, string> = {
  'Tajwid par récitation - Niveau 1': 'tilawa-niveau1',
  'Tajwid par récitation - Niveau 2': 'tilawa-niveau2',
  'Tajwid par récitation - Niveau 3': 'tilawa-niveau3',
  'Tajwid par mémorisation - Niveau 1': 'hifdh-niveau1',
  'Tajwid par mémorisation - Niveau 2': 'hifdh-niveau2',
  'Tajwid par mémorisation - Niveau 3': 'hifdh-niveau3',
  'Tajwid par mémorisation - Niveau 4': 'hifdh-niveau4',
  'Tajwid par mémorisation - Niveau préparatoire': 'hifdh-preparatoire',
  'Niveau préparatoire': 'hifdh-preparatoire',
  'Niveau 1': 'hifdh-niveau1',
  'Niveau 2': 'hifdh-niveau2',
  'Niveau 3': 'hifdh-niveau3',
  'Niveau 4': 'hifdh-niveau4',
  'Récitation - Niveau 1': 'tilawa-niveau1',
  'Récitation - Niveau 2': 'tilawa-niveau2',
  'Récitation - Niveau 3': 'tilawa-niveau3',
};

export type ResultatPhase = {
  niveau: string;
  eleve: string;
  moyenne: number;
  nbJurys: number;
};

/**
 * Résultats publiés pour une phase (demi_finale ou finale), groupés par niveau.
 * Un élève n’apparaît que s’il a au moins 2 notes publiées.
 */
export async function getPublishedResultatsByPhase(
  phase: 'demi_finale' | 'finale'
): Promise<ResultatPhase[][]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('publie', true)
    .or(`phase.eq.${phase},phase.is.null`)
    .order('total', { ascending: false });

  if (error) return [];

  const notesRaw: NoteRow[] = data ?? [];
  const notes =
    phase === 'finale'
      ? notesRaw.filter((n) => n.phase === 'finale')
      : notesRaw.filter((n) => n.phase !== 'finale');

  const byNiveau = notes.reduce<Record<string, NoteRow[]>>((acc, note) => {
    const slug = labelToSlug[note.niveau] ?? note.niveau;
    acc[slug] = acc[slug] ?? [];
    acc[slug].push(note);
    return acc;
  });

  return niveauxConfig
    .filter((n) => n.slug.startsWith('hifdh-'))
    .map((niveau) => {
      const niveauNotes = byNiveau[niveau.slug] ?? [];
      const byEleve = niveauNotes.reduce<Record<string, NoteRow[]>>((acc, note) => {
        acc[note.eleve] = acc[note.eleve] ?? [];
        acc[note.eleve].push(note);
        return acc;
      }, {});

      const resultats: ResultatPhase[] = Object.entries(byEleve)
        .filter(([, eleveNotes]) => eleveNotes.length >= 2)
        .map(([eleveNom, eleveNotes]) => {
          const moyenne =
            eleveNotes.reduce((s, n) => s + n.total, 0) / eleveNotes.length;
          return {
            niveau: niveau.slug,
            eleve: eleveNom,
            moyenne,
            nbJurys: eleveNotes.length,
          };
        })
        .sort((a, b) => b.moyenne - a.moyenne);

      return resultats;
    });
}
