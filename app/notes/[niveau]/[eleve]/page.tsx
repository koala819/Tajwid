import { notFound } from 'next/navigation';
import { findNiveauConfig } from '@/data/niveaux';
import { findEleve } from '@/lib/eleves';
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
  
  const niveauConfig = findNiveauConfig(params.niveau);
  const eleve = await findEleve(params.niveau, params.eleve);

  if (!niveauConfig || !eleve) {
    notFound();
  }

  return <ClientNotePage niveauConfig={niveauConfig} eleve={eleve} />;
}
