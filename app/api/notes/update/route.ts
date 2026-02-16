import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { NoteUpdate } from '@/types/supabase';

export async function POST(request: Request) {
  try {
    const { id, total, moyenne } = await request.json();

    if (!id || typeof total !== 'number') {
      return NextResponse.json(
        { error: 'ID et total requis' },
        { status: 400 }
      );
    }

    const supabaseClient = getSupabaseClient();
    const updateData = { total, moyenne };
    
    const { data, error } = await supabaseClient
      .from('notes')
      // @ts-ignore
      .update(updateData)
      .eq('id', id)
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
