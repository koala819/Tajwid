'use client';

import { useState, useEffect } from 'react';
import { t, type Language } from '@/data/translations';
import LogoutButton from './LogoutButton';

export default function AdminNav() {
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

  return (
    <div className="flex items-center justify-between">
      <LogoutButton />
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
