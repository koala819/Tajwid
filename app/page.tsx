import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getElevesByNiveau } from '@/lib/eleves';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const creneaux = [
  { id: 'samedi-matin', label: 'Samedi matin' },
  { id: 'samedi-aprem', label: 'Samedi après-midi' },
  { id: 'dimanche-matin', label: 'Dimanche matin' },
  { id: 'dimanche-aprem', label: 'Dimanche après-midi' },
];

export default async function Home() {
  // Vérifier l'authentification
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect('/login?redirect=/');
  }

  // Compter le total de participants
  const allEleves = await getElevesByNiveau();
  const totalParticipants = allEleves.length;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-neutral-900">
      <main className="mx-auto max-w-2xl space-y-12 px-4 py-12 md:py-16">
        {/* Header */}
        <header className="space-y-6 border-b border-stone-200 pb-8 dark:border-neutral-700">
          <h1 className="text-4xl font-light tracking-tight text-stone-800 dark:text-stone-100 md:text-5xl">
            Concours de Tajwid
          </h1>
          <div className="flex items-baseline gap-3">
            <span className="text-6xl font-extralight text-amber-700 dark:text-amber-500">{totalParticipants}</span>
            <span className="text-sm uppercase tracking-wider text-stone-500 dark:text-stone-400">participants</span>
          </div>
          <p className="text-base text-stone-600 dark:text-stone-300">
            Sélectionnez votre créneau
          </p>
        </header>

        {/* Sélection du créneau */}
        <section className="space-y-4">
          {creneaux.map((creneau) => (
            <Link
              key={creneau.id}
              href={`/creneau/${creneau.id}`}
              className="group block rounded-lg border border-stone-200 bg-white p-6 shadow-sm transition-all hover:border-amber-300 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-amber-600"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-normal text-stone-800 dark:text-stone-100">
                  {creneau.label}
                </span>
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
            </Link>
          ))}
        </section>

        {/* Footer */}
        <footer className="border-t border-stone-200 pt-8 dark:border-neutral-700">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between">
            <Link
              href="/resultats"
              className="inline-flex items-center gap-2 text-sm text-stone-500 transition-colors hover:text-amber-700 dark:text-stone-400 dark:hover:text-amber-500"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <span>Voir les résultats</span>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-stone-500 transition-colors hover:text-amber-700 dark:text-stone-400 dark:hover:text-amber-500"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Administration</span>
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
