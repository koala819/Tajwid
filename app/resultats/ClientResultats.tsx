'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/data/translations';
import LanguageSwitch from '@/components/LanguageSwitch';
import { niveauxConfig } from '@/data/niveaux';
import type { Eleve } from '@/data/niveaux';

type NiveauWithEleves = {
  slug: string;
  eleves: Eleve[];
};

type ClientResultatsProps = {
  niveauxWithEleves: NiveauWithEleves[];
  totalParticipants: number;
};

export default function ClientResultats({
  niveauxWithEleves,
  totalParticipants,
}: ClientResultatsProps) {
  const lang = useLanguage();
  const bySlug = new Map(niveauxWithEleves.map((n) => [n.slug, n]));
  const isAr = lang === 'ar';

  return (
    <div
      className="min-h-screen bg-stone-50 dark:bg-neutral-900"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <main className="mx-auto max-w-6xl space-y-12 px-4 py-12 md:py-16">
        <header className="flex flex-col items-center gap-6 border-b border-stone-200 pb-8 dark:border-neutral-700">
          <div className="flex w-full items-center justify-end">
            <LanguageSwitch />
          </div>
          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-light tracking-tight text-stone-800 dark:text-stone-100 md:text-5xl">
              {t('resultsQualifTitle', lang)}
            </h1>
            <p className="text-base text-stone-600 dark:text-stone-300">
              {t('resultsQualifSubtitle', lang)}
            </p>
          </div>
          <div className="flex items-baseline justify-center gap-3">
            <span className="text-5xl font-extralight text-amber-700 dark:text-amber-500">
              {totalParticipants}
            </span>
            <span className="text-sm uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {t('participants', lang)}
            </span>
          </div>
        </header>

        {niveauxWithEleves.length === 0 ? (
          <div className="rounded-lg border border-stone-200 bg-white p-12 text-center dark:border-neutral-700 dark:bg-neutral-800">
            <p className="text-stone-500 dark:text-stone-400">
              {t('noQualifResults', lang)}
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {niveauxConfig.map((niveauConfig) => {
              const niveau = bySlug.get(niveauConfig.slug);
              if (!niveau || niveau.eleves.length === 0) return null;

              const elevesSorted = [...niveau.eleves].sort((a, b) => {
                const ma = a.moyenne_qualif ?? 0;
                const mb = b.moyenne_qualif ?? 0;
                if (mb !== ma) return mb - ma;
                return a.prenom.localeCompare(b.prenom, 'fr', { sensitivity: 'base' });
              });

              return (
                <section key={niveau.slug} className="space-y-6">
                  <div className="rounded-lg border border-stone-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
                    <p className="text-right text-lg font-normal text-stone-700 dark:text-stone-200">
                      {isAr ? niveauConfig.labelAr : niveauConfig.label}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {elevesSorted.map((eleve) => (
                      <div
                        key={eleve.id}
                        className="flex items-center justify-between gap-4 rounded-lg border border-stone-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
                      >
                        <h3 className="text-xl font-normal text-stone-800 dark:text-stone-100">
                          {eleve.name}
                        </h3>
                        <p className="text-3xl font-normal text-amber-700 dark:text-amber-500">
                          {eleve.moyenne_qualif != null
                            ? `${eleve.moyenne_qualif}/100`
                            : '—'}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
