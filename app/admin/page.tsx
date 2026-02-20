import { getSupabaseClient } from '@/lib/supabase/client';
import type { NoteRow } from '@/types/supabase';
import { niveauxConfig } from '@/data/niveaux';
import { isAuthenticated } from '@/lib/auth';
import { getConfig } from '@/lib/config';
import { redirect } from 'next/navigation';
import AdminNav from '@/components/AdminNav';
import AdminHeader from '@/components/AdminHeader';
import AdminContent from './AdminContent';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect('/login?redirect=/admin');
  }
  const [phaseSaisie, supabaseResult] = await Promise.all([
    getConfig('phase_saisie'),
    getSupabaseClient().from('notes').select('*').order('recorded_at', { ascending: false }),
  ]);
  const currentPhase = phaseSaisie === 'finale' ? 'finale' : 'demi_finale';

  const allRows: NoteRow[] = supabaseResult.data ?? [];
  const { error } = supabaseResult;

  const levelRows: NoteRow[] = allRows.filter((row) => {
    const p = row.phase ?? 'demi_finale';
    return p === currentPhase;
  });

  // Mapper les anciens labels vers les nouveaux slugs pour rétrocompatibilité
  const labelToSlug: Record<string, string> = {
    // Anciens labels longs
    'Tajwid par récitation - Niveau 1': 'tilawa-niveau1',
    'Tajwid par récitation - Niveau 2': 'tilawa-niveau2',
    'Tajwid par récitation - Niveau 3': 'tilawa-niveau3',
    'Tajwid par mémorisation - Niveau 1': 'hifdh-niveau1',
    'Tajwid par mémorisation - Niveau 2': 'hifdh-niveau2',
    'Tajwid par mémorisation - Niveau 3': 'hifdh-niveau3',
    'Tajwid par mémorisation - Niveau 4': 'hifdh-niveau4',
    'Tajwid par mémorisation - Niveau préparatoire': 'hifdh-preparatoire',
    // Nouveaux labels courts
    'Niveau préparatoire': 'hifdh-preparatoire',
    'Niveau 1': 'hifdh-niveau1',
    'Niveau 2': 'hifdh-niveau2',
    'Niveau 3': 'hifdh-niveau3',
    'Niveau 4': 'hifdh-niveau4',
    'Récitation - Niveau 1': 'tilawa-niveau1',
    'Récitation - Niveau 2': 'tilawa-niveau2',
    'Récitation - Niveau 3': 'tilawa-niveau3',
  };

  const grouped = levelRows.reduce<Record<string, NoteRow[]>>((acc, row) => {
    // Convertir l'ancien label en slug si nécessaire
    const niveauKey = labelToSlug[row.niveau] ?? row.niveau;
    acc[niveauKey] = acc[niveauKey] ?? [];
    acc[niveauKey].push(row);
    return acc;
  }, {});

  // Pour la demi-finale, ne garder que les niveaux de mémorisation (hifdh)
  // et uniquement ceux qui ont des notes
  const niveauxHifdh = niveauxConfig
    .filter((niveau) => niveau.slug.startsWith('hifdh-'))
    .filter((niveau) => grouped[niveau.slug]?.length > 0);

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

        <AdminContent niveaux={niveauxHifdh} notesGrouped={grouped} />
      </main>
    </div>
  );
}
