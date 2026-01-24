'use client';

import React, { useMemo, useState } from 'react';

// Critères officiels du concours de Tajwid avec pondérations (total 100 points)
const criteres = [
  { id: 'itidal', label: 'اعتدال التلاوة', labelFr: 'Modération de la récitation', max: 5 },
  { id: 'thiqah', label: 'صحة التشكيل وثقة القارئ', labelFr: 'Précision et confiance', max: 5 },
  { id: 'waqf', label: 'العناية بأحكام الوقف والابتداء', labelFr: 'Règles de pause/reprise', max: 5 },
  { id: 'lahn', label: 'الاحتراز من اللحن الجلي', labelFr: 'Éviter les erreurs évidentes', max: 30 },
  { id: 'tafkhim', label: 'تطبيق أحكام التفخيم والترقيق', labelFr: 'Emphatisation/Atténuation', max: 5 },
  { id: 'huruf', label: 'النطق الصحيح للحروف، مراعاة المخارج والصفات', labelFr: 'Prononciation correcte des lettres', max: 30 },
  { id: 'mudud', label: 'تطبيق أحكام المدود', labelFr: 'Règles d\'allongement', max: 5 },
  { id: 'nun_tanwin', label: 'تطبيق أحكام النون الساكنة والتنوين', labelFr: 'Noun Sakin et Tanwin', max: 5 },
  { id: 'mim_sakin', label: 'تطبيق أحكام الميم الساكنة', labelFr: 'Mim Sakin', max: 5 },
  { id: 'nun_mim', label: 'تطبيق أحكام النون والميم المشددتين', labelFr: 'Noun et Mim accentués', max: 5 },
  { id: 'iqlab', label: 'الإقلاب', labelFr: 'Iqlab', max: 5 },
  { id: 'qalqala', label: 'القلقلة', labelFr: 'Qalqala', max: 5 },
  { id: 'hifdh', label: 'الحفظ', labelFr: 'Mémorisation', max: 30 },
];

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
  const [status, setStatus] = useState<'idle' | 'saving'>('idle');

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

    if (!jury.trim()) {
      setMessage('Veuillez indiquer votre nom (jury).');
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
      // Réinitialiser après 2 secondes
      setTimeout(() => {
        setScores(defaultScores);
        setObservations('');
        setMessage(null);
      }, 2000);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Erreur inconnue.');
    } finally {
      setStatus('idle');
    }
  };

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900/70">
      <section className="space-y-2">
        <div className="rounded-lg bg-indigo-50 p-4 dark:bg-indigo-900/20">
          <h2 className="text-center text-lg font-bold text-indigo-900 dark:text-indigo-100" dir="rtl">
            توزيع النقاط لمسابقة التجويد (المجموع 100 نقطة)
          </h2>
          <p className="mt-1 text-center text-sm text-indigo-700 dark:text-indigo-300">
            Distribution des points pour le concours de Tajwid (Total 100 points)
          </p>
        </div>
        
        <div className="mt-4">
          <p className="text-sm font-medium text-slate-500">Élève</p>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{eleve}</h1>
          <p className="text-sm text-slate-500">Niveau : {niveau}</p>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Grille des critères */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                <th className="p-3 text-right font-semibold text-slate-700 dark:text-slate-200" dir="rtl">
                  المعايير
                </th>
                <th className="p-3 text-center font-semibold text-slate-700 dark:text-slate-200">
                  Critères
                </th>
                <th className="p-3 text-center font-semibold text-slate-700 dark:text-slate-200">
                  Max
                </th>
                <th className="p-3 text-center font-semibold text-slate-700 dark:text-slate-200">
                  Note
                </th>
              </tr>
            </thead>
            <tbody>
              {criteres.map((critere, index) => (
                <tr
                  key={critere.id}
                  className={`border-b border-slate-200 dark:border-slate-700 ${
                    index % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/50 dark:bg-slate-800/50'
                  }`}
                >
                  <td className="p-3 text-right font-medium text-slate-800 dark:text-slate-200" dir="rtl">
                    {critere.label}
                  </td>
                  <td className="p-3 text-left text-xs text-slate-600 dark:text-slate-400">
                    {critere.labelFr}
                  </td>
                  <td className="p-3 text-center font-semibold text-indigo-600 dark:text-indigo-400">
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
                      className="w-20 rounded-lg border border-slate-300 px-3 py-2 text-center font-semibold text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:ring-indigo-500/40"
                      required
                    />
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-slate-300 bg-indigo-50 font-bold dark:border-slate-600 dark:bg-indigo-900/20">
                <td className="p-3 text-right text-slate-900 dark:text-white" dir="rtl">
                  المجموع
                </td>
                <td className="p-3 text-left text-slate-900 dark:text-white">
                  TOTAL
                </td>
                <td className="p-3 text-center text-indigo-600 dark:text-indigo-400">
                  100
                </td>
                <td className="p-3 text-center text-2xl text-indigo-600 dark:text-indigo-400">
                  {total.toFixed(1)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Observations */}
        <div className="space-y-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-200" dir="rtl">
              الملاحظات (Observations)
            </span>
            <textarea
              value={observations}
              onChange={(event) => setObservations(event.target.value)}
              placeholder="Notes et observations..."
              rows={3}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900/40 dark:text-white dark:focus:ring-indigo-500/40"
            />
          </label>
        </div>

        {/* Nom du jury */}
        <div className="space-y-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-200">
              Nom du jury <span className="text-rose-500">*</span>
            </span>
            <input
              type="text"
              value={jury}
              onChange={(event) => setJury(event.target.value)}
              placeholder="Ex. M. Ahmed ou Mme Fatima"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900/40 dark:text-white dark:focus:ring-indigo-500/40"
              required
            />
          </label>
        </div>

        {message ? (
          <p className={`rounded-md px-4 py-2 text-sm font-medium ${
            message.includes('succès') 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-white'
          }`}>
            {message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={status === 'saving'}
          className="inline-flex w-full items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-wait disabled:bg-indigo-400"
        >
          {status === 'saving' ? 'Enregistrement…' : 'Enregistrer la note'}
        </button>
      </form>
    </div>
  );
}
