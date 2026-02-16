'use client';

import { useState, useEffect } from 'react';
import type { NoteRow } from '@/types/supabase';
import type { Niveau } from '@/data/niveaux';
import { criteresMap } from '@/data/criteres';
import { t, type Language } from '@/data/translations';
import EditNoteModal from '@/components/EditNoteModal';
import PublishToggle from '@/components/PublishToggle';

type AdminContentProps = {
  niveaux: Niveau[];
  notesGrouped: Record<string, NoteRow[]>;
};

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : '—';

export default function AdminContent({ niveaux, notesGrouped }: AdminContentProps) {
  const [selectedNiveau, setSelectedNiveau] = useState<string>(niveaux[0]?.slug || '');
  const [editingNote, setEditingNote] = useState<NoteRow | null>(null);
  const [lang, setLang] = useState<Language>('fr');

  // Charger la préférence de langue depuis localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem('app_langue') as Language;
    if (savedLang === 'ar' || savedLang === 'fr') {
      setLang(savedLang);
    }
  }, []);

  // Écouter les changements de langue
  useEffect(() => {
    const handleStorage = () => {
      const newLang = localStorage.getItem('app_langue') as Language;
      if (newLang === 'ar' || newLang === 'fr') {
        setLang(newLang);
      }
    };

    window.addEventListener('storage', handleStorage);
    const interval = setInterval(handleStorage, 100);

    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  // Sauvegarder la préférence de langue
  const toggleLang = () => {
    const newLang: Language = lang === 'fr' ? 'ar' : 'fr';
    setLang(newLang);
    localStorage.setItem('app_langue', newLang);
    window.dispatchEvent(new Event('storage'));
  };

  const currentNiveau = niveaux.find((n) => n.slug === selectedNiveau);
  const notesForNiveau = notesGrouped[selectedNiveau] ?? [];

  // Grouper par élève
  const groupedByEleve = notesForNiveau.reduce<Record<string, NoteRow[]>>((acc, note) => {
    acc[note.eleve] = acc[note.eleve] ?? [];
    acc[note.eleve].push(note);
    return acc;
  }, {});

  return (
    <>
      {/* Switch langue */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={toggleLang}
          className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-stone-200 dark:hover:bg-neutral-700"
        >
          <span>{lang === 'fr' ? '🇫🇷 Français' : '🇸🇦 العربية'}</span>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>
      </div>

      {/* Onglets des niveaux */}
      <div className="overflow-x-auto border-b border-stone-200 dark:border-neutral-700">
        <div className="flex gap-1">
          {niveaux.map((niveau) => {
            const count = (notesGrouped[niveau.slug] ?? []).length;
            return (
              <button
                key={niveau.slug}
                onClick={() => setSelectedNiveau(niveau.slug)}
                className={`whitespace-nowrap border-b-2 px-6 py-3 text-sm font-normal transition-colors ${
                  selectedNiveau === niveau.slug
                    ? 'border-amber-600 text-amber-700 dark:border-amber-500 dark:text-amber-400'
                    : 'border-transparent text-stone-500 hover:border-stone-300 hover:text-stone-700 dark:text-stone-400 dark:hover:border-neutral-600 dark:hover:text-stone-300'
                }`}
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
              >
                {lang === 'ar' ? niveau.labelAr : niveau.label}
                {count > 0 && (
                  <span className="ml-2 rounded-full bg-stone-100 px-2 py-0.5 text-xs dark:bg-neutral-700">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenu du niveau sélectionné */}
      {currentNiveau && (
        <div className="space-y-6">
          {Object.keys(groupedByEleve).length === 0 ? (
            <div className="rounded-lg border border-dashed border-stone-200 bg-white p-12 text-center dark:border-neutral-700 dark:bg-neutral-800">
              <p className="text-sm text-stone-500 dark:text-stone-400">
                {t('noNotes', lang)}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedByEleve).map(([eleveNom, notes]) => {
                const moyenne = notes.reduce((sum, n) => sum + n.total, 0) / notes.length;
                const hasEnoughJuries = notes.length >= 2;

                return (
                  <div
                    key={eleveNom}
                    className="rounded-lg border border-stone-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800"
                  >
                    {/* Header avec résultat final et toggle */}
                    <div className="mb-6 flex items-center justify-between border-b border-stone-200 pb-6 dark:border-neutral-700">
                      <div>
                        <h3 className="text-2xl font-normal text-stone-800 dark:text-stone-100">
                          {eleveNom}
                        </h3>
                        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                          {notes.length} {notes.length > 1 ? t('juries', lang) : t('jury', lang)}
                        </p>
                      </div>
                      <div className="flex items-center gap-6">
                        {hasEnoughJuries ? (
                          <>
                            <div className="text-right">
                              <p className="text-4xl font-normal text-amber-700 dark:text-amber-500">
                                {moyenne.toFixed(1)}
                              </p>
                              <p className="text-xs text-stone-500 dark:text-stone-400">{lang === 'ar' ? '١٠٠ /' : '/ 100'}</p>
                            </div>
                            <PublishToggle
                              notes={notes}
                              eleveNom={eleveNom}
                              moyenneFinale={moyenne}
                            />
                          </>
                        ) : (
                          <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                            {t('waitingSecondJury', lang)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Liste des notes de chaque jury */}
                    <div className="space-y-4">
                      {notes.map((note) => {
                        // Extraire les observations des scores
                        const { observations, ...scoresCriteres } = note.scores as Record<string, number | string>;
                        const observationsText = typeof observations === 'string' ? observations : '';

                        return (
                          <div
                            key={note.id}
                            className="space-y-4 rounded-lg border border-stone-100 bg-stone-50 p-5 dark:border-neutral-700 dark:bg-neutral-700/50"
                          >
                            {/* En-tête jury */}
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3">
                                  <span className="text-base font-medium text-stone-800 dark:text-stone-100">
                                    {note.jury}
                                  </span>
                                </div>
                                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                                  {formatDate(note.recorded_at)}
                                </p>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p className="text-2xl font-normal text-stone-800 dark:text-stone-100">
                                    {note.total}
                                  </p>
                                  <p className="text-xs text-stone-500 dark:text-stone-400">{lang === 'ar' ? '١٠٠ /' : '/ 100'}</p>
                                </div>
                                <button
                                  onClick={() => setEditingNote(note)}
                                  className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-600 transition-colors hover:border-amber-300 hover:bg-amber-50 dark:border-neutral-600 dark:bg-neutral-700 dark:text-stone-300 dark:hover:border-amber-600 dark:hover:bg-amber-900/20"
                                >
                                  {t('modify', lang)}
                                </button>
                              </div>
                            </div>

                            {/* Détail des scores */}
                            <div className="space-y-2">
                              <p className="text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">
                                {t('detailNotes', lang)}
                              </p>
                              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                {Object.entries(scoresCriteres).map(([critereId, score]) => {
                                  const critere = criteresMap[critereId];
                                  if (!critere) return null;

                                  return (
                                    <div
                                      key={critereId}
                                      className="flex items-center justify-between rounded border border-stone-200 bg-white px-3 py-2 dark:border-neutral-600 dark:bg-neutral-700"
                                      dir={lang === 'ar' ? 'rtl' : 'ltr'}
                                    >
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs text-stone-600 dark:text-stone-300 truncate">
                                          {lang === 'ar' ? critere.label : critere.labelFr}
                                        </p>
                                      </div>
                                      <div className={lang === 'ar' ? 'mr-3' : 'ml-3'}>
                                        <span className="text-sm font-medium text-stone-800 dark:text-stone-100">
                                          {score}
                                        </span>
                                        <span className="text-xs text-stone-400"> / {critere.max}</span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Observations/Commentaires */}
                            {observationsText && (
                              <div className="rounded-lg border border-stone-200 bg-white p-4 dark:border-neutral-600 dark:bg-neutral-700">
                                <p className="text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">
                                  {t('comments', lang)}
                                </p>
                                <p className="mt-2 text-sm text-stone-700 dark:text-stone-200">
                                  {observationsText}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal d'édition */}
      {editingNote && (
        <EditNoteModal
          note={editingNote}
          onClose={() => setEditingNote(null)}
          onSuccess={() => {
            setEditingNote(null);
            window.location.reload();
          }}
        />
      )}
    </>
  );
}
