import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { NoteUpdate } from '@/types/supabase';

export async function POST(request: Request) {
  try {
    const { noteIds, publie } = await request.json();

    if (!Array.isArray(noteIds) || typeof publie !== 'boolean') {
      return NextResponse.json(
        { error: 'noteIds (array) et publie (boolean) requis' },
        { status: 400 }
      );
    }

    const supabaseClient = getSupabaseClient();
    
    const updateData = {
      publie,
      date_publication: publie ? new Date().toISOString() : null,
    };

    const { data, error } = await supabaseClient
      .from('notes')
      // @ts-ignore
      .update(updateData)
      .in('id', noteIds)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
