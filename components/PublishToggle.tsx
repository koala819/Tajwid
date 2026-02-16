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
      onClick={handleToggle}
      disabled={loading}
      className={`rounded-lg px-6 py-2 text-sm font-medium uppercase tracking-wider transition-all disabled:cursor-wait disabled:opacity-50 ${
        isPublished
          ? 'bg-emerald-600 text-white hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400'
          : 'bg-stone-300 text-stone-700 hover:bg-stone-400 dark:bg-neutral-600 dark:text-stone-300 dark:hover:bg-neutral-500'
      }`}
    >
      {loading ? (lang === 'ar' ? 'جاري التحميل...' : 'Chargement...') : (isPublished ? t('published', lang) : t('hidden', lang))}
    </button>
  );
}
