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
