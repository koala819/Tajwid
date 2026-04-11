'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/data/translations';
import LanguageSwitch from '@/components/LanguageSwitch';
import { getNiveauxPhaseResultats, niveauxConfig } from '@/data/niveaux';
import type { Eleve } from '@/data/niveaux';
import type { ResultatPhase } from '@/lib/notes';
import type { PhaseSaisie } from '@/lib/phaseSaisie';

type NiveauWithEleves = {
  slug: string;
  eleves: Eleve[];
};

type ClientResultatsProps =
  | {
      phaseSaisie: 'qualification';
      niveauxWithEleves: NiveauWithEleves[];
      totalParticipants: number;
    }
  | {
      phaseSaisie: 'demi_finale' | 'finale';
      resultatsParNiveau: ResultatPhase[][];
    };

const niveauxPhaseResultats = getNiveauxPhaseResultats();

function phaseLabelKey(phase: PhaseSaisie): 'phaseQualification' | 'phaseDemiFinale' | 'phaseFinale' {
  if (phase === 'qualification') return 'phaseQualification';
  if (phase === 'finale') return 'phaseFinale';
  return 'phaseDemiFinale';
}

export default function ClientResultats(props: ClientResultatsProps) {
  const lang = useLanguage();
  const isAr = lang === 'ar';
  const { phaseSaisie } = props;

  const title =
    phaseSaisie === 'qualification'
      ? t('resultsQualifTitle', lang)
      : phaseSaisie === 'demi_finale'
        ? t('resultsTitle', lang)
        : t('resultsFinaleTitle', lang);

  const subtitle =
    phaseSaisie === 'qualification'
      ? t('resultsQualifSubtitle', lang)
      : phaseSaisie === 'demi_finale'
        ? t('resultsDemiFinaleSubtitle', lang)
        : t('resultsFinaleSubtitle', lang);

  const bySlug =
    phaseSaisie === 'qualification'
      ? new Map(props.niveauxWithEleves.map((n) => [n.slug, n]))
      : null;

  return (
    <div
      className="min-h-screen bg-stone-50 dark:bg-neutral-900"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <main className="mx-auto max-w-6xl space-y-10 px-4 py-10 md:space-y-12 md:py-16">
        <header className="flex flex-col items-center gap-5 border-b border-stone-200 pb-8 dark:border-neutral-700 md:gap-6">
          <div className="flex w-full items-center justify-end">
            <LanguageSwitch />
          </div>
          <p className="w-full max-w-2xl rounded-lg bg-amber-50 px-4 py-3 text-center text-sm text-amber-950 dark:bg-amber-950/30 dark:text-amber-100">
            <span className="font-medium">{t(phaseLabelKey(phaseSaisie), lang)}</span>
            {' · '}
            {t('resultsPhaseEnvHint', lang)}
          </p>
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-light tracking-tight text-stone-800 dark:text-stone-100 md:text-5xl">
              {title}
            </h1>
            <p className="mx-auto max-w-xl text-base text-stone-600 dark:text-stone-300">{subtitle}</p>
          </div>

          {phaseSaisie === 'qualification' && (
            <div className="flex items-baseline justify-center gap-3">
              <span className="text-5xl font-extralight text-amber-700 dark:text-amber-500">
                {props.totalParticipants}
              </span>
              <span className="text-sm uppercase tracking-wider text-stone-500 dark:text-stone-400">
                {t('participants', lang)}
              </span>
            </div>
          )}
        </header>

        {phaseSaisie === 'qualification' && bySlug && (
          <>
            {props.niveauxWithEleves.length === 0 ? (
              <div className="rounded-lg border border-stone-200 bg-white p-8 text-center dark:border-neutral-700 dark:bg-neutral-800 sm:p-12">
                <p className="text-stone-500 dark:text-stone-400">{t('noQualifResults', lang)}</p>
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
                      <div className="rounded-lg border border-stone-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800 sm:p-6">
                        <p
                          className={`text-lg font-normal text-stone-700 dark:text-stone-200 ${isAr ? 'text-right' : 'text-left'}`}
                        >
                          {isAr ? niveauConfig.labelAr : niveauConfig.label}
                        </p>
                      </div>
                      <div className="space-y-3 sm:space-y-4">
                        {elevesSorted.map((eleve) => (
                          <div
                            key={eleve.id}
                            className="flex flex-col gap-3 rounded-lg border border-stone-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-6"
                          >
                            <h3 className="text-lg font-normal text-stone-800 dark:text-stone-100 sm:text-xl">
                              {eleve.name}
                            </h3>
                            <p className="text-2xl font-normal text-amber-700 dark:text-amber-500 sm:text-3xl">
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
          </>
        )}

        {(phaseSaisie === 'demi_finale' || phaseSaisie === 'finale') && (
          <div className="space-y-12">
            {niveauxPhaseResultats.map((niveauConfig, i) => {
              const resultats = props.resultatsParNiveau[i] ?? [];
              if (resultats.length === 0) return null;
              return (
                <section key={niveauConfig.slug} className="space-y-6">
                  <div className="rounded-lg border border-stone-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800 sm:p-6">
                    <p
                      className={`text-lg font-normal text-stone-700 dark:text-stone-200 ${isAr ? 'text-right' : 'text-left'}`}
                    >
                      {isAr ? niveauConfig.labelAr : niveauConfig.label}
                    </p>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    {resultats.map((r) => (
                      <div
                        key={`${r.niveau}-${r.eleve}`}
                        className="flex flex-col gap-3 rounded-lg border border-stone-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-6"
                      >
                        <h3 className="text-lg font-normal text-stone-800 dark:text-stone-100 sm:text-xl">
                          {r.eleve}
                        </h3>
                        <p className="text-2xl font-normal text-amber-700 dark:text-amber-500 sm:text-3xl">
                          {r.moyenne.toFixed(1)}/100
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
            {props.resultatsParNiveau.every((r) => r.length === 0) && (
              <div className="rounded-lg border border-stone-200 bg-white p-8 text-center dark:border-neutral-700 dark:bg-neutral-800 sm:p-12">
                <p className="text-stone-600 dark:text-stone-300">{t('noResultsPhase', lang)}</p>
                <p className="mt-3 text-sm text-stone-500 dark:text-stone-400">
                  {t('noResultsPhaseHelp', lang)}
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
