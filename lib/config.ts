import { getSupabaseClient } from '@/lib/supabase/client';

export async function getConfig(key: string): Promise<string | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', key)
    .maybeSingle();
  if (error) return null;
  const row = data as { value: string } | null;
  return row?.value ?? null;
}

export async function setConfig(key: string, value: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  // Table app_settings : le client Supabase peut inférer never si le schéma Database diffère
  // @ts-expect-error — Insert valide (AppSettingRow), l’inférence échoue
  const { error } = await supabase.from('app_settings').upsert({ key, value }, { onConflict: 'key' });
  return !error;
}
