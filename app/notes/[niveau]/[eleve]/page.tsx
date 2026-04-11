import { notFound } from 'next/navigation';
import { findNiveauConfig } from '@/data/niveaux';
import { findEleve } from '@/lib/eleves';
import { getPhaseSaisieFromEnv } from '@/lib/phaseSaisie';
import ClientNotePage from './ClientNotePage';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{
    niveau: string;
    eleve: string;
  }>;
};

export default async function Page(props: PageProps) {
  const params = await props.params;
  const phaseSaisie = getPhaseSaisieFromEnv();

  const [niveauConfig, eleve] = await Promise.all([
    Promise.resolve(findNiveauConfig(params.niveau)),
    findEleve(params.niveau, params.eleve),
  ]);

  if (!niveauConfig || !eleve) {
    notFound();
  }

  return (
    <ClientNotePage
      niveauConfig={niveauConfig}
      eleve={eleve}
      phaseSaisie={phaseSaisie}
    />
  );
}
