import { NextResponse } from 'next/server';

import { getSupabaseClient } from '@/lib/supabase/client';

const criteresCount = 13; // Nombre de critères de notation (sans les observations)

type NotePayload = {
  niveau: string;
  eleve: string;
  jury: string;
  total: number;
  moyenne: number;
  scores: Record<string, number>;
};

export async function POST(request: Request) {
  const payload: NotePayload = await request.json();

  if (!payload.niveau || !payload.eleve || !payload.jury) {
    return NextResponse.json(
      { error: 'Niveau, élève et jury sont requis.' },
      { status: 400 }
    );
  }

  // Extraire les observations et ne garder que les scores numériques
  const { observations, ...scoresCriteres } = payload.scores ?? {};
  const scoreValues = Object.values(scoresCriteres);

  if (scoreValues.length !== criteresCount || scoreValues.some((value) => typeof value !== 'number')) {
    return NextResponse.json(
      { error: `Les scores doivent contenir ${criteresCount} valeurs numériques.` },
      { status: 400 }
    );
  }

  const insertPayload = {
    niveau: payload.niveau,
    eleve: payload.eleve,
    jury: payload.jury,
    moyenne: payload.moyenne,
    total: payload.total,
    scores: payload.scores,
    recorded_at: new Date().toISOString(),
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
