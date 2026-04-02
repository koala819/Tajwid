'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/data/translations';
import LogoutButton from '@/components/LogoutButton';
import LanguageSwitch from '@/components/LanguageSwitch';

type Creneau = {
  id: string;
  label: string;
};

type ClientHomeProps = {
  creneaux: Creneau[];
  totalParticipants: number;
  authenticated: boolean;
};

function safeInternalPath(redirect: string | null): string | null {
  if (!redirect || !redirect.startsWith('/') || redirect.startsWith('//')) return null;
  return redirect;
}

export default function ClientHome({ creneaux, totalParticipants, authenticated }: ClientHomeProps) {
  const lang = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'Abderrahmane', password }),
      });

      if (!response.ok) {
        setError(lang === 'ar' ? 'كلمة المرور غير صحيحة' : 'Mot de passe incorrect');
        return;
      }

      const next = safeInternalPath(searchParams.get('redirect'));
      if (next) {
        router.push(next);
        router.refresh();
      } else {
        router.refresh();
      }
    } catch {
      setError(lang === 'ar' ? 'خطأ في الاتصال' : 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-neutral-900">
      <main className="mx-auto max-w-2xl space-y-12 px-4 py-12 md:py-16">
        {/* Titre sur deux lignes, centré */}
        <header className="border-b border-stone-200 pb-8 text-center dark:border-neutral-700">
          <div className="mb-5 flex w-full flex-col gap-3 sm:mb-4 sm:flex-row sm:items-center sm:justify-end">
            <div className="w-full sm:w-auto">
              <LanguageSwitch />
            </div>
            {authenticated && <LogoutButton />}
          </div>
          <h1 className="text-4xl font-light tracking-tight text-stone-800 dark:text-stone-100 md:text-5xl" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <span className="block">{t('titleLine1', lang)}</span>
            <span className="block text-amber-700 dark:text-amber-500">{t('titleLine2', lang)}</span>
          </h1>
        </header>

        {!authenticated ? (
          <section className="space-y-6">
            <form
              onSubmit={handleLogin}
              className="space-y-4 rounded-lg border border-stone-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
            >
              <label className="block space-y-2">
                <span className="text-sm text-stone-600 dark:text-stone-300">
                  {lang === 'ar' ? 'كلمة المرور' : 'Mot de passe'}
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={lang === 'ar' ? 'أدخل كلمة المرور' : 'Entrez le mot de passe'}
                  className="w-full rounded border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-amber-500 focus:bg-white dark:border-neutral-600 dark:bg-neutral-700 dark:text-stone-100"
                  required
                  autoComplete="current-password"
                />
              </label>
              {error && (
                <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-amber-700 px-6 py-3 text-sm font-medium uppercase tracking-wider text-white transition hover:bg-amber-600 disabled:cursor-wait disabled:opacity-50 dark:bg-amber-600 dark:hover:bg-amber-500"
              >
                {loading
                  ? lang === 'ar'
                    ? 'جاري الاتصال...'
                    : 'Connexion...'
                  : lang === 'ar'
                    ? 'دخول'
                    : 'Se connecter'}
              </button>
            </form>

            <Link
              href="/resultats"
              className="group block rounded-lg border border-stone-200 bg-white p-6 shadow-sm transition-all hover:border-amber-300 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-amber-600"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-normal text-stone-800 dark:text-stone-100">
                  {t('results', lang)}
                </span>
                <svg
                  className="h-5 w-5 text-stone-400 transition-all group-hover:translate-x-1 group-hover:text-amber-600 dark:text-stone-500 dark:group-hover:text-amber-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </section>
        ) : (
          <>
            {/* Créneaux */}
            <section className="space-y-4">
              {creneaux.map((creneau) => (
                <Link
                  key={creneau.id}
                  href={`/creneau/${creneau.id}`}
                  className="group block rounded-lg border border-stone-200 bg-white p-6 shadow-sm transition-all hover:border-amber-300 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-amber-600"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-normal text-stone-800 dark:text-stone-100">
                      {t(creneau.id as keyof typeof t, lang)}
                    </span>
                    <svg
                      className="h-5 w-5 text-stone-400 transition-all group-hover:translate-x-1 group-hover:text-amber-600 dark:text-stone-500 dark:group-hover:text-amber-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </section>

            {/* X PARTICIPANTS, centré */}
            <div className="flex items-baseline justify-center gap-3">
              <span className="text-6xl font-extralight text-amber-700 dark:text-amber-500">{totalParticipants}</span>
              <span className="text-sm uppercase tracking-wider text-stone-500 dark:text-stone-400">
                {t('participants', lang)}
              </span>
            </div>

            {/* Gestion des notes (en couleur) */}
            <Link
              href="/admin"
              className="group block rounded-lg border-2 border-amber-400 bg-amber-50 p-6 shadow-sm transition-all hover:border-amber-500 hover:bg-amber-100 hover:shadow-md dark:border-amber-600 dark:bg-amber-950/30 dark:hover:border-amber-500 dark:hover:bg-amber-950/50"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-amber-800 dark:text-amber-200">
                  {t('admin', lang)}
                </span>
                <svg
                  className="h-5 w-5 text-amber-600 transition-all group-hover:translate-x-1 group-hover:text-amber-700 dark:text-amber-400 dark:group-hover:text-amber-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </>
        )}
      </main>
    </div>
  );
}
