import { notFound } from 'next/navigation';
import { niveauxConfig } from '@/data/niveaux';
import { getElevesByNiveau } from '@/lib/eleves';
import ClientCreneau from './ClientCreneau';

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
  }>;
};

export default async function CreneauPage(props: PageProps) {
  const params = await props.params;
  const creneau = params.creneau;

  const creneauLabel = creneauxLabels[creneau];
  if (!creneauLabel) {
    notFound();
  }

  // Charger tous les élèves du créneau
  const elevesFromDb = await getElevesByNiveau(creneau);

  // Compter les élèves par niveau
  const niveauxAvecComptage = niveauxConfig.map((niveau) => {
    const count = elevesFromDb.filter((e) => e.niveau === niveau.slug).length;
    return {
      ...niveau,
      count,
    };
  }).filter((niveau) => niveau.count > 0); // Garder uniquement les niveaux avec des élèves

  return <ClientCreneau creneau={creneau} niveauxAvecComptage={niveauxAvecComptage} />;
}
