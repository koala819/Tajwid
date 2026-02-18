import { getSupabaseClient } from '@/lib/supabase/client';
import type { EnseignantRow } from '@/types/supabase';

export type EnseignantPourNote = { id: string; nom: string } | null;

/**
 * Récupère les deux enseignants associés aux notes de qualification.
 * ordre 1 = Note 1 (ex. Hanan), ordre 2 = Note 2 (ex. Abderrahmane).
 * Modifiable en base pour changer les noms ou l’ordre.
 */
export async function getEnseignantsPourNotes(): Promise<{
  note1: EnseignantPourNote;
  note2: EnseignantPourNote;
}> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('enseignants')
    .select('id, nom, ordre')
    .order('ordre', { ascending: true });

  if (error) {
    console.error('Erreur chargement enseignants:', error);
    return { note1: null, note2: null };
  }

  const rows = (data ?? []) as Pick<EnseignantRow, 'id' | 'nom' | 'ordre'>[];
  const byOrdre = rows.reduce<Record<number, { id: string; nom: string }>>((acc, r) => {
    acc[r.ordre] = { id: r.id, nom: r.nom };
    return acc;
  }, {});

  return {
    note1: byOrdre[1] ?? null,
    note2: byOrdre[2] ?? null,
  };
}
