'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const [username, setUsername] = useState('Hanan');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

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
        const redirect = searchParams.get('redirect') || '/';
        router.push(redirect);
      } else {
        setError(data.error || 'Identifiants incorrects');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-neutral-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-normal text-stone-800 dark:text-stone-100">
            Connexion
          </h1>
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
            Accédez à l'évaluation
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-stone-200 bg-white p-8 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
          <div className="space-y-2">
            <label className="flex flex-col gap-2">
              <span className="text-xs font-normal uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Jury
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
          </div>

          <div className="space-y-2">
            <label className="flex flex-col gap-2">
              <span className="text-xs font-normal uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Mot de passe
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
                className="w-full rounded border border-stone-300 bg-stone-50 px-4 py-3 text-sm font-normal text-stone-800 outline-none transition focus:border-amber-500 focus:bg-white dark:border-neutral-600 dark:bg-neutral-700 dark:text-stone-100 dark:focus:border-amber-500"
                required
                autoComplete="current-password"
              />
            </label>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-amber-700 px-6 py-4 text-sm font-medium uppercase tracking-wider text-white shadow-sm transition hover:bg-amber-600 disabled:cursor-wait disabled:opacity-50 dark:bg-amber-600 dark:hover:bg-amber-500"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-stone-50 dark:bg-neutral-900">
        <div className="text-stone-600 dark:text-stone-400">Chargement...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
