import { notFound } from 'next/navigation';
import { findNiveauConfig } from '@/data/niveaux';
import { findEleve } from '@/lib/eleves';
import { getConfig } from '@/lib/config';
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
  const [niveauConfig, eleve, phaseSaisie] = await Promise.all([
    Promise.resolve(findNiveauConfig(params.niveau)),
    findEleve(params.niveau, params.eleve),
    getConfig('phase_saisie'),
  ]);

  if (!niveauConfig || !eleve) {
    notFound();
  }

  return (
    <ClientNotePage
      niveauConfig={niveauConfig}
      eleve={eleve}
      phaseSaisie={phaseSaisie || ''}
    />
  );
}
