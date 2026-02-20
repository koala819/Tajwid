'use client';

import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/data/translations';
import FormulaireNotes from '@/components/FormulaireNotes';
import type { Niveau } from '@/data/niveaux';

type Eleve = {
  name: string;
  professeur?: string;
};

type ClientNotePageProps = {
  niveauConfig: Niveau;
  eleve: Eleve;
  phaseSaisie: string;
};

const phaseToLabelKey: Record<string, string> = {
  qualification: 'phaseQualification',
  demi_finale: 'phaseDemiFinale',
  finale: 'phaseFinale',
};

export default function ClientNotePage({ niveauConfig, eleve, phaseSaisie }: ClientNotePageProps) {
  const lang = useLanguage();
  const phaseLabel = phaseSaisie ? t(phaseToLabelKey[phaseSaisie] as any, lang) : null;

  return (
    <main className="min-h-screen bg-stone-50 py-12 dark:bg-neutral-900 md:py-16">
      <div className="mx-auto max-w-4xl space-y-12 px-4">
        {/* Bouton retour */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-stone-500 transition-colors hover:text-amber-700 dark:text-stone-400 dark:hover:text-amber-500"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t('back', lang)}
        </Link>

        <header className="space-y-4 border-b border-stone-200 pb-8 dark:border-neutral-700">
          {lang === 'ar' ? (
            <p className="text-right text-base font-normal text-stone-600 dark:text-stone-300" dir="rtl">
              {niveauConfig.labelAr}
            </p>
          ) : (
            <p className="text-base font-normal text-stone-600 dark:text-stone-300">
              {niveauConfig.label}
            </p>
          )}
          <h1 className="text-3xl font-normal tracking-tight text-stone-800 dark:text-stone-100 md:text-4xl">
            {eleve.name}
          </h1>
          {eleve.professeur && (
            <p className="text-sm text-stone-500 dark:text-stone-400">
              {lang === 'ar' ? 'الأستاذ' : t('professor', lang)}: {eleve.professeur}
            </p>
          )}
          {phaseLabel ? (
            <p className="text-sm font-medium text-amber-700 dark:text-amber-500">
              {t('savingPhaseLabel', lang)} : {phaseLabel}
            </p>
          ) : (
            <p className="text-sm text-stone-500 dark:text-stone-400">
              {t('savingPhaseDefault', lang)}
            </p>
          )}
        </header>

        <FormulaireNotes niveau={niveauConfig.slug} eleve={eleve.name} />
      </div>
    </main>
  );
}
