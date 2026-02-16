'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { criteres } from '@/data/criteres';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/data/translations';
import LanguageSwitch from '@/components/LanguageSwitch';

type ScoreMap = Record<string, number>;

type FormulaireNotesProps = {
  niveau: string;
  eleve: string;
};

const defaultScores: ScoreMap = criteres.reduce((acc, critere) => {
  acc[critere.id] = 0;
  return acc;
}, {} as ScoreMap);

export default function FormulaireNotes({ niveau, eleve }: FormulaireNotesProps) {
  const [scores, setScores] = useState<ScoreMap>(defaultScores);
  const [jury, setJury] = useState('');
  const [observations, setObservations] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const router = useRouter();
  const lang = useLanguage();

  // Récupérer le nom du jury depuis la session
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/user');
        if (response.ok) {
          const data = await response.json();
          setJury(data.username);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du nom d\'utilisateur', error);
      }
    };
    fetchUser();
  }, []);

  const total = useMemo(
    () => Object.values(scores).reduce((sum, value) => sum + value, 0),
    [scores]
  );

  const handleChange = (critereId: string, value: number) => {
    const critere = criteres.find((c) => c.id === critereId);
    if (!critere) return;

    // Limiter la valeur au maximum autorisé pour ce critère
    const limitedValue = Math.min(Math.max(0, value), critere.max);
    
    setScores((prev) => ({
      ...prev,
      [critereId]: limitedValue,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!jury) {
      setMessage('Erreur: Nom du jury non trouvé. Veuillez vous reconnecter.');
      return;
    }

    if (total === 0) {
      setMessage('Veuillez attribuer au moins une note.');
      return;
    }

    setStatus('saving');
    setMessage(null);

    const payload = {
      niveau,
      eleve,
      jury: jury.trim(),
      moyenne: Number((total / 10).toFixed(2)), // Moyenne sur 10 pour compatibilité
      total,
      scores: {
        ...scores,
        observations,
      },
    };

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error ?? 'Erreur lors de l\'enregistrement.');
      }

      setMessage('Note enregistrée avec succès.');
      setStatus('success');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Erreur inconnue.');
      setStatus('error');
    }
  };

  const handleConfirmSuccess = () => {
    router.push('/');
  };

  // Afficher un modal de succès
  if (status === 'success') {
    return (
      <div className="space-y-8 rounded-lg border border-stone-200 bg-white p-8 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-900/20">
            <svg className="h-8 w-8 text-amber-600 dark:text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-normal text-stone-800 dark:text-stone-100">
              {t('successTitle', lang)}
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              {t('successMessage', lang)}
            </p>
          </div>
          <button
            onClick={handleConfirmSuccess}
            className="w-full rounded-lg bg-amber-700 px-6 py-4 text-sm font-medium uppercase tracking-wider text-white shadow-sm transition hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500"
          >
            {t('backToHome', lang)}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 rounded-lg border border-stone-200 bg-white p-8 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
      <section className="flex items-center justify-between border-b border-stone-200 pb-6 dark:border-neutral-700">
        <div className="space-y-2">
          <p className="text-right text-sm font-normal text-stone-700 dark:text-stone-200" dir="rtl">
            توزيع النقاط لمسابقة التجويد (المجموع 100 نقطة)
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Distribution des points (Total 100 points)
          </p>
        </div>
        <LanguageSwitch />
      </section>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Grille des critères */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-stone-200 dark:border-neutral-700">
                {lang === 'ar' ? (
                  <>
                    <th className="p-3 text-right text-xs font-normal uppercase tracking-wider text-stone-500 dark:text-stone-400" dir="rtl">
                      المعايير
                    </th>
                    <th className="p-3 text-center text-xs font-normal uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      الحد الأقصى
                    </th>
                    <th className="p-3 text-center text-xs font-normal uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      النقطة
                    </th>
                  </>
                ) : (
                  <>
                    <th className="p-3 text-right text-xs font-normal uppercase tracking-wider text-stone-500 dark:text-stone-400" dir="rtl">
                      المعايير
                    </th>
                    <th className="p-3 text-left text-xs font-normal uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      Critères
                    </th>
                    <th className="p-3 text-center text-xs font-normal uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      Max
                    </th>
                    <th className="p-3 text-center text-xs font-normal uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      Note
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {criteres.map((critere) => (
                <tr
                  key={critere.id}
                  className="border-b border-stone-100 dark:border-neutral-700"
                >
                  <td className="p-3 text-right text-sm font-normal text-stone-800 dark:text-stone-100" dir="rtl">
                    {critere.label}
                  </td>
                  <td className="p-3 text-left text-xs text-stone-500 dark:text-stone-400">
                    {critere.labelFr}
                  </td>
                  <td className="p-3 text-center text-sm text-stone-600 dark:text-stone-300">
                    {critere.max}
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      min={0}
                      max={critere.max}
                      step={0.5}
                      value={scores[critere.id]}
                      onChange={(event) => handleChange(critere.id, Number(event.target.value))}
                      className="w-20 rounded border border-stone-300 bg-stone-50 px-3 py-2 text-center text-sm font-normal text-stone-800 outline-none transition focus:border-amber-500 focus:bg-white dark:border-neutral-600 dark:bg-neutral-700 dark:text-stone-100 dark:focus:border-amber-500"
                      required
                    />
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-stone-200 dark:border-neutral-600">
                <td className="p-4 text-right text-sm font-medium text-stone-800 dark:text-stone-100" dir="rtl">
                  المجموع
                </td>
                <td className="p-4 text-left text-sm font-medium text-stone-800 dark:text-stone-100">
                  TOTAL
                </td>
                <td className="p-4 text-center text-sm text-stone-600 dark:text-stone-300">
                  100
                </td>
                <td className="p-4 text-center text-2xl font-normal text-amber-700 dark:text-amber-500">
                  {total.toFixed(1)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Observations */}
        <div className="space-y-2">
          <label className="flex flex-col gap-2">
            <span className={`text-xs font-normal uppercase tracking-wider text-stone-500 dark:text-stone-400 ${lang === 'ar' ? 'text-right' : ''}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              {lang === 'ar' ? 'الملاحظات' : 'Observations'}
            </span>
            <textarea
              value={observations}
              onChange={(event) => setObservations(event.target.value)}
              placeholder={lang === 'ar' ? 'ملاحظات...' : 'Notes et observations...'}
              rows={3}
              className="w-full rounded border border-stone-300 bg-stone-50 px-4 py-3 text-sm font-normal text-stone-800 outline-none transition focus:border-amber-500 focus:bg-white dark:border-neutral-600 dark:bg-neutral-700 dark:text-stone-100 dark:focus:border-amber-500"
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
            />
          </label>
        </div>

        {/* Affichage du jury connecté */}
        {jury && (
          <div className="rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 dark:border-neutral-700 dark:bg-neutral-700">
            <p className="text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {lang === 'ar' ? 'الحكم' : 'Jury'}
            </p>
            <p className="mt-1 text-sm font-medium text-stone-800 dark:text-stone-100">{jury}</p>
          </div>
        )}

        {status === 'error' && message && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-normal text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'saving'}
          className="w-full rounded-lg bg-amber-700 px-6 py-4 text-sm font-medium uppercase tracking-wider text-white shadow-sm transition hover:bg-amber-600 disabled:cursor-wait disabled:opacity-50 dark:bg-amber-600 dark:hover:bg-amber-500"
        >
          {status === 'saving' ? t('saving', lang) : t('save', lang)}
        </button>
      </form>
    </div>
  );
}
