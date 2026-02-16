import { redirect } from 'next/navigation';
import { getElevesByNiveau } from '@/lib/eleves';
import { isAuthenticated } from '@/lib/auth';
import ClientHome from './ClientHome';

export const dynamic = 'force-dynamic';

const creneaux = [
  { id: 'samedi-matin', label: 'Samedi matin' },
  { id: 'samedi-aprem', label: 'Samedi après-midi' },
  { id: 'dimanche-matin', label: 'Dimanche matin' },
  { id: 'dimanche-aprem', label: 'Dimanche après-midi' },
];

export default async function Home() {
  // Vérifier l'authentification
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect('/login?redirect=/');
  }

  // Compter le total de participants
  const allEleves = await getElevesByNiveau();
  const totalParticipants = allEleves.length;

  return <ClientHome creneaux={creneaux} totalParticipants={totalParticipants} />;
}
