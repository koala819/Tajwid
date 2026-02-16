import { notFound } from 'next/navigation';
import { findNiveauConfig, slugify } from '@/data/niveaux';
import { getElevesByNiveau } from '@/lib/eleves';
import ClientNiveauEleves from './ClientNiveauEleves';

export const dynamic = 'force-dynamic';

const creneauxLabels: Record<string, string> = {
  'samedi-matin': 'Samedi matin',
  'samedi-aprem': 'Samedi après-midi',
  'dimanche-matin': 'Dimanche matin',
  'dimanche-aprem': 'Dimanche après-midi',
};

type PageProps = {
  params: Promise<{
    creneau: string;
    niveau: string;
  }>;
};

export default async function ElevesPage(props: PageProps) {
  const params = await props.params;
  const { creneau, niveau: niveauSlug } = params;

  const creneauLabel = creneauxLabels[creneau];
  const niveauConfig = findNiveauConfig(niveauSlug);

  if (!creneauLabel || !niveauConfig) {
    notFound();
  }

  // Charger les élèves du créneau et du niveau
  const elevesFromDb = await getElevesByNiveau(creneau);
  const elevesForNiveau = elevesFromDb
    .filter((eleve) => eleve.niveau === niveauSlug)
    .map((eleve) => ({
      id: eleve.id,
      prenom: eleve.prenom,
      nom: eleve.nom,
      name: `${eleve.prenom} ${eleve.nom}`,
      slug: slugify(`${eleve.nom} ${eleve.prenom}`),
      professeur: eleve.professeur,
      moyenne_qualif: eleve.moyenne_qualif,
    }))
    .sort((a, b) => {
      // Si on a des qualifiés avec notes, trier par moyenne décroissante
      if (a.moyenne_qualif && b.moyenne_qualif) {
        return b.moyenne_qualif - a.moyenne_qualif;
      }
      // Sinon trier par prénom
      return a.prenom.localeCompare(b.prenom, 'fr', { sensitivity: 'base' });
    });

  return (
    <ClientNiveauEleves
      creneau={creneau}
      niveauSlug={niveauSlug}
      niveauConfig={niveauConfig}
      elevesForNiveau={elevesForNiveau}
    />
  );
}
