'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { t, type Language } from '@/data/translations';

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
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

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Erreur de déconnexion', error);
      router.push('/');
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-300 bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60 disabled:cursor-wait disabled:opacity-50 sm:w-auto dark:border-red-700 dark:bg-red-700 dark:hover:bg-red-600"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3-3H9m0 0l3-3m-3 3l3 3" />
      </svg>
      {loading ? (lang === 'ar' ? 'إعادة التوجيه...' : 'Redirection...') : t('logout', lang)}
    </button>
  );
}
