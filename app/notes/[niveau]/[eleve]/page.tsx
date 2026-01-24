import { notFound } from 'next/navigation';
import Link from 'next/link';

import FormulaireNotes from '@/components/FormulaireNotes';
import { findNiveauConfig } from '@/data/niveaux';
import { findEleve } from '@/lib/eleves';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{
    niveau: string;
    eleve: string;
  }>;
};

export default async function Page(props: PageProps) {
  const params = await props.params;
  
  const niveauConfig = findNiveauConfig(params.niveau);
  const eleve = await findEleve(params.niveau, params.eleve);

  if (!niveauConfig || !eleve) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 py-10 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl space-y-8 px-4">
        {/* Bouton retour */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour aux participants
        </Link>

        <header className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">
            {niveauConfig.label}
          </p>
          <p className="text-right text-sm font-semibold text-slate-700 dark:text-slate-300" dir="rtl">
            {niveauConfig.labelAr}
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">{eleve.name}</h1>
          {eleve.professeur && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Professeur : {eleve.professeur}
            </p>
          )}
          <p className="text-slate-500 dark:text-slate-300">
            Chaque jury note l&apos;élève individuellement sur 10 critères. Les données sont envoyées
            automatiquement depuis ce formulaire.
          </p>
        </header>

        <FormulaireNotes niveau={niveauConfig.label} eleve={eleve.name} />
      </div>
    </main>
  );
}
