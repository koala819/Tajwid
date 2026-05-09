import { NextResponse } from 'next/server';

import { getSupabaseClient } from '@/lib/supabase/client';
import { isAuthenticated } from '@/lib/auth';
import { getPhaseSaisieFromEnv, phaseStockageQualifQuandFinale } from '@/lib/phaseSaisie';

/**
 * Insère ou supprime une ligne dans `qualifications (eleve_id, phase)`.
 * - qualification / demi_finale : `phase` = `PHASE_SAISIE`.
 * - finale : `phase` = `phaseStockageQualifQuandFinale()` (= tour précédent, défini dans `phaseSaisie.ts`).
 */
export async function POST(request: Request) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { eleveId, qualified } = await request.json();

    if (!eleveId || typeof eleveId !== 'string' || typeof qualified !== 'boolean') {
      return NextResponse.json(
        { error: 'eleveId (string) et qualified (boolean) requis' },
        { status: 400 },
      );
    }

    const phaseEnv = getPhaseSaisieFromEnv();
    const phaseRow = phaseEnv === 'finale' ? phaseStockageQualifQuandFinale() : phaseEnv;
    const supabase = getSupabaseClient();

    /* Le générateur de types Supabase n'étant pas utilisé (types manuels),
       le client infère `never` pour `qualifications`. On bypasse avec any. */
    const table = supabase.from('qualifications' as never);

    if (qualified) {
      const { error } = await (table as any).upsert(
        { eleve_id: eleveId, phase: phaseRow },
        { onConflict: 'eleve_id,phase' },
      );
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      if (phaseEnv === 'finale') {
        await (table as any).delete().eq('eleve_id', eleveId).eq('phase', 'finale');
      }
    } else {
      const del = (table as any).delete().eq('eleve_id', eleveId);
      const phasesSupprFinale = [phaseStockageQualifQuandFinale(), 'finale'] as const;
      const { error } =
        phaseEnv === 'finale' ? await del.in('phase', phasesSupprFinale) : await del.eq('phase', phaseRow);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
