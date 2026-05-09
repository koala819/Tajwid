/** Valeurs possibles pour `PHASE_SAISIE` (saisie des notes & page résultats publique). */
export type PhaseSaisie = 'qualification' | 'demi_finale' | 'finale';

/**
 * Phase courante lue depuis `PHASE_SAISIE` (défaut : `demi_finale` si absent ou invalide).
 * À utiliser côté serveur (routes API, pages server components).
 */
export function getPhaseSaisieFromEnv(): PhaseSaisie {
  const raw = process.env.PHASE_SAISIE?.trim();
  if (raw === 'qualification' || raw === 'demi_finale' || raw === 'finale') {
    return raw;
  }
  return 'demi_finale';
}

/**
 * Phase « tour précédent » pour la page résultats : on n’y liste que les élèves
 * déjà marqués qualifiés (`qualifications`) à la fin de ce tour.
 */
export function phasePrecedentePourResultats(phase: PhaseSaisie): PhaseSaisie | null {
  if (phase === 'demi_finale') return 'qualification';
  if (phase === 'finale') return 'demi_finale';
  return null;
}
