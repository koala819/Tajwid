'use client';

import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/data/translations';
import LanguageSwitch from '@/components/LanguageSwitch';
import type { Niveau, Eleve } from '@/data/niveaux';
import type { EnseignantPourNote } from '@/lib/enseignants';

type ClientNiveauElevesProps = {
  creneau: string;
  niveauSlug: string;
  niveauConfig: Niveau;
  elevesForNiveau: Eleve[];
  enseignantNote1: EnseignantPourNote;
  enseignantNote2: EnseignantPourNote;
};

export default function ClientNiveauEleves({
  creneau,
  niveauSlug,
  niveauConfig,
  elevesForNiveau,
  enseignantNote1,
  enseignantNote2,
}: ClientNiveauElevesProps) {
  const lang = useLanguage();

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-neutral-900">
      <main className="mx-auto max-w-2xl space-y-12 px-4 py-12 md:py-16">
        {/* Bouton retour + switch langue */}
        <div className="flex items-center justify-between">
          <Link
            href={`/creneau/${creneau}`}
            className="inline-flex items-center gap-2 text-sm text-stone-500 transition-colors hover:text-amber-700 dark:text-stone-400 dark:hover:text-amber-500"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {t('back', lang)}
          </Link>
          <LanguageSwitch />
        </div>

        {/* Header */}
        <header className="space-y-6 border-b border-stone-200 pb-8 dark:border-neutral-700">
          <div className="space-y-2">
            {lang === 'ar' ? (
              <h1 className="text-right text-2xl font-normal text-stone-800 dark:text-stone-100 md:text-3xl" dir="rtl">
                {niveauConfig.labelAr}
              </h1>
            ) : (
              <>
                <p className="text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  {t(creneau as any, lang)} · {niveauConfig.label}
                </p>
                <h1 className="text-right text-2xl font-normal text-stone-800 dark:text-stone-100 md:text-3xl" dir="rtl">
                  {niveauConfig.labelAr}
                </h1>
              </>
            )}
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-extralight text-amber-700 dark:text-amber-500">
              {elevesForNiveau.length}
            </span>
            <span className="text-sm uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {t('participants', lang)}
            </span>
          </div>
        </header>

        {/* Liste des élèves */}
        {elevesForNiveau.length === 0 ? (
          <div className="rounded-lg border border-stone-200 bg-white p-12 text-center dark:border-neutral-700 dark:bg-neutral-800">
            <p className="text-sm text-stone-500">
              {lang === 'ar' ? 'لا يوجد مشاركون مسجلون' : 'Aucun participant inscrit'}
            </p>
          </div>
        ) : (
          <section className="space-y-3">
            {elevesForNiveau.map((eleve) => (
              <Link
                key={eleve.id}
                href={`/notes/${niveauSlug}/${eleve.slug}`}
                className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border border-stone-200 bg-white p-5 shadow-sm transition-all hover:border-amber-300 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-amber-600"
              >
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-normal text-stone-800 dark:text-stone-100 truncate">
                    {eleve.name}
                  </h2>
                  {eleve.professeur && (
                    <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 truncate">
                      {lang === 'ar' ? 'الأستاذ' : t('professor', lang)}: {eleve.professeur}
                    </p>
                  )}
                  {/* Détail des notes (rattachées aux enseignants) et statut */}
                  {(eleve.note1 != null || eleve.note2 != null || eleve.moyenne_qualif != null || eleve.observation) && (
                    <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-stone-500 dark:text-stone-400">
                      {eleve.note1 != null && (
                        <span>{t('note1', lang)} ({enseignantNote1?.nom ?? '…'}): {eleve.note1}</span>
                      )}
                      {eleve.note2 != null && (
                        <span>{t('note2', lang)} ({enseignantNote2?.nom ?? '…'}): {eleve.note2}</span>
                      )}
                      {eleve.moyenne_qualif != null && (
                        <span className="font-medium text-amber-700 dark:text-amber-500">
                          {t('moyenneQualif', lang)}: {eleve.moyenne_qualif}
                        </span>
                      )}
                      {eleve.observation && (
                        <span>{t('obsQualif', lang)}: {eleve.observation}</span>
                      )}
                    </dl>
                  )}
                </div>

                {eleve.moyenne_qualif != null && (
                  <div className="flex-shrink-0">
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
