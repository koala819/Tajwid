'use client';

import { useState, useEffect } from 'react';
import type { Language } from '@/data/translations';

export default function LanguageSwitch() {
  const [lang, setLang] = useState<Language>('fr');

  useEffect(() => {
    const savedLang = localStorage.getItem('app_langue') as Language;
    if (savedLang === 'ar' || savedLang === 'fr') {
      setLang(savedLang);
    }
  }, []);

  const toggleLang = () => {
    const newLang: Language = lang === 'fr' ? 'ar' : 'fr';
    setLang(newLang);
    localStorage.setItem('app_langue', newLang);
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <button
      onClick={toggleLang}
      className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-stone-200 dark:hover:bg-neutral-700"
      aria-label="Changer de langue"
    >
      <span>{lang === 'fr' ? '🇫🇷 FR' : '🇸🇦 AR'}</span>
      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    </button>
  );
}
