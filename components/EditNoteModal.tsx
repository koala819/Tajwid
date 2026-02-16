'use client';

import { useState } from 'react';
import type { NoteRow } from '@/types/supabase';

type EditNoteModalProps = {
  note: NoteRow;
  onClose: () => void;
  onSuccess: () => void;
};

const VALID_PASSWORDS = ['ght1vtt9', 'gtoqpaht1vtt'];

export default function EditNoteModal({ note, onClose, onSuccess }: EditNoteModalProps) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(note.total);
  const [loading, setLoading] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (VALID_PASSWORDS.includes(password)) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Mot de passe incorrect');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/notes/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: note.id,
          total,
          moyenne: Number((total / 10).toFixed(2)),
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        setError('Erreur lors de la modification');
      }
    } catch (err) {
      setError('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) return;

    setLoading(true);
    try {
      const response = await fetch('/api/notes/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: note.id }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        setError('Erreur lors de la suppression');
      }
    } catch (err) {
      setError('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md space-y-6 rounded-lg border border-stone-200 bg-white p-6 shadow-xl dark:border-neutral-700 dark:bg-neutral-800">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-normal text-stone-800 dark:text-stone-100">
            {isAuthenticated ? 'Modifier la note' : 'Authentification requise'}
          </h2>
          <button
            onClick={onClose}
            className="text-stone-400 transition-colors hover:text-stone-600 dark:hover:text-stone-200"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!isAuthenticated ? (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-stone-600 dark:text-stone-300">
                Élève : <span className="font-medium">{note.eleve}</span>
              </p>
              <p className="text-sm text-stone-600 dark:text-stone-300">
                Jury : <span className="font-medium">{note.jury}</span>
              </p>
            </div>

            <div className="space-y-2">
              <label className="flex flex-col gap-2">
                <span className="text-xs font-normal uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Mot de passe de modification
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez le mot de passe"
                  className="w-full rounded border border-stone-300 bg-stone-50 px-4 py-3 text-sm font-normal text-stone-800 outline-none transition focus:border-amber-500 focus:bg-white dark:border-neutral-600 dark:bg-neutral-700 dark:text-stone-100 dark:focus:border-amber-500"
                  required
                  autoFocus
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
              className="w-full rounded-lg bg-amber-700 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500"
            >
              Valider
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-stone-600 dark:text-stone-300">
                Élève : <span className="font-medium">{note.eleve}</span>
              </p>
              <p className="text-sm text-stone-600 dark:text-stone-300">
                Jury : <span className="font-medium">{note.jury}</span>
              </p>
            </div>

            <div className="space-y-2">
              <label className="flex flex-col gap-2">
                <span className="text-xs font-normal uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Note totale / 100
                </span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.5}
                  value={total}
                  onChange={(e) => setTotal(Number(e.target.value))}
                  className="w-full rounded border border-stone-300 bg-stone-50 px-4 py-3 text-lg font-normal text-stone-800 outline-none transition focus:border-amber-500 focus:bg-white dark:border-neutral-600 dark:bg-neutral-700 dark:text-stone-100 dark:focus:border-amber-500"
                />
              </label>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Moyenne sur 10 : {(total / 10).toFixed(2)}
              </p>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 rounded-lg border border-red-200 bg-white px-6 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-wait disabled:opacity-50 dark:border-red-800 dark:bg-neutral-700 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                Supprimer
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 rounded-lg bg-amber-700 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-amber-600 disabled:cursor-wait disabled:opacity-50 dark:bg-amber-600 dark:hover:bg-amber-500"
              >
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
