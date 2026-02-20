import { getNiveauxWithEleves } from '@/lib/eleves';
import { getPublishedResultatsByPhase } from '@/lib/notes';
import ClientResultats from './ClientResultats';

export const dynamic = 'force-dynamic';

export default async function ResultatsPage() {
  const [niveauxWithEleves, resultatsDemiFinale, resultatsFinale] = await Promise.all([
    getNiveauxWithEleves(),
    getPublishedResultatsByPhase('demi_finale'),
    getPublishedResultatsByPhase('finale'),
  ]);
  const totalParticipants = niveauxWithEleves.reduce(
    (sum, n) => sum + n.eleves.length,
    0,
  );

  return (
    <ClientResultats
      niveauxWithEleves={niveauxWithEleves}
      totalParticipants={totalParticipants}
      resultatsDemiFinale={resultatsDemiFinale}
      resultatsFinale={resultatsFinale}
    />
  );
}
