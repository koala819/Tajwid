import { getSupabaseClient } from '@/lib/supabase/client';
import type { NoteRow } from '@/types/supabase';
import { getNiveauxPhaseResultats } from '@/data/niveaux';
import { isAuthenticated } from '@/lib/auth';
import {
  getPhaseSaisieFromEnv,
  phasePrecedentePourResultats,
  type PhaseSaisie,
} from '@/lib/phaseSaisie';
import { redirect } from 'next/navigation';
import AdminNav from '@/components/AdminNav';
import AdminHeader from '@/components/AdminHeader';
import AdminContent from './AdminContent';
import { NOTES_SELECT_WITH_ELEVE } from '@/lib/noteHelpers';

export const dynamic = 'force-dynamic';

function noteMatchesAdminPhase(row: NoteRow, phaseSaisie: PhaseSaisie): boolean {
  const p = row.phase;
  if (phaseSaisie === 'finale') return p === 'finale';
  if (phaseSaisie === 'qualification') return p === 'qualification';
  /* demi_finale : notes de ce tour + anciennes sans phase explicite */
  return p === 'demi_finale' || p === null || p === undefined || p === '';
}

export default async function AdminPage() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect('/?redirect=/admin');
  }
  const phaseSaisie = getPhaseSaisieFromEnv();

  const supabaseResult = await getSupabaseClient()
    .from('notes')
    .select(NOTES_SELECT_WITH_ELEVE)
    .order('recorded_at', { ascending: false });

  const allRows: NoteRow[] = supabaseResult.data ?? [];
  const { error } = supabaseResult;

  const levelRows: NoteRow[] = allRows.filter((row) =>
    noteMatchesAdminPhase(row, phaseSaisie),
  );

  // Mapper les anciens labels vers les nouveaux slugs pour rétrocompatibilité
  const labelToSlug: Record<string, string> = {
    // Anciens labels longs
    'Tajwid par récitation - Niveau 1': 'tilawa-niveau1',
    'Tajwid par récitation - Niveau 2': 'tilawa-niveau2',
    'Tajwid par récitation - Niveau 3': 'tilawa-niveau3',
    'Tajwid par mémorisation - Niveau 1': 'niveau1',
    'Tajwid par mémorisation - Niveau 2': 'niveau2',
    'Tajwid par mémorisation - Niveau 3': 'niveau3',
    'Tajwid par mémorisation - Niveau 4': 'niveau4',
    'Tajwid par mémorisation - Niveau préparatoire': 'preparatoire',
    // Nouveaux labels courts
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

  const grouped = levelRows.reduce<Record<string, NoteRow[]>>((acc, row) => {
    // Convertir d'éventuels anciens labels en slugs actuels
    const slugNiveau = row.eleves?.niveau ?? '';
    const niveauKey = labelToSlug[slugNiveau] ?? slugNiveau;
    acc[niveauKey] = acc[niveauKey] ?? [];
    acc[niveauKey].push(row);
    return acc;
  }, {});

  // Mémorisation + récitation avec Coran ; uniquement les niveaux qui ont des notes
  const niveauxHifdh = getNiveauxPhaseResultats().filter(
    (niveau) => grouped[niveau.slug]?.length > 0,
  );

  // Pastilles admin : en finale, clés = tour précédent (comme l’API) ou anciennes lignes `finale`
  const eleveIds = [...new Set(levelRows.map((r) => r.eleve_id).filter(Boolean))];
  let qualifiedEleveIds: Set<string> = new Set();
  if (eleveIds.length > 0) {
    const phasesQualifAdmin =
      phaseSaisie === 'finale'
        ? ([phasePrecedentePourResultats('finale')!, 'finale'] as const)
        : [phaseSaisie];
    const { data: qualifData } = (await getSupabaseClient()
      .from('qualifications')
      .select('eleve_id')
      .in('eleve_id', eleveIds)
      .in('phase', phasesQualifAdmin)) as { data: Array<{ eleve_id: string }> | null };
    qualifiedEleveIds = new Set((qualifData ?? []).map((r) => r.eleve_id));
  }

  let winnerEleveIds: Set<string> = new Set();
  if (phaseSaisie === 'finale' && eleveIds.length > 0) {
    const { data: winData } = (await getSupabaseClient()
      .from('qualifications')
      .select('eleve_id')
      .in('eleve_id', eleveIds)
      .eq('phase', 'vainqueur')) as { data: Array<{ eleve_id: string }> | null };
    winnerEleveIds = new Set((winData ?? []).map((r) => r.eleve_id));
  }

  return (
    <div className="min-h-screen bg-stone-50 py-10 dark:bg-neutral-900">
      <main className="mx-auto max-w-6xl space-y-8 px-4">
        <AdminNav />
        <AdminHeader />

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            Impossible de charger les notes : {error.message}
          </div>
        ) : null}

        <AdminContent
          phaseSaisie={phaseSaisie}
          niveaux={niveauxHifdh}
          notesGrouped={grouped}
          qualifiedEleveIds={[...qualifiedEleveIds]}
          winnerEleveIds={[...winnerEleveIds]}
        />
      </main>
    </div>
  );
}
