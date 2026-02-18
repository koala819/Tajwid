// Ce fichier contient la configuration statique des niveaux
// Les élèves sont maintenant chargés dynamiquement depuis Supabase

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
};

// Configuration des niveaux (labels, couleurs, descriptions)
export const niveauxConfig: Niveau[] = [
  {
    slug: 'hifdh-preparatoire',
    label: 'Niveau préparatoire',
    labelAr: 'المستوى التحضيري',
    description: 'Niveau préparatoire (6-10 ans)',
    color: '#fed7aa',
  },
  {
    slug: 'hifdh-niveau1',
    label: 'Niveau 1',
    labelAr: 'المستوى الأول',
    description: 'Niveau débutant',
    color: '#dcfce7',
  },
  {
    slug: 'hifdh-niveau2',
    label: 'Niveau 2',
    labelAr: 'المستوى الثاني',
    description: 'Niveau intermédiaire',
    color: '#fef3c7',
  },
  {
    slug: 'hifdh-niveau3',
    label: 'Niveau 3',
    labelAr: 'المستوى الثالث',
    description: 'Niveau avancé',
    color: '#fecaca',
  },
  {
    slug: 'hifdh-niveau4',
    label: 'Niveau 4',
    labelAr: 'المستوى الرابع',
    description: 'Niveau expert',
    color: '#e9d5ff',
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
];

export const findNiveauConfig = (niveauSlug: string) =>
  niveauxConfig.find((niveau) => niveau.slug === niveauSlug);

export { slugify };
