import { getSupabaseClient } from '@/lib/supabase/client';
import type { NoteRow } from '@/types/supabase';
import { niveauxConfig } from '@/data/niveaux';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ResultatsPage() {
  const supabaseClient = getSupabaseClient();
  
  const { data, error } = await supabaseClient
    .from('notes')
    .select('*')
    .eq('publie', true)
    .order('total', { ascending: false });

  const publishedNotes: NoteRow[] = data ?? [];

  // Mapper les anciens labels vers les slugs
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

  // Grouper par niveau
  const grouped = publishedNotes.reduce<Record<string, NoteRow[]>>((acc, note) => {
    const niveauKey = labelToSlug[note.niveau] ?? note.niveau;
    acc[niveauKey] = acc[niveauKey] ?? [];
    acc[niveauKey].push(note);
    return acc;
  }, {});

  // Calculer les résultats finaux par élève
  const resultatsParEleve = Object.entries(grouped).reduce<Record<string, { eleve: string; notes: NoteRow[]; moyenne: number; niveau: string }>>((acc, [niveauSlug, notes]) => {
    const groupedByEleve = notes.reduce<Record<string, NoteRow[]>>((eleveAcc, note) => {
      eleveAcc[note.eleve] = eleveAcc[note.eleve] ?? [];
      eleveAcc[note.eleve].push(note);
      return eleveAcc;
    }, {});

    Object.entries(groupedByEleve).forEach(([eleveNom, eleveNotes]) => {
      // Ne garder que les élèves avec au moins 2 jurys
      if (eleveNotes.length >= 2) {
        const moyenne = eleveNotes.reduce((sum, n) => sum + n.total, 0) / eleveNotes.length;
        acc[`${niveauSlug}-${eleveNom}`] = {
          eleve: eleveNom,
          notes: eleveNotes,
          moyenne,
          niveau: niveauSlug,
        };
      }
    });

    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-neutral-900">
      <main className="mx-auto max-w-6xl space-y-12 px-4 py-12 md:py-16">
        {/* Header */}
        <header className="space-y-6 border-b border-stone-200 pb-8 text-center dark:border-neutral-700">
          <h1 className="text-4xl font-light tracking-tight text-stone-800 dark:text-stone-100 md:text-5xl">
            Résultats du Concours
          </h1>
          <p className="text-base text-stone-600 dark:text-stone-300">
            Concours de Tajwid 2025 - Demi-finales
          </p>
          <div className="flex items-baseline justify-center gap-3">
            <span className="text-5xl font-extralight text-amber-700 dark:text-amber-500">
              {Object.keys(resultatsParEleve).length}
            </span>
            <span className="text-sm uppercase tracking-wider text-stone-500 dark:text-stone-400">
              résultats publiés
            </span>
          </div>
        </header>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            Impossible de charger les résultats : {error.message}
          </div>
        )}

        {Object.keys(resultatsParEleve).length === 0 ? (
          <div className="rounded-lg border border-stone-200 bg-white p-12 text-center dark:border-neutral-700 dark:bg-neutral-800">
            <p className="text-stone-500 dark:text-stone-400">
              Aucun résultat publié pour le moment
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {niveauxConfig.map((niveau) => {
              const resultatsNiveau = Object.values(resultatsParEleve)
                .filter((r) => r.niveau === niveau.slug)
                .sort((a, b) => b.moyenne - a.moyenne);

              if (resultatsNiveau.length === 0) return null;

              return (
                <section key={niveau.slug} className="space-y-6">
                  <div className="rounded-lg border border-stone-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
                    <p className="text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      {niveau.label}
                    </p>
                    <p className="mt-1 text-right text-lg font-normal text-stone-700 dark:text-stone-200" dir="rtl">
                      {niveau.labelAr}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {resultatsNiveau.map((resultat, index) => (
                      <div
                        key={`${resultat.niveau}-${resultat.eleve}`}
                        className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-lg font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                              {index + 1}
                            </div>
                            <div>
                              <h3 className="text-xl font-normal text-stone-800 dark:text-stone-100">
                                {resultat.eleve}
                              </h3>
                              <p className="text-xs text-stone-500 dark:text-stone-400">
                                Moyenne de {resultat.notes.length} jurys
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-normal text-amber-700 dark:text-amber-500">
                              {resultat.moyenne.toFixed(1)}
                            </p>
                            <p className="text-xs text-stone-500 dark:text-stone-400">/ 100</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <footer className="border-t border-stone-200 pt-8 text-center dark:border-neutral-700">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-stone-500 transition-colors hover:text-amber-700 dark:text-stone-400 dark:hover:text-amber-500"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à l'accueil
          </Link>
        </footer>
      </main>
    </div>
  );
}
