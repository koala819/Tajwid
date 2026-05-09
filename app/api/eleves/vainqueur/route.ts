import { NextResponse } from 'next/server';

import { getSupabaseClient } from '@/lib/supabase/client';
import { isAuthenticated } from '@/lib/auth';
import { getPhaseSaisieFromEnv } from '@/lib/phaseSaisie';

/**
 * Marque ou retire le lauréat (`qualifications.phase = vainqueur`). Uniquement si `PHASE_SAISIE=finale`.
 */
export async function POST(request: Request) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  if (getPhaseSaisieFromEnv() !== 'finale') {
    return NextResponse.json(
      { error: 'Réservé à la phase finale (PHASE_SAISIE=finale)' },
      { status: 400 },
    );
  }

  try {
    const { eleveId, vainqueur } = await request.json();

    if (!eleveId || typeof eleveId !== 'string' || typeof vainqueur !== 'boolean') {
      return NextResponse.json(
        { error: 'eleveId (string) et vainqueur (boolean) requis' },
        { status: 400 },
      );
    }

    const table = getSupabaseClient().from('qualifications' as never);

    if (vainqueur) {
      const { error } = await (table as any).upsert(
        { eleve_id: eleveId, phase: 'vainqueur' },
        { onConflict: 'eleve_id,phase' },
      );
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    } else {
      const { error } = await (table as any)
        .delete()
        .eq('eleve_id', eleveId)
        .eq('phase', 'vainqueur');
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
