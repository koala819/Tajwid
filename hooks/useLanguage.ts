'use client';

import { useState, useEffect } from 'react';
import type { Language } from '@/data/translations';

export function useLanguage() {
  const [lang, setLang] = useState<Language>('fr');

  useEffect(() => {
    // Charger la langue sauvegardée
    const savedLang = localStorage.getItem('app_langue') as Language;
    if (savedLang === 'ar' || savedLang === 'fr') {
      setLang(savedLang);
    }

    // Écouter les changements de langue
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

  return lang;
}
