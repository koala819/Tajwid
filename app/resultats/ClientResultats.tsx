'use client';

import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/data/translations';
import LanguageSwitch from '@/components/LanguageSwitch';
import { getNiveauxPhaseResultats, niveauxConfig } from '@/data/niveaux';
import type { Eleve } from '@/data/niveaux';
import type { ResultatPhase } from '@/lib/notes';
import type { PhaseSaisie } from '@/lib/phaseSaisie';

type NiveauWithEleves = {
  slug: string;
  label: string;
  labelAr: string;
  eleves: Eleve[];
};

type ClientResultatsProps =
  | {
      phaseSaisie: 'qualification';
      niveauxWithEleves: NiveauWithEleves[];
      totalParticipants: number;
      qualifiedIds: string[];
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

  const niveauxPourOnglets =
    phaseSaisie === 'qualification' ? props.niveauxWithEleves : [];
  const [selectedNiveau, setSelectedNiveau] = useState<string>(
    niveauxPourOnglets[0]?.slug ?? '',
  );

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

  const qualifiedSet =
    phaseSaisie === 'qualification' ? new Set(props.qualifiedIds) : null;

  return (
    <div
      className="min-h-screen bg-stone-50 dark:bg-neutral-900"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <main className="mx-auto max-w-4xl space-y-8 px-4 py-10 md:py-16">
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

        {phaseSaisie === 'qualification' && (
          <>
            {props.niveauxWithEleves.length === 0 ? (
              <div className="rounded-lg border border-stone-200 bg-white p-8 text-center dark:border-neutral-700 dark:bg-neutral-800 sm:p-12">
                <p className="text-stone-500 dark:text-stone-400">{t('noQualifResults', lang)}</p>
              </div>
            ) : (
              <>
                {/* Onglets par niveau */}
                <div className="-mx-4 border-b border-stone-200 dark:border-neutral-700">
                  <div
                    className="flex snap-x snap-mandatory gap-1 overflow-x-auto overscroll-x-contain px-4 pb-1 sm:gap-2 sm:px-0 [-webkit-overflow-scrolling:touch]"
                    role="tablist"
                  >
                    {props.niveauxWithEleves.map((niveau) => {
                      const qualifiedCount = niveau.eleves.filter((e) => qualifiedSet?.has(e.id)).length;
                      return (
                        <button
                          key={niveau.slug}
                          type="button"
                          role="tab"
                          aria-selected={selectedNiveau === niveau.slug}
                          onClick={() => setSelectedNiveau(niveau.slug)}
                          className={`shrink-0 snap-start border-b-2 px-3 py-3 text-sm font-normal transition-colors min-[480px]:px-5 sm:px-6 ${
                            selectedNiveau === niveau.slug
                              ? 'border-amber-600 text-amber-700 dark:border-amber-500 dark:text-amber-400'
                              : 'border-transparent text-stone-500 hover:border-stone-300 hover:text-stone-700 dark:text-stone-400 dark:hover:border-neutral-600 dark:hover:text-stone-300'
                          }`}
                          dir={isAr ? 'rtl' : 'ltr'}
                        >
                          <span className="whitespace-nowrap">
                            {isAr ? niveau.labelAr : niveau.label}
                          </span>
                          {qualifiedCount > 0 && (
                            <span className="ms-2 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs tabular-nums text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                              {qualifiedCount}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Liste des élèves du niveau sélectionné */}
                {(() => {
                  const niveau = props.niveauxWithEleves.find((n) => n.slug === selectedNiveau);
                  if (!niveau) return null;

                  const elevesSorted = [...niveau.eleves].sort((a, b) => {
                    const isQualA = qualifiedSet?.has(a.id) ? 1 : 0;
                    const isQualB = qualifiedSet?.has(b.id) ? 1 : 0;
                    if (isQualB !== isQualA) return isQualB - isQualA;
                    const ma = a.moyenne_qualif ?? -1;
                    const mb = b.moyenne_qualif ?? -1;
                    if (mb !== ma) return mb - ma;
                    return a.prenom.localeCompare(b.prenom, 'fr', { sensitivity: 'base' });
                  });

                  return (
                    <div className="space-y-2 overflow-hidden rounded-lg border border-stone-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
                      {elevesSorted.map((eleve) => {
                        const isQualified = qualifiedSet?.has(eleve.id) ?? false;
                        return (
                          <div
                            key={eleve.id}
                            className="flex flex-col gap-3 border-b border-stone-100 p-4 last:border-b-0 dark:border-neutral-700 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-5"
                          >
                            <h3 className="text-base font-normal text-stone-800 dark:text-stone-100 sm:text-lg">
                              {eleve.name}
                            </h3>
                            <div className="flex items-center gap-3">
                              {eleve.moyenne_qualif != null && (
                                <p className="tabular-nums text-xl font-normal text-amber-700 dark:text-amber-500 sm:text-2xl">
                                  {eleve.moyenne_qualif}
                                  <span className="text-sm font-normal text-stone-400 dark:text-stone-500">/100</span>
                                </p>
                              )}
                              {isQualified ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                  </svg>
                                  {isAr ? 'مؤهَّل' : 'Qualifié'}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-sm font-medium text-stone-400 dark:bg-neutral-700 dark:text-stone-500">
                                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                                  </svg>
                                  {isAr ? 'غير مؤهَّل' : 'Non qualifié'}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </>
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
                    {resultats.map((r) => {
                      const maxScore = niveauConfig.noHifdh ? 75 : 100;
                      return (
                        <div
                          key={`${r.niveau}-${r.eleve}`}
                          className="flex flex-col gap-3 rounded-lg border border-stone-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-6"
                        >
                          <h3 className="text-lg font-normal text-stone-800 dark:text-stone-100 sm:text-xl">
                            {r.eleve}
                          </h3>
                          <p className="text-2xl font-normal text-amber-700 dark:text-amber-500 sm:text-3xl">
                            {r.moyenne.toFixed(1)}
                            <span className="text-base font-normal text-stone-500 dark:text-stone-400">/{maxScore}</span>
                          </p>
                        </div>
                      );
                    })}
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
