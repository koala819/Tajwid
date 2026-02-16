import Link from 'next/link';
import { notFound } from 'next/navigation';
import { niveauxConfig } from '@/data/niveaux';
import { getElevesByNiveau } from '@/lib/eleves';

export const dynamic = 'force-dynamic';

const creneauxLabels: Record<string, string> = {
  'samedi-matin': 'Samedi matin',
  'samedi-aprem': 'Samedi après-midi',
  'dimanche-matin': 'Dimanche matin',
  'dimanche-aprem': 'Dimanche après-midi',
};

type PageProps = {
  params: Promise<{
    creneau: string;
  }>;
};

export default async function CreneauPage(props: PageProps) {
  const params = await props.params;
  const creneau = params.creneau;

  const creneauLabel = creneauxLabels[creneau];
  if (!creneauLabel) {
    notFound();
  }

  // Charger tous les élèves du créneau
  const elevesFromDb = await getElevesByNiveau(creneau);

  // Compter les élèves par niveau
  const niveauxAvecComptage = niveauxConfig.map((niveau) => {
    const count = elevesFromDb.filter((e) => e.niveau === niveau.slug).length;
    return {
      ...niveau,
      count,
    };
  }).filter((niveau) => niveau.count > 0); // Garder uniquement les niveaux avec des élèves

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-neutral-900">
      <main className="mx-auto max-w-2xl space-y-12 px-4 py-12 md:py-16">
        {/* Bouton retour */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-stone-500 transition-colors hover:text-amber-700 dark:text-stone-400 dark:hover:text-amber-500"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </Link>

        {/* Header */}
        <header className="space-y-4 border-b border-stone-200 pb-8 dark:border-neutral-700">
          <h1 className="text-4xl font-light tracking-tight text-stone-800 dark:text-stone-100 md:text-5xl">
            {creneauLabel}
          </h1>
          <p className="text-base text-stone-600 dark:text-stone-300">
            Sélectionnez un niveau
          </p>
        </header>

        {/* Liste des niveaux */}
        {niveauxAvecComptage.length === 0 ? (
          <div className="rounded-lg border border-stone-200 bg-white p-12 text-center dark:border-neutral-700 dark:bg-neutral-800">
            <p className="text-sm text-stone-500">Aucun participant inscrit</p>
          </div>
        ) : (
          <section className="space-y-4">
            {niveauxAvecComptage.map((niveau) => (
              <Link
                key={niveau.slug}
                href={`/creneau/${creneau}/${niveau.slug}`}
                className="group block rounded-lg border border-stone-200 bg-white p-6 shadow-sm transition-all hover:border-amber-300 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-amber-600"
              >
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    {niveau.label}
                  </p>
                  <p className="text-right text-base font-normal text-stone-800 dark:text-stone-100" dir="rtl">
                    {niveau.labelAr}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-stone-600 dark:text-stone-300">
                      {niveau.count} participant{niveau.count > 1 ? 's' : ''}
                    </p>
                    <svg
                      className="h-5 w-5 text-stone-400 transition-all group-hover:translate-x-1 group-hover:text-amber-600 dark:text-stone-500 dark:group-hover:text-amber-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
