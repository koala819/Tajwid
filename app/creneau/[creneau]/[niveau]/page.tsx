import Link from 'next/link';
import { notFound } from 'next/navigation';
import { findNiveauConfig, slugify } from '@/data/niveaux';
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
    niveau: string;
  }>;
};

export default async function ElevesPage(props: PageProps) {
  const params = await props.params;
  const { creneau, niveau: niveauSlug } = params;

  const creneauLabel = creneauxLabels[creneau];
  const niveauConfig = findNiveauConfig(niveauSlug);

  if (!creneauLabel || !niveauConfig) {
    notFound();
  }

  // Charger les élèves du créneau et du niveau
  const elevesFromDb = await getElevesByNiveau(creneau);
  const elevesForNiveau = elevesFromDb
    .filter((eleve) => eleve.niveau === niveauSlug)
    .map((eleve) => ({
      id: eleve.id,
      prenom: eleve.prenom,
      nom: eleve.nom,
      name: `${eleve.prenom} ${eleve.nom}`,
      slug: slugify(`${eleve.nom} ${eleve.prenom}`),
      professeur: eleve.professeur,
      moyenne_qualif: eleve.moyenne_qualif,
    }))
    .sort((a, b) => {
      // Si on a des qualifiés avec notes, trier par moyenne décroissante
      if (a.moyenne_qualif && b.moyenne_qualif) {
        return b.moyenne_qualif - a.moyenne_qualif;
      }
      // Sinon trier par prénom
      return a.prenom.localeCompare(b.prenom, 'fr', { sensitivity: 'base' });
    });

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-neutral-900">
      <main className="mx-auto max-w-2xl space-y-12 px-4 py-12 md:py-16">
        {/* Bouton retour */}
        <Link
          href={`/creneau/${creneau}`}
          className="inline-flex items-center gap-2 text-sm text-stone-500 transition-colors hover:text-amber-700 dark:text-stone-400 dark:hover:text-amber-500"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </Link>

        {/* Header */}
        <header className="space-y-6 border-b border-stone-200 pb-8 dark:border-neutral-700">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {creneauLabel} · {niveauConfig.label}
            </p>
            <h1 className="text-right text-2xl font-normal text-stone-800 dark:text-stone-100 md:text-3xl" dir="rtl">
              {niveauConfig.labelAr}
            </h1>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-extralight text-amber-700 dark:text-amber-500">{elevesForNiveau.length}</span>
            <span className="text-sm uppercase tracking-wider text-stone-500 dark:text-stone-400">participants</span>
          </div>
        </header>

        {/* Liste des élèves */}
        {elevesForNiveau.length === 0 ? (
          <div className="rounded-lg border border-stone-200 bg-white p-12 text-center dark:border-neutral-700 dark:bg-neutral-800">
            <p className="text-sm text-stone-500">Aucun participant inscrit</p>
          </div>
        ) : (
          <section className="space-y-3">
            {elevesForNiveau.map((eleve) => (
              <Link
                key={eleve.id}
                href={`/notes/${niveauSlug}/${eleve.slug}`}
                className="group flex items-center justify-between rounded-lg border border-stone-200 bg-white p-5 shadow-sm transition-all hover:border-amber-300 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-amber-600"
              >
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-normal text-stone-800 dark:text-stone-100 truncate">
                    {eleve.name}
                  </h2>
                  {eleve.professeur && (
                    <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 truncate">
                      {eleve.professeur}
                    </p>
                  )}
                </div>

                {/* Note de qualification */}
                {eleve.moyenne_qualif && (
                  <div className="mx-4 flex-shrink-0">
                    <span className="rounded-md bg-amber-50 px-2 py-1 text-sm font-medium text-amber-700 dark:bg-amber-900/20 dark:text-amber-500">
                      {eleve.moyenne_qualif}
                    </span>
                  </div>
                )}
                
                <svg
                  className="h-5 w-5 flex-shrink-0 text-stone-400 transition-all group-hover:translate-x-1 group-hover:text-amber-600 dark:text-stone-500 dark:group-hover:text-amber-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
