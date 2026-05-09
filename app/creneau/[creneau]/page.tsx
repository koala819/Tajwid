import { notFound } from 'next/navigation';
import { niveauxConfig } from '@/data/niveaux';
import { getElevesByNiveau, getEligibleEleveIdsForNotesPhase } from '@/lib/eleves';
import { getPhaseSaisieFromEnv } from '@/lib/phaseSaisie';
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

  const phaseSaisie = getPhaseSaisieFromEnv();
  const eligibleIds = await getEligibleEleveIdsForNotesPhase(phaseSaisie);

  // Charger tous les élèves du créneau
  const elevesFromDb = await getElevesByNiveau(creneau);

  // Compter les élèves par niveau (filtrés hors qualification si demi-finale / finale)
  const niveauxAvecComptage = niveauxConfig.map((niveau) => {
    const count = elevesFromDb.filter((e) => {
      if (e.niveau !== niveau.slug) return false;
      if (eligibleIds == null) return true;
      return eligibleIds.has(e.id);
    }).length;
    return {
      ...niveau,
      count,
    };
  }).filter((niveau) => niveau.count > 0); // Garder uniquement les niveaux avec des élèves

  return <ClientCreneau creneau={creneau} niveauxAvecComptage={niveauxAvecComptage} />;
}
