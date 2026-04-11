import { getNiveauxWithEleves } from '@/lib/eleves';
import { getPublishedResultatsByPhase } from '@/lib/notes';
import { getPhaseSaisieFromEnv } from '@/lib/phaseSaisie';
import ClientResultats from './ClientResultats';

export const dynamic = 'force-dynamic';

export default async function ResultatsPage() {
  const phaseSaisie = getPhaseSaisieFromEnv();

  if (phaseSaisie === 'qualification') {
    const niveauxWithEleves = await getNiveauxWithEleves(undefined);
    const totalParticipants = niveauxWithEleves.reduce(
      (sum, n) => sum + n.eleves.length,
      0,
    );
    return (
      <ClientResultats
        phaseSaisie="qualification"
        niveauxWithEleves={niveauxWithEleves}
        totalParticipants={totalParticipants}
      />
    );
  }

  if (phaseSaisie === 'demi_finale') {
    const resultatsParNiveau = await getPublishedResultatsByPhase('demi_finale');
    return <ClientResultats phaseSaisie="demi_finale" resultatsParNiveau={resultatsParNiveau} />;
  }

  const resultatsParNiveau = await getPublishedResultatsByPhase('finale');
  return <ClientResultats phaseSaisie="finale" resultatsParNiveau={resultatsParNiveau} />;
}
