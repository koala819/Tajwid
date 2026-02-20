'use client';

import { useState, useEffect } from 'react';
import { t, type Language } from '@/data/translations';

export default function AdminHeader() {
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
    <header className="space-y-2 rounded-lg border border-stone-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
      <h1 className="flex items-center gap-2 text-2xl font-normal text-stone-800 dark:text-stone-100">
        <svg className="h-5 w-5 shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        {t('adminTitle', lang)}
      </h1>
      <p className="text-sm text-stone-600 dark:text-stone-300" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        {t('adminSubtitle', lang)}
      </p>
    </header>
  );
}
