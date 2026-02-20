import { getSupabaseClient } from '@/lib/supabase/client';

export async function getConfig(key: string): Promise<string | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('config')
    .select('value')
    .eq('key', key)
    .maybeSingle();
  if (error) return null;
  const row = data as { value: string } | null;
  return row?.value ?? null;
}

export async function setConfig(key: string, value: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  // Table config : le client Supabase peut inférer never si le schéma Database diffère du générateur
  // @ts-expect-error — Insert pour config est valide (ConfigRow), l’inférence échoue
  const { error } = await supabase.from('config').upsert({ key, value }, { onConflict: 'key' });
  return !error;
}
