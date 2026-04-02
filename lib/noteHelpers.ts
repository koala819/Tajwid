import type { NoteRow } from '@/types/supabase';

/** Requête Supabase : notes + élève lié (niveau et nom viennent de `eleves`). */
export const NOTES_SELECT_WITH_ELEVE =
  '*, eleves ( id, prenom, nom, niveau )';

export function noteEleveDisplayName(note: NoteRow): string {
  const e = note.eleves;
  if (e) return `${e.prenom} ${e.nom}`.trim();
  return '';
}

export function noteNiveauSlug(note: NoteRow): string {
  return note.eleves?.niveau ?? '';
}
