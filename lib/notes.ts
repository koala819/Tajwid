import { getSupabaseClient } from '@/lib/supabase/client';
import type { NoteRow } from '@/types/supabase';
import { getNiveauxPhaseResultats } from '@/data/niveaux';
import { NOTES_SELECT_WITH_ELEVE, noteEleveDisplayName } from '@/lib/noteHelpers';

const labelToSlug: Record<string, string> = {
  'Tajwid par récitation - Niveau 1': 'tilawa-niveau1',
  'Tajwid par récitation - Niveau 2': 'tilawa-niveau2',
  'Tajwid par récitation - Niveau 3': 'tilawa-niveau3',
  'Tajwid par mémorisation - Niveau 1': 'niveau1',
  'Tajwid par mémorisation - Niveau 2': 'niveau2',
  'Tajwid par mémorisation - Niveau 3': 'niveau3',
  'Tajwid par mémorisation - Niveau 4': 'niveau4',
  'Tajwid par mémorisation - Niveau préparatoire': 'preparatoire',
  'Niveau préparatoire': 'preparatoire',
  'Niveau 1': 'niveau1',
  'Niveau 2': 'niveau2',
  'Niveau 3': 'niveau3',
  'Niveau 4': 'niveau4',
  'Récitation - Niveau 1': 'tilawa-niveau1',
  'Récitation - Niveau 2': 'tilawa-niveau2',
  'Récitation - Niveau 3': 'tilawa-niveau3',
  'Récitation avec Coran': 'recitation-avec-coran',
};

export type ResultatPhase = {
  niveau: string;
  eleve: string;
  moyenne: number;
  nbJurys: number;
};

export type NoteDetailEleve = {
  eleveId: string;
  moyenne: number;
  nbJurys: number;
  /** Moyenne par critère (clé = critère id, valeur = moyenne arrondie à 1 décimale) */
  scoresMoyens: Record<string, number>;
};

/**
 * Notes publiées pour une liste d'élèves, avec moyenne et détail par critère.
 * Utilisé sur la page résultats pour afficher les points forts/faibles.
 */
export async function getPublishedNotesForStudents(
  eleveIds: string[],
): Promise<NoteDetailEleve[]> {
  if (eleveIds.length === 0) return [];

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('notes')
    .select('eleve_id, total, scores')
    .eq('publie', true)
    .in('eleve_id', eleveIds);

  if (error) {
    console.error('[getPublishedNotesForStudents]', error.message);
    return [];
  }

  type NoteRaw = { eleve_id: string; total: number; scores: Record<string, number | string> };
  const byEleve = (data as NoteRaw[] ?? []).reduce<Record<string, NoteRaw[]>>(
    (acc, note) => {
      acc[note.eleve_id] = acc[note.eleve_id] ?? [];
      acc[note.eleve_id].push(note);
      return acc;
    },
    {},
  );

  return Object.entries(byEleve).map(([eleveId, notes]) => {
    const moyenne = notes.reduce((s, n) => s + n.total, 0) / notes.length;

    // Cumul des scores par critère
    const cumul: Record<string, number> = {};
    for (const note of notes) {
      for (const [id, val] of Object.entries(note.scores)) {
        if (typeof val === 'number') {
          cumul[id] = (cumul[id] ?? 0) + val;
        }
      }
    }

    const scoresMoyens: Record<string, number> = {};
    for (const [id, total] of Object.entries(cumul)) {
      scoresMoyens[id] = Math.round((total / notes.length) * 10) / 10;
    }

    return { eleveId, moyenne, nbJurys: notes.length, scoresMoyens };
  });
}

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
    .select(NOTES_SELECT_WITH_ELEVE)
    .eq('publie', true)
    .or(`phase.eq.${phase},phase.is.null`)
    .order('total', { ascending: false });

  if (error) {
    console.error('[getPublishedResultatsByPhase] Supabase error:', error.message);
    return [];
  }

  const notesRaw: NoteRow[] = data ?? [];
  const notes =
    phase === 'finale'
      ? notesRaw.filter((n) => n.phase === 'finale')
      : notesRaw.filter((n) => n.phase !== 'finale');

  const byNiveau = notes.reduce<Record<string, NoteRow[]>>((acc, note) => {
    const slugNiveau = note.eleves?.niveau ?? '';
    const rawSlug = labelToSlug[slugNiveau] ?? slugNiveau;
    acc[rawSlug] = acc[rawSlug] ?? [];
    acc[rawSlug].push(note);
    return acc;
  }, {});

  return getNiveauxPhaseResultats().map((niveau) => {
      const niveauNotes = byNiveau[niveau.slug] ?? [];
      const byEleve = niveauNotes.reduce<Record<string, NoteRow[]>>((acc, note) => {
        const key = note.eleve_id;
        acc[key] = acc[key] ?? [];
        acc[key].push(note);
        return acc;
      }, {});

      const resultats: ResultatPhase[] = Object.entries(byEleve)
        .filter(([, eleveNotes]) => eleveNotes.length >= 1)
        .map(([, eleveNotes]) => {
          const moyenne =
            eleveNotes.reduce((s, n) => s + n.total, 0) / eleveNotes.length;
          return {
            niveau: niveau.slug,
            eleve: noteEleveDisplayName(eleveNotes[0]),
            moyenne,
            nbJurys: eleveNotes.length,
          };
        })
        .sort((a, b) => b.moyenne - a.moyenne);

      return resultats;
    });
}
