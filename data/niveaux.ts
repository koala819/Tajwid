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
  slug: string;
  professeur?: string;
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
    slug: 'tilawa-niveau1',
    label: 'Tajwid par récitation - Niveau 1',
    labelAr: 'فئة التجويد بالتلاوة : المستوى الأول',
    description: 'Récitation avec les règles de tajwid',
    color: '#dbeafe',
  },
  {
    slug: 'tilawa-niveau2',
    label: 'Tajwid par récitation - Niveau 2',
    labelAr: 'فئة التجويد بالتلاوة : المستوى الثاني',
    description: 'Récitation avec tajwid - Niveau intermédiaire',
    color: '#bfdbfe',
  },
  {
    slug: 'tilawa-niveau3',
    label: 'Tajwid par récitation - Niveau 3',
    labelAr: 'فئة التجويد بالتلاوة : المستوى الثالث',
    description: 'Récitation avec tajwid - Niveau avancé',
    color: '#93c5fd',
  },
  {
    slug: 'hifdh-niveau1',
    label: 'Tajwid par mémorisation - Niveau 1',
    labelAr: 'فئة التجويد بالحفظ : المستوى الأول',
    description: 'Mémorisation avec tajwid - Niveau débutant',
    color: '#dcfce7',
  },
  {
    slug: 'hifdh-niveau2',
    label: 'Tajwid par mémorisation - Niveau 2',
    labelAr: 'فئة التجويد بالحفظ : المستوى الثاني',
    description: 'Mémorisation avec tajwid - Niveau intermédiaire',
    color: '#fef3c7',
  },
  {
    slug: 'hifdh-preparatoire',
    label: 'Tajwid par mémorisation - Niveau préparatoire',
    labelAr: 'فئة التجويد بالحفظ : المستوى التحضيري',
    description: 'Mémorisation avec tajwid - Niveau préparatoire',
    color: '#fed7aa',
  },
  {
    slug: 'hifdh-niveau3',
    label: 'Tajwid par mémorisation - Niveau 3',
    labelAr: 'فئة التجويد بالحفظ : المستوى الثالث',
    description: 'Mémorisation avec tajwid - Niveau avancé',
    color: '#fecaca',
  },
  {
    slug: 'hifdh-niveau4',
    label: 'Tajwid par mémorisation - Niveau 4',
    labelAr: 'فئة التجويد بالحفظ : المستوى الرابع',
    description: 'Mémorisation avec tajwid - Niveau expert',
    color: '#e9d5ff',
  },
];

export const findNiveauConfig = (niveauSlug: string) =>
  niveauxConfig.find((niveau) => niveau.slug === niveauSlug);

export { slugify };
