import { cookies } from 'next/headers';

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get('user_session');
  return session?.value === 'authenticated';
}

export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get('admin_session');
  return adminSession?.value === 'authenticated';
}

export async function getUserName(): Promise<string | null> {
  const cookieStore = await cookies();
  const userName = cookieStore.get('user_name');
  return userName?.value || null;
}
