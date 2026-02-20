'use client';

import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/data/translations';

type Creneau = {
  id: string;
  label: string;
};

type ClientHomeProps = {
  creneaux: Creneau[];
  totalParticipants: number;
};

export default function ClientHome({ creneaux, totalParticipants }: ClientHomeProps) {
  const lang = useLanguage();

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-neutral-900">
      <main className="mx-auto max-w-2xl space-y-12 px-4 py-12 md:py-16">
        {/* Titre sur deux lignes, centré */}
        <header className="border-b border-stone-200 pb-8 text-center dark:border-neutral-700">
          <h1 className="text-4xl font-light tracking-tight text-stone-800 dark:text-stone-100 md:text-5xl" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <span className="block">{t('titleLine1', lang)}</span>
            <span className="block text-amber-700 dark:text-amber-500">{t('titleLine2', lang)}</span>
          </h1>
        </header>

        {/* Créneaux */}
        <section className="space-y-4">
          {creneaux.map((creneau) => (
            <Link
              key={creneau.id}
              href={`/creneau/${creneau.id}`}
              className="group block rounded-lg border border-stone-200 bg-white p-6 shadow-sm transition-all hover:border-amber-300 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-amber-600"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-normal text-stone-800 dark:text-stone-100">
                  {t(creneau.id as any, lang)}
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

        {/* X PARTICIPANTS, centré */}
        <div className="flex items-baseline justify-center gap-3">
          <span className="text-6xl font-extralight text-amber-700 dark:text-amber-500">{totalParticipants}</span>
          <span className="text-sm uppercase tracking-wider text-stone-500 dark:text-stone-400">
            {t('participants', lang)}
          </span>
        </div>

        {/* Gestion des notes (en couleur) */}
        <Link
          href="/admin"
          className="group block rounded-lg border-2 border-amber-400 bg-amber-50 p-6 shadow-sm transition-all hover:border-amber-500 hover:bg-amber-100 hover:shadow-md dark:border-amber-600 dark:bg-amber-950/30 dark:hover:border-amber-500 dark:hover:bg-amber-950/50"
        >
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-amber-800 dark:text-amber-200">
              {t('admin', lang)}
            </span>
            <svg
              className="h-5 w-5 text-amber-600 transition-all group-hover:translate-x-1 group-hover:text-amber-700 dark:text-amber-400 dark:group-hover:text-amber-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      </main>
    </div>
  );
}
