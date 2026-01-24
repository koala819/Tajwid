import Link from 'next/link';
import { getNiveauxWithEleves } from '@/lib/eleves';

export const dynamic = 'force-dynamic';

const creneauxLabels: Record<string, string> = {
  'samedi-matin': 'Samedi matin',
  'samedi-aprem': 'Samedi après-midi',
  'dimanche-matin': 'Dimanche matin',
  'dimanche-aprem': 'Dimanche après-midi',
};

type PageProps = {
  searchParams: Promise<{
    creneau?: string;
  }>;
};

export default async function Home(props: PageProps) {
  const searchParams = await props.searchParams;
  const creneauFilter = searchParams.creneau;

  const niveaux = await getNiveauxWithEleves(creneauFilter);
  const totalEleves = niveaux.reduce((sum, n) => sum + n.eleves.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <main className="mx-auto max-w-7xl space-y-12 px-4 py-12">
        {/* Hero Section */}
        <header className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 shadow-2xl dark:border-indigo-900 md:p-12">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="relative z-10 space-y-6 text-center">
            <h1 className="text-4xl font-bold text-white md:text-6xl">
              Concours de Tajwid 2025
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <div className="rounded-2xl bg-white/10 px-6 py-3 backdrop-blur-sm">
                <p className="text-sm text-white/70">Niveaux</p>
                <p className="text-2xl font-bold text-white">{niveaux.length}</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-6 py-3 backdrop-blur-sm">
                <p className="text-sm text-white/70">Participants</p>
                <p className="text-2xl font-bold text-white">{totalEleves}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Filtres par créneau */}
        <section className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className={`rounded-full px-6 py-2.5 text-sm font-semibold transition ${
              !creneauFilter
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Tous les créneaux
          </Link>
          {Object.entries(creneauxLabels).map(([value, label]) => (
            <Link
              key={value}
              href={`/?creneau=${value}`}
              className={`rounded-full px-6 py-2.5 text-sm font-semibold transition ${
                creneauFilter === value
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {label}
            </Link>
          ))}
        </section>

        {/* Niveaux */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Participants par niveau
                {creneauFilter && (
                  <span className="ml-2 text-lg font-normal text-slate-600 dark:text-slate-400">
                    · {creneauxLabels[creneauFilter]}
                  </span>
                )}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Cliquez sur un participant pour accéder au formulaire d&apos;évaluation
              </p>
            </div>
          </div>

          {totalEleves === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
              <svg
                className="mx-auto h-12 w-12 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p className="mt-4 text-slate-600 dark:text-slate-400">
                Aucun participant inscrit pour ce créneau
              </p>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {niveaux.map((niveau) => (
                <article
                  key={niveau.slug}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: niveau.color }}
                        />
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          {niveau.label}
                        </p>
                      </div>
                      <p className="text-right text-base font-semibold text-slate-700 dark:text-slate-300" dir="rtl">
                        {niveau.labelAr}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {niveau.description}
                      </p>
                      <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {niveau.eleves.length} participant{niveau.eleves.length > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>

                  {niveau.eleves.length > 0 ? (
                    <div className="mt-4 space-y-2">
                      {niveau.eleves.map((eleve) => (
                        <Link
                          key={eleve.slug}
                          href={`/notes/${niveau.slug}/${eleve.slug}`}
                          className="group/item flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition-all hover:border-indigo-500 hover:bg-indigo-50 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-indigo-400 dark:hover:bg-indigo-500/10"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-slate-900 dark:text-white">
                              {eleve.name}
                            </p>
                            {eleve.professeur && (
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {eleve.professeur}
                              </p>
                            )}
                          </div>
                          <svg
                            className="h-5 w-5 text-slate-400 transition-transform group-hover/item:translate-x-1 group-hover/item:text-indigo-600 dark:group-hover/item:text-indigo-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-center text-sm italic text-slate-400">
                      Aucun participant inscrit
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Admin CTA */}
        <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-8 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-800">
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
            <div className="flex-1">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Espace jury
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Tableau de bord des résultats
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Consultez les évaluations en temps réel, comparez les notes des jurys et suivez les moyennes par niveau
              </p>
            </div>
            <Link
              href="/admin"
              className="group inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-indigo-500 hover:shadow-xl"
            >
              <span>Accéder au tableau</span>
              <svg
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
