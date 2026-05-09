import { notFound } from 'next/navigation';
import { findNiveauConfig } from '@/data/niveaux';
import { getNiveauxWithEleves, getEligibleEleveIdsForNotesPhase } from '@/lib/eleves';
import { getEnseignantsPourNotes } from '@/lib/enseignants';
import { getPhaseSaisieFromEnv } from '@/lib/phaseSaisie';
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

  const phaseSaisie = getPhaseSaisieFromEnv();
  const [niveauxWithEleves, enseignantsPourNotes, eligibleIds] = await Promise.all([
    getNiveauxWithEleves(creneau),
    getEnseignantsPourNotes(),
    getEligibleEleveIdsForNotesPhase(phaseSaisie),
  ]);

  const niveauData = niveauxWithEleves.find((n) => n.slug === niveauSlug);
  const elevesBruts = niveauData?.eleves ?? [];
  const elevesForNiveau =
    eligibleIds == null ? elevesBruts : elevesBruts.filter((e) => eligibleIds.has(e.id));

  return (
    <ClientNiveauEleves
      creneau={creneau}
      niveauSlug={niveauSlug}
      niveauConfig={niveauConfig}
      elevesForNiveau={elevesForNiveau}
      enseignantNote1={enseignantsPourNotes.note1}
      enseignantNote2={enseignantsPourNotes.note2}
    />
  );
}
