'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/data/translations';
import type { Language } from '@/data/translations';

function LoginForm() {
  const [phaseSaisie, setPhaseSaisie] = useState<string>('');
  const [username, setUsername] = useState('Hanan');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentLang = useLanguage();

  useEffect(() => {
    fetch('/api/config?key=phase_saisie')
      .then((r) => r.json())
      .then((data) => {
        if (data.value === 'qualification' || data.value === 'demi_finale' || data.value === 'finale') {
          setPhaseSaisie(data.value);
        }
      })
      .catch(() => {});
  }, []);

  const handlePhaseChange = (value: string) => {
    setPhaseSaisie(value);
    fetch('/api/config', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'phase_saisie', value }),
    }).catch(() => {});
  };

  const handleLangChange = (value: Language) => {
    localStorage.setItem('app_langue', value);
    window.dispatchEvent(new Event('storage'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        router.push(searchParams.get('redirect') || '/');
      } else {
        setError(data.error || 'Identifiants incorrects');
      }
    } catch {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4 dark:bg-neutral-900" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-center text-3xl font-normal text-stone-800 dark:text-stone-100">
          {currentLang === 'ar' ? 'تسجيل الدخول' : 'Connexion'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-stone-200 bg-white p-8 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
          {/* 1. Phase */}
          <label className="flex flex-col gap-2">
            <span className="text-xs font-normal uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {t('phaseLabel', currentLang)}
            </span>
            <select
              value={phaseSaisie}
              onChange={(e) => handlePhaseChange(e.target.value)}
              className="w-full rounded border border-stone-300 bg-stone-50 px-4 py-3 text-sm font-normal text-stone-800 outline-none transition focus:border-amber-500 focus:bg-white dark:border-neutral-600 dark:bg-neutral-700 dark:text-stone-100 dark:focus:border-amber-500"
            >
              <option value="">{t('phaseChoice', currentLang)}</option>
              <option value="qualification">{t('phaseQualification', currentLang)}</option>
              <option value="demi_finale">{t('phaseDemiFinale', currentLang)}</option>
              <option value="finale">{t('phaseFinale', currentLang)}</option>
            </select>
          </label>

          {/* 2. Jury */}
          <label className="flex flex-col gap-2">
            <span className="text-xs font-normal uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {t('juryLabel', currentLang)}
            </span>
            <select
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded border border-stone-300 bg-stone-50 px-4 py-3 text-sm font-normal text-stone-800 outline-none transition focus:border-amber-500 focus:bg-white dark:border-neutral-600 dark:bg-neutral-700 dark:text-stone-100 dark:focus:border-amber-500"
              required
            >
              <option value="Hanan">Hanan</option>
              <option value="Abderrahmane">Abderrahmane</option>
            </select>
          </label>

          {/* 3. Mot de passe */}
          <label className="flex flex-col gap-2">
            <span className="text-xs font-normal uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {t('passwordLabel', currentLang)}
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={currentLang === 'ar' ? 'كلمة المرور' : 'Votre mot de passe'}
              className="w-full rounded border border-stone-300 bg-stone-50 px-4 py-3 text-sm font-normal text-stone-800 outline-none transition focus:border-amber-500 focus:bg-white dark:border-neutral-600 dark:bg-neutral-700 dark:text-stone-100 dark:focus:border-amber-500"
              required
              autoComplete="current-password"
            />
          </label>

          {/* 4. Langue */}
          <label className="flex flex-col gap-2">
            <span className="text-xs font-normal uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {t('languageLabel', currentLang)}
            </span>
            <select
              value={currentLang}
              onChange={(e) => handleLangChange(e.target.value as Language)}
              className="w-full rounded border border-stone-300 bg-stone-50 px-4 py-3 text-sm font-normal text-stone-800 outline-none transition focus:border-amber-500 focus:bg-white dark:border-neutral-600 dark:bg-neutral-700 dark:text-stone-100 dark:focus:border-amber-500"
            >
              <option value="fr">{t('langFr', currentLang)}</option>
              <option value="ar">{t('langAr', currentLang)}</option>
            </select>
          </label>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          {/* 5. Bouton Valider */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-amber-700 px-6 py-4 text-sm font-medium uppercase tracking-wider text-white transition hover:bg-amber-600 disabled:cursor-wait disabled:opacity-50 dark:bg-amber-600 dark:hover:bg-amber-500"
          >
            {loading ? (currentLang === 'ar' ? 'جاري الاتصال...' : 'Connexion...') : t('validateButton', currentLang)}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-stone-50 dark:bg-neutral-900">
          <div className="text-stone-600 dark:text-stone-400">Chargement...</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
