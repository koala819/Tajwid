import { getNiveauxWithEleves } from '@/lib/eleves';
import ClientResultats from './ClientResultats';

export const dynamic = 'force-dynamic';

export default async function ResultatsPage() {
  const niveauxWithEleves = await getNiveauxWithEleves();
  const totalParticipants = niveauxWithEleves.reduce(
    (sum, n) => sum + n.eleves.length,
    0,
  );

  return (
    <ClientResultats
      niveauxWithEleves={niveauxWithEleves}
      totalParticipants={totalParticipants}
    />
  );
}
