'use client';

import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/data/translations';
import LanguageSwitch from '@/components/LanguageSwitch';
import type { NiveauResultat } from '@/lib/eleves';
import type { PhaseSaisie } from '@/lib/phaseSaisie';
import { criteres } from '@/data/criteres';
import type { NoteJury } from '@/lib/eleves';

/** Noms officiels des 3 jurys du concours */
const JURYS_OFFICIELS = ['Abderrahmane', 'Maya', 'Amina'];

/**
 * Retourne les étiquettes affichées pour chaque note.
 * Si un nom de jury est dupliqué, on le remplace par un nom manquant
 * de la liste officielle plutôt que d'afficher deux fois le même prénom.
 */
function juryLabels(notes: NoteJury[]): string[] {
  const labels = notes.map((n) => n.jury);
  const seen = new Set<string>();

  // Noms officiels absents des notes (ce sont les "vrais" noms des autres jurys)
  const nomsDansNotes = new Set(notes.map((n) => n.jury));
  const manquants = JURYS_OFFICIELS.filter((j) => !nomsDansNotes.has(j));
  let missingIdx = 0;

  for (let i = 0; i < labels.length; i++) {
    if (seen.has(labels[i])) {
      // Doublon : remplacer par le prochain nom manquant disponible
      if (missingIdx < manquants.length) {
        labels[i] = manquants[missingIdx++];
      }
    }
    seen.add(labels[i]);
  }

  return labels;
}

type ClientResultatsProps = {
  phaseSaisie: PhaseSaisie;
  niveaux: NiveauResultat[];
  totalParticipants: number;
};

export default function ClientResultats(props: ClientResultatsProps) {
  const lang = useLanguage();
  const isAr = lang === 'ar';
  const { phaseSaisie } = props;

  const niveauxOnglets = props.niveaux;
  const [selectedNiveau, setSelectedNiveau] = useState<string>(niveauxOnglets[0]?.slug ?? '');
  const [expandedEleveId, setExpandedEleveId] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-neutral-900" dir={isAr ? 'rtl' : 'ltr'}>
      <main className="mx-auto max-w-4xl space-y-8 px-4 py-10 md:py-16">

        {/* En-tête */}
        <header className="flex flex-col items-center gap-5 border-b border-stone-200 pb-8 dark:border-neutral-700 md:gap-6">
          <div className="flex w-full items-center justify-end">
            <LanguageSwitch />
          </div>
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-light tracking-tight text-stone-800 dark:text-stone-100 md:text-5xl">
              {title}
            </h1>
            <p className="mx-auto max-w-xl text-base text-stone-600 dark:text-stone-300">{subtitle}</p>
          </div>
          <div className="flex items-baseline justify-center gap-3">
            <span className="text-5xl font-extralight text-amber-700 dark:text-amber-500">
              {props.totalParticipants}
            </span>
            <span className="text-sm uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {t('participants', lang)}
            </span>
          </div>
        </header>

        {/* Onglets + liste (qualification, demi-finale, finale) */}
        <>
            {props.niveaux.length === 0 ? (
              <div className="rounded-lg border border-stone-200 bg-white p-8 text-center dark:border-neutral-700 dark:bg-neutral-800 sm:p-12">
                {phaseSaisie === 'finale' ? (
                  <>
                    <p className="text-stone-600 dark:text-stone-300">{t('noResultsPhase', lang)}</p>
                    <p className="mt-3 text-sm text-stone-500 dark:text-stone-400">
                      {t('noResultsPhaseHelp', lang)}
                    </p>
                  </>
                ) : (
                  <p className="text-stone-500 dark:text-stone-400">{t('noQualifResults', lang)}</p>
                )}
              </div>
            ) : (
              <>
                {/* Onglets */}
                <div className="-mx-4 border-b border-stone-200 dark:border-neutral-700">
                  <div
                    className="flex snap-x snap-mandatory gap-1 overflow-x-auto overscroll-x-contain px-4 pb-1 sm:gap-2 sm:px-0 [-webkit-overflow-scrolling:touch]"
                    role="tablist"
                  >
                    {props.niveaux.map((niveau) => {
                      const qualifCount = niveau.eleves.filter((e) => e.qualified).length;
                      return (
                        <button
                          key={niveau.slug}
                          type="button"
                          role="tab"
                          aria-selected={selectedNiveau === niveau.slug}
                          onClick={() => {
                            setSelectedNiveau(niveau.slug);
                            setExpandedEleveId(null);
                          }}
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
                          {qualifCount > 0 && (
                            <span className="ms-2 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs tabular-nums text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                              {qualifCount}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Liste des élèves */}
                {(() => {
                  const niveau = props.niveaux.find((n) => n.slug === selectedNiveau);
                  if (!niveau) return null;
                  const noHifdh = (niveau as NiveauResultat & { noHifdh?: boolean }).noHifdh;
                  const maxScore = noHifdh ? 75 : 100;

                  return (
                    <div className="overflow-hidden rounded-lg border border-stone-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
                      {niveau.eleves.map((eleve) => {
                        const isExpanded = expandedEleveId === eleve.id;
                        const score = eleve.moyenneGlobale;

                        return (
                          <div key={eleve.id} className="border-b border-stone-100 last:border-b-0 dark:border-neutral-700">

                            {/* Ligne principale */}
                            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5">
                              <h3 className="min-w-0 flex-1 text-base font-normal text-stone-800 dark:text-stone-100 sm:text-lg">
                                {eleve.name}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                {score != null && (
                                  <p className="tabular-nums text-xl font-normal text-amber-700 dark:text-amber-500 sm:text-2xl">
                                    {score % 1 === 0 ? score : score.toFixed(1)}
                                    <span className="text-sm font-normal text-stone-400 dark:text-stone-500">/{maxScore}</span>
                                  </p>
                                )}
                                {eleve.qualified ? (
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
                                {eleve.notes.length > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => setExpandedEleveId(isExpanded ? null : eleve.id)}
                                    className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs text-stone-500 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 dark:border-neutral-600 dark:text-stone-400 dark:hover:border-amber-600 dark:hover:bg-amber-900/20 dark:hover:text-amber-400"
                                  >
                                    {isExpanded ? (isAr ? 'إخفاء' : 'Masquer') : (isAr ? 'التفاصيل' : 'Détail')}
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Détail : une section par jury */}
                            {isExpanded && (
                              <div className="border-t border-stone-100 bg-stone-50 px-4 pb-4 pt-3 dark:border-neutral-700 dark:bg-neutral-900/40 space-y-4">
                                {(() => {
                                  const labels = juryLabels(eleve.notes);
                                  return eleve.notes.map((note, noteIdx) => {
                                    const { observations, ...scoresCriteres } = note.scores as Record<string, number | string>;
                                    return (
                                      <div key={noteIdx} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                          <p className="text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">
                                            {labels[noteIdx]}
                                          </p>
                                          <p className="tabular-nums text-sm font-medium text-stone-700 dark:text-stone-200">
                                            {note.total}/{maxScore}
                                          </p>
                                        </div>
                                        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                                          {criteres
                                            .filter((c) => !(noHifdh && c.id === 'hifdh'))
                                            .filter((c) => scoresCriteres[c.id] !== undefined)
                                            .map((c) => {
                                              const val = scoresCriteres[c.id] as number;
                                              const pct = val / c.max;
                                              const barColor =
                                                pct >= 0.8
                                                  ? 'bg-emerald-400 dark:bg-emerald-500'
                                                  : pct >= 0.5
                                                    ? 'bg-amber-400 dark:bg-amber-500'
                                                    : 'bg-red-400 dark:bg-red-500';
                                              return (
                                                <div
                                                  key={c.id}
                                                  className="rounded-md border border-stone-200 bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800"
                                                  dir={isAr ? 'rtl' : 'ltr'}
                                                >
                                                  <div className="flex items-center justify-between gap-2">
                                                    <p className="truncate text-xs text-stone-500 dark:text-stone-400">
                                                      {isAr ? c.label : c.labelFr}
                                                    </p>
                                                    <span className="shrink-0 tabular-nums text-sm font-medium text-stone-700 dark:text-stone-200">
                                                      {val}/{c.max}
                                                    </span>
                                                  </div>
                                                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-stone-100 dark:bg-neutral-700">
                                                    <div
                                                      className={`h-full rounded-full ${barColor} transition-all`}
                                                      style={{ width: `${Math.min(pct * 100, 100)}%` }}
                                                    />
                                                  </div>
                                                </div>
                                              );
                                            })}
                                        </div>
                                        {typeof observations === 'string' && observations && (
                                          <p className="rounded-md border border-stone-200 bg-white px-3 py-2 text-sm text-stone-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-stone-300">
                                            {observations}
                                          </p>
                                        )}
                                      </div>
                                    );
                                  });
                                })()}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </>
            )}
        </>
      </main>
    </div>
  );
}
