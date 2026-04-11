import { NextResponse } from 'next/server';

import { getSupabaseClient } from '@/lib/supabase/client';
import { getPhaseSaisieFromEnv } from '@/lib/phaseSaisie';

/** Récitation avec Coran : 12 critères (sans hifdh). Tous les autres : 13. */
const CRITERES_COUNT_STANDARD = 13;
const CRITERES_COUNT_SANS_HIFDH = 12;

type NotePayload = {
  eleve_id: string;
  jury: string;
  total: number;
  moyenne: number;
  scores: Record<string, number>;
};

export async function POST(request: Request) {
  const payload: NotePayload = await request.json();

  if (!payload.eleve_id || !payload.jury) {
    return NextResponse.json(
      { error: 'eleve_id et jury sont requis.' },
      { status: 400 }
    );
  }

  // Extraire les observations et ne garder que les scores numériques
  const { observations, ...scoresCriteres } = payload.scores ?? {};
  const scoreValues = Object.values(scoresCriteres);

  const hasHifdh = 'hifdh' in scoresCriteres;
  const expectedCount = hasHifdh ? CRITERES_COUNT_STANDARD : CRITERES_COUNT_SANS_HIFDH;

  if (scoreValues.length !== expectedCount || scoreValues.some((value) => typeof value !== 'number')) {
    return NextResponse.json(
      { error: `Les scores doivent contenir ${expectedCount} valeurs numériques.` },
      { status: 400 }
    );
  }

  const phase = getPhaseSaisieFromEnv();

  const insertPayload = {
    eleve_id: payload.eleve_id,
    jury: payload.jury,
    moyenne: payload.moyenne,
    total: payload.total,
    scores: payload.scores,
    recorded_at: new Date().toISOString(),
    phase,
  };

  const supabaseClient = getSupabaseClient();
  const { data, error } = await supabaseClient
    .from('notes')
    // @ts-expect-error - Supabase type inference issue with custom Database schema
    .insert(insertPayload)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
