import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase/client';

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
    
    const updateData: { publie: boolean; date_publication?: string | null } = {
      publie,
    };
    
    if (publie) {
      updateData.date_publication = new Date().toISOString();
    } else {
      updateData.date_publication = null;
    }

    const { data, error } = await supabaseClient
      .from('notes')
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
