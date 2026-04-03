// Ce fichier contient la configuration statique des niveaux
// Les élèves sont maintenant chargés dynamiquement depuis Supabase

// (migration) On ne normalise plus de slugs historiques, car la base
// ne contient plus de valeurs héritées.

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export type Eleve = {
  id: string;
  name: string;
  prenom: string;
  nom: string;
  slug: string;
  professeur?: string;
  moyenne_qualif?: number;
  note1?: number;
  note2?: number;
  observation?: string;
  qualification?: string;
  competition?: string;
};

export type Niveau = {
  slug: string;
  label: string;
  labelAr: string;
  description: string;
  color: string;
  isHifdh?: boolean;
};

// Configuration des niveaux (labels, couleurs, descriptions)
export const niveauxConfig: Niveau[] = [
  {
    slug: 'nourania',
    label: 'Nourania',
    labelAr: 'النورانية',
    description: 'Niveau Nourania',
    color: '#fde68a',
  },
  {
    slug: 'preparatoire',
    label: 'Niveau préparatoire',
    labelAr: 'المستوى التحضيري',
    description: 'Niveau préparatoire (6-10 ans)',
    color: '#fed7aa',
    isHifdh: true,
  },
  {
    slug: 'niveau1',
    label: 'Niveau 1',
    labelAr: 'المستوى الأول',
    description: 'Niveau débutant',
    color: '#dcfce7',
    isHifdh: true,
  },
  {
    slug: 'niveau2',
    label: 'Niveau 2',
    labelAr: 'المستوى الثاني',
    description: 'Niveau intermédiaire',
    color: '#fef3c7',
    isHifdh: true,
  },
  {
    slug: 'niveau3',
    label: 'Niveau 3',
    labelAr: 'المستوى الثالث',
    description: 'Niveau avancé',
    color: '#fecaca',
    isHifdh: true,
  },
  {
    slug: 'niveau4',
    label: 'Niveau 4',
    labelAr: 'المستوى الرابع',
    description: 'Niveau expert',
    color: '#e9d5ff',
    isHifdh: true,
  },
  {
    slug: 'tilawa-niveau1',
    label: 'Récitation - Niveau 1',
    labelAr: 'التلاوة : المستوى الأول',
    description: 'Récitation avec tajwid',
    color: '#dbeafe',
  },
  {
    slug: 'tilawa-niveau2',
    label: 'Récitation - Niveau 2',
    labelAr: 'التلاوة : المستوى الثاني',
    description: 'Récitation niveau intermédiaire',
    color: '#bfdbfe',
  },
  {
    slug: 'tilawa-niveau3',
    label: 'Récitation - Niveau 3',
    labelAr: 'التلاوة : المستوى الثالث',
    description: 'Récitation niveau avancé',
    color: '#93c5fd',
  },
  {
    slug: 'recitation-avec-coran',
    label: 'Récitation avec Coran',
    labelAr: 'التلاوة بالمصحف',
    description: 'Récitation avec support du Coran',
    color: '#bbf7d0',
  },
];

/** Mémorisation (hifdh) + récitation avec Coran : affichés en demi-finale / finale sur /resultats et /admin. */
/** « Récitation avec Coran » en premier, puis préparatoire → niveau 4 dans l’ordre du concours. */
export function getNiveauxPhaseResultats(): Niveau[] {
  const hifdh = niveauxConfig.filter((n) => n.isHifdh === true);
  const coran = niveauxConfig.find((n) => n.slug === 'recitation-avec-coran');
  return coran ? [coran, ...hifdh] : hifdh;
}

export const findNiveauConfig = (niveauSlug: string) =>
  niveauxConfig.find(
    (niveau) => niveau.slug === niveauSlug,
  );

export { slugify };
