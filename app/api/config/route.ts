import { NextResponse } from 'next/server';
import { getConfig, setConfig } from '@/lib/config';
import { isAdmin } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  if (!key) {
    return NextResponse.json({ error: 'key requis' }, { status: 400 });
  }
  const value = await getConfig(key);
  return NextResponse.json({ key, value });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { key, value } = body;
  if (!key || value === undefined) {
    return NextResponse.json({ error: 'key et value requis' }, { status: 400 });
  }
  if (key !== 'phase_saisie') {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
  }
  const ok = await setConfig(key, String(value));
  if (!ok) {
    return NextResponse.json({ error: 'Erreur lors de l’enregistrement' }, { status: 500 });
  }
  return NextResponse.json({ key, value });
}
