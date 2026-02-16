import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('user_session');
  cookieStore.delete('user_name');
  cookieStore.delete('admin_session');
  
  return NextResponse.json({ success: true });
}
