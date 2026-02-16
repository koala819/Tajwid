'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { t, type Language } from '@/data/translations';

export default function AdminNav() {
  const [lang, setLang] = useState<Language>('fr');

  useEffect(() => {
    const savedLang = localStorage.getItem('app_langue') as Language;
    if (savedLang === 'ar' || savedLang === 'fr') {
      setLang(savedLang);
    }

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

  return (
    <div className="flex items-center justify-between">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-stone-500 transition-colors hover:text-amber-700 dark:text-stone-400 dark:hover:text-amber-500"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        {t('home', lang)}
      </Link>
      <a
        href="/resultats"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm font-normal text-stone-600 transition-colors hover:border-amber-300 hover:bg-amber-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-stone-300 dark:hover:border-amber-600 dark:hover:bg-amber-900/20"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        <span>{t('seePublicPage', lang)}</span>
      </a>
    </div>
  );
}
