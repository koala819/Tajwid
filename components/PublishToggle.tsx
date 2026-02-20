'use client';

import { useState, useEffect } from 'react';
import type { NoteRow } from '@/types/supabase';
import { t, type Language } from '@/data/translations';

type PublishToggleProps = {
  notes: NoteRow[];
  eleveNom: string;
  moyenneFinale: number;
};

export default function PublishToggle({ notes, eleveNom, moyenneFinale }: PublishToggleProps) {
  const allPublished = notes.every((n) => n.publie);
  const [isPublished, setIsPublished] = useState(allPublished);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<Language>('fr');

  useEffect(() => {
    const savedLang = localStorage.getItem('admin_langue') as Language;
    if (savedLang === 'ar' || savedLang === 'fr') {
      setLang(savedLang);
    }

    const handleStorage = () => {
      const newLang = localStorage.getItem('admin_langue') as Language;
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

  const handleToggle = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/notes/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noteIds: notes.map((n) => n.id),
          publie: !isPublished,
        }),
      });

      if (response.ok) {
        setIsPublished(!isPublished);
      }
    } catch (error) {
      console.error('Erreur publication', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      title={isPublished ? t('published', lang) : t('hidden', lang)}
      className="flex cursor-pointer items-center gap-3 transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
    >
      <span className="text-sm text-stone-600 dark:text-stone-300" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        {loading ? (lang === 'ar' ? 'جاري التحميل...' : 'Chargement...') : t('showOnResultsPage', lang)}
      </span>
      {/* Toggle type soleil/lune : pilule avec curseur et icône (même couleur que la note 81 / 100) */}
      <span
        className={`relative inline-flex h-8 w-14 shrink-0 rounded-full transition-colors ${
          isPublished ? 'bg-amber-700 dark:bg-amber-500' : 'bg-stone-200 dark:bg-neutral-600'
        }`}
        aria-hidden
      >
        <span
          className={`absolute top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow transition-[left] ${
            isPublished ? 'left-7 text-amber-700 dark:text-amber-500' : 'left-1 text-stone-600 dark:text-stone-300'
          }`}
        >
          {loading ? (
            <span className="h-3 w-3 animate-pulse rounded-full bg-stone-400" />
          ) : isPublished ? (
            /* Œil = visible sur la page résultats */
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ) : (
            /* Œil barré = masqué */
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
          )}
        </span>
      </span>
    </button>
  );
}
