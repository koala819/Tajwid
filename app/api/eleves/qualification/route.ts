import { NextResponse } from 'next/server';

import { getSupabaseClient } from '@/lib/supabase/client';
import { isAuthenticated } from '@/lib/auth';
import { getPhaseSaisieFromEnv } from '@/lib/phaseSaisie';

/**
 * Insère ou supprime une ligne dans `qualifications (eleve_id, phase)`
 * selon la phase courante (`PHASE_SAISIE`).
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

    const phase = getPhaseSaisieFromEnv();
    const supabase = getSupabaseClient();

    /* Le générateur de types Supabase n'étant pas utilisé (types manuels),
       le client infère `never` pour `qualifications`. On bypasse avec any. */
    const table = supabase.from('qualifications' as never);

    if (qualified) {
      const { error } = await (table as any).upsert(
        { eleve_id: eleveId, phase },
        { onConflict: 'eleve_id,phase' },
      );
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    } else {
      const { error } = await (table as any)
        .delete()
        .eq('eleve_id', eleveId)
        .eq('phase', phase);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
