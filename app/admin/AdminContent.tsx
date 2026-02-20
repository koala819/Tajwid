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
  const [detailsForEleve, setDetailsForEleve] = useState<string | null>(null);
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
      {/* Onglets des niveaux */}
      <div className="overflow-x-auto border-b border-stone-200 dark:border-neutral-700">
        <div className="flex gap-1">
          {niveaux.map((niveau) => {
            const notes = notesGrouped[niveau.slug] ?? [];
            const count = new Set(notes.map((n) => n.eleve)).size;
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
            <div className="space-y-2 md:space-y-0 md:rounded-lg md:border md:border-stone-200 md:bg-white md:dark:border-neutral-700 md:dark:bg-neutral-800 overflow-hidden">
              {Object.entries(groupedByEleve).map(([eleveNom, notes]) => {
                const moyenne = notes.reduce((sum, n) => sum + n.total, 0) / notes.length;
                const hasEnoughJuries = notes.length >= 2;

                return (
                  <div
                    key={eleveNom}
                    className="flex flex-col gap-3 rounded-lg border border-stone-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800 md:flex-row md:items-center md:gap-6 md:rounded-none md:border-0 md:border-b md:border-stone-200 md:bg-transparent md:p-4 md:dark:border-neutral-700 md:dark:bg-transparent last:md:border-b-0"
                  >
                    <h3 className="min-w-0 flex-1 truncate text-lg font-normal text-stone-800 dark:text-stone-100">
                      {eleveNom}
                    </h3>
                    {hasEnoughJuries ? (
                      <>
                        <p className="shrink-0 tabular-nums text-2xl font-normal text-amber-700 dark:text-amber-500">
                          {moyenne.toFixed(1)}
                          <span className="text-base font-normal text-stone-500 dark:text-stone-400"> {lang === 'ar' ? '/ ١٠٠' : '/ 100'}</span>
                        </p>
                        <div className="flex shrink-0 items-center gap-4">
                          <PublishToggle
                            notes={notes}
                            eleveNom={eleveNom}
                            moyenneFinale={moyenne}
                          />
                          <button
                            type="button"
                            onClick={() => setDetailsForEleve(eleveNom)}
                            className="shrink-0 text-sm font-medium text-amber-700 underline decoration-amber-700/50 underline-offset-2 hover:decoration-amber-700 dark:text-amber-500 dark:decoration-amber-500/50 dark:hover:decoration-amber-500"
                          >
                            {t('details', lang)}
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex shrink-0 flex-wrap items-center gap-3 md:ml-auto">
                        <span className="rounded-full bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                          {t('waitingSecondJury', lang)}
                        </span>
                        <button
                          type="button"
                          onClick={() => setDetailsForEleve(eleveNom)}
                          className="text-sm font-medium text-amber-700 underline decoration-amber-700/50 underline-offset-2 hover:decoration-amber-700 dark:text-amber-500 dark:decoration-amber-500/50 dark:hover:decoration-amber-500"
                        >
                          {t('details', lang)}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal Détails (détail par jury) */}
      {detailsForEleve && (() => {
        const notes = groupedByEleve[detailsForEleve] ?? [];
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="details-modal-title"
          >
            <div
              className="absolute inset-0 bg-stone-900/60 dark:bg-neutral-950/70"
              onClick={() => setDetailsForEleve(null)}
              aria-hidden
            />
            <div className="relative max-h-[90vh] w-full max-w-lg overflow-hidden rounded-xl border border-stone-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex items-center justify-between border-b border-stone-200 p-4 dark:border-neutral-700">
                <h2 id="details-modal-title" className="text-lg font-medium text-stone-800 dark:text-stone-100">
                  {detailsForEleve}
                </h2>
                <button
                  type="button"
                  onClick={() => setDetailsForEleve(null)}
                  className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-neutral-700 dark:hover:text-stone-300"
                  aria-label={lang === 'ar' ? 'إغلاق' : 'Fermer'}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="max-h-[calc(90vh-4rem)] overflow-y-auto p-4 space-y-4">
                {notes.map((note) => {
                  const { observations, ...scoresCriteres } = note.scores as Record<string, number | string>;
                  const observationsText = typeof observations === 'string' ? observations : '';

                  return (
                    <div
                      key={note.id}
                      className="space-y-3 rounded-lg border border-stone-200 bg-stone-50 p-4 dark:border-neutral-700 dark:bg-neutral-700/50"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="font-medium text-stone-800 dark:text-stone-100">{note.jury}</p>
                          <p className="text-xs text-stone-500 dark:text-stone-400">{formatDate(note.recorded_at)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-xl font-normal text-stone-800 dark:text-stone-100">
                            {note.total}
                            <span className="text-sm text-stone-500 dark:text-stone-400"> {lang === 'ar' ? '/ ١٠٠' : '/ 100'}</span>
                          </p>
                          <button
                            onClick={() => setEditingNote(note)}
                            className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-600 hover:border-amber-300 hover:bg-amber-50 dark:border-neutral-600 dark:bg-neutral-700 dark:text-stone-300 dark:hover:border-amber-600 dark:hover:bg-amber-900/20"
                          >
                            {t('modify', lang)}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">
                          {t('detailNotes', lang)}
                        </p>
                        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                          {Object.entries(scoresCriteres).map(([critereId, score]) => {
                            const critere = criteresMap[critereId];
                            if (!critere) return null;
                            return (
                              <div
                                key={critereId}
                                className="flex items-center justify-between rounded border border-stone-200 bg-white px-3 py-2 dark:border-neutral-600 dark:bg-neutral-700"
                                dir={lang === 'ar' ? 'rtl' : 'ltr'}
                              >
                                <p className="truncate text-xs text-stone-600 dark:text-stone-300">
                                  {lang === 'ar' ? critere.label : critere.labelFr}
                                </p>
                                <span className="text-sm font-medium text-stone-800 dark:text-stone-100">
                                  {score} / {critere.max}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      {observationsText ? (
                        <div className="rounded-lg border border-stone-200 bg-white p-3 dark:border-neutral-600 dark:bg-neutral-700">
                          <p className="text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">
                            {t('comments', lang)}
                          </p>
                          <p className="mt-1 text-sm text-stone-700 dark:text-stone-200">{observationsText}</p>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

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
