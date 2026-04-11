import { getResultatsByPhase } from '@/lib/eleves';
import { getPublishedResultatsByPhase } from '@/lib/notes';
import { getPhaseSaisieFromEnv } from '@/lib/phaseSaisie';
import ClientResultats from './ClientResultats';

export const dynamic = 'force-dynamic';

const NIVEAUX_EXCLUS = ['nourania'];

export default async function ResultatsPage() {
  const phaseSaisie = getPhaseSaisieFromEnv();

  if (phaseSaisie === 'qualification' || phaseSaisie === 'demi_finale') {
    const niveaux = await getResultatsByPhase(phaseSaisie, NIVEAUX_EXCLUS);
    const totalParticipants = niveaux.reduce((sum, n) => sum + n.eleves.length, 0);
    return (
      <ClientResultats
        phaseSaisie={phaseSaisie}
        niveaux={niveaux}
        totalParticipants={totalParticipants}
      />
    );
  }

  const resultatsParNiveau = await getPublishedResultatsByPhase('finale');
  return <ClientResultats phaseSaisie="finale" resultatsParNiveau={resultatsParNiveau} />;
}
