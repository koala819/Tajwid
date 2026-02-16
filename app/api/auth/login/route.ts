import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_USERNAME = 'root';
const ADMIN_PASSWORD = 'ihsane26';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Vérification des identifiants
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Créer un token simple (pour une vraie app, utiliser JWT)
      const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
      
      // Définir le cookie de session
      const cookieStore = await cookies();
      cookieStore.set('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 heures
        path: '/',
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Identifiants incorrects' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
