'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { t, type Language } from '@/data/translations';

type WinnerToggleProps = {
  eleveId: string;
  winner: boolean;
};

export default function WinnerToggle({ eleveId, winner: initialWinner }: WinnerToggleProps) {
  const router = useRouter();
  const [winner, setWinner] = useState(initialWinner);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<Language>('fr');

  useEffect(() => {
    setWinner(initialWinner);
  }, [initialWinner]);

  useEffect(() => {
    const savedLang = localStorage.getItem('admin_langue') as Language;
    if (savedLang === 'ar' || savedLang === 'fr') setLang(savedLang);

    const handleStorage = () => {
      const newLang = localStorage.getItem('admin_langue') as Language;
      if (newLang === 'ar' || newLang === 'fr') setLang(newLang);
    };
    window.addEventListener('storage', handleStorage);
    const interval = setInterval(handleStorage, 100);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  const handleToggle = async () => {
    const next = !winner;
    setLoading(true);
    setWinner(next);
    try {
      const response = await fetch('/api/eleves/vainqueur', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eleveId, vainqueur: next }),
      });
      if (!response.ok) {
        setWinner(!next);
      } else {
        setTimeout(() => router.refresh(), 500);
      }
    } catch (e) {
      console.error('Erreur vainqueur', e);
      setWinner(!next);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      title={winner ? t('winnerYes', lang) : t('winnerNo', lang)}
      className="flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:cursor-wait disabled:opacity-40"
    >
      <span className="text-sm text-stone-600 dark:text-stone-300" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        {t('winnerToggleLabel', lang)}
      </span>
      <span
        className={`relative inline-flex h-8 w-14 shrink-0 rounded-full transition-colors ${
          winner ? 'bg-amber-600 dark:bg-amber-500' : 'bg-stone-200 dark:bg-neutral-600'
        }`}
        aria-hidden
      >
        <span
          className={`absolute top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow transition-[left] ${
            winner ? 'left-7 text-amber-600 dark:text-amber-400' : 'left-1 text-stone-500 dark:text-stone-400'
          }`}
        >
          {loading ? (
            <span className="h-3 w-3 animate-pulse rounded-full bg-stone-400" />
          ) : winner ? (
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          ) : (
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          )}
        </span>
      </span>
    </button>
  );
}
