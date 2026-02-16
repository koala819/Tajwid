import { NextResponse } from 'next/server';
import { getUserName } from '@/lib/auth';

export async function GET() {
  const userName = await getUserName();
  
  if (!userName) {
    return NextResponse.json(
      { error: 'Non authentifié' },
      { status: 401 }
    );
  }

  return NextResponse.json({ username: userName });
}
