import { getSupabaseClient } from '@/lib/supabase/client';
import type { NoteRow } from '@/types/supabase';
import { getNiveauxWithEleves } from '@/lib/eleves';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : '—';

export default async function AdminPage() {
  const supabaseClient = getSupabaseClient();
  const niveaux = await getNiveauxWithEleves();
  
  const { data, error } = await supabaseClient
    .from('notes')
    .select('id, niveau, eleve, jury, moyenne, total, recorded_at')
    .order('recorded_at', { ascending: false });

  const levelRows: NoteRow[] = data ?? [];

  const grouped = levelRows.reduce<Record<string, NoteRow[]>>((acc, row) => {
    acc[row.niveau] = acc[row.niveau] ?? [];
    acc[row.niveau].push(row);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-50 py-10 dark:bg-slate-950">
      <main className="mx-auto max-w-6xl space-y-8 px-4">
        {/* Bouton retour */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à l&apos;accueil
        </Link>

        <header className="space-y-2 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900/50">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-indigo-600">Admin</p>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
            Résultats par niveau
          </h1>
          <p className="text-slate-500 dark:text-slate-300">
            Chaque niveau liste les notes saisies par jury. Les données proviennent de Supabase.
          </p>
        </header>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/40">
            Impossible de charger les notes : {error.message}
          </div>
        ) : null}

        <section className="space-y-6">
          {niveaux.map((niveau) => {
            const entries = grouped[niveau.slug] ?? [];

            if (entries.length === 0) {
              return (
                <article
                  key={niveau.slug}
                  className="rounded-2xl border border-dashed border-slate-200 bg-white/80 p-5 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                    {niveau.label}
                  </p>
                  <p className="mt-1 text-right text-sm font-semibold text-slate-700 dark:text-slate-300" dir="rtl">
                    {niveau.labelAr}
                  </p>
                  <p className="mt-2 text-slate-500 dark:text-slate-400">Aucune note enregistrée.</p>
                </article>
              );
            }

            const totalMoyenne =
              entries.reduce((sum, row) => sum + row.moyenne, 0) / entries.length;

            return (
              <article
                key={niveau.slug}
                className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900/50"
              >
                <header className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                      {niveau.label}
                    </p>
                    <p className="mt-1 text-right text-sm font-semibold text-slate-700 dark:text-slate-300" dir="rtl">
                      {niveau.labelAr}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                      Moyenne générale : {totalMoyenne.toFixed(2)} / 10
                    </p>
                  </div>
                  <span
                    className="h-10 w-10 flex-shrink-0 rounded-full border border-slate-200"
                    style={{ backgroundColor: niveau.color }}
                  />
                </header>

                <div className="mt-4 grid gap-4 text-sm">
                  {entries.map((row) => (
                    <div
                      key={row.id}
                      className="flex flex-col gap-1 rounded-xl border border-slate-100 bg-slate-50/80 p-4 text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-200"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
                        <span>Élève</span>
                        <span>{formatDate(row.recorded_at)}</span>
                      </div>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">
                        {row.eleve} — Jury {row.jury}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
                          Moyenne {row.moyenne.toFixed(2)} / 10
                        </span>
                        <span className="rounded-full bg-slate-900/5 px-3 py-1 text-xs font-semibold text-slate-800 dark:bg-slate-100/10 dark:text-slate-200">
                          Total {row.total.toFixed(1)} / 100
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}
