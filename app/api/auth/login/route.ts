import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const USERS = {
  Hanan: 'Ght1vtt9',
  Abderrahmane: '3cmc26',
  root: 'ihsane26', // Admin
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Vérification des identifiants
    if (USERS[username as keyof typeof USERS] === password) {
      const cookieStore = await cookies();
      
      // Cookie de session utilisateur
      cookieStore.set('user_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 8, // 8 heures
        path: '/',
      });

      // Stocker le nom d'utilisateur
      cookieStore.set('user_name', username, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 8,
        path: '/',
      });

      // Cookie admin supplémentaire pour root uniquement
      if (username === 'root') {
        cookieStore.set('admin_session', 'authenticated', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24,
          path: '/',
        });
      }

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
