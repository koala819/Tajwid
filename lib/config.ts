import { getSupabaseClient } from '@/lib/supabase/client';

export async function getConfig(key: string): Promise<string | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('config')
    .select('value')
    .eq('key', key)
    .maybeSingle();
  if (error) return null;
  return data?.value ?? null;
}

export async function setConfig(key: string, value: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from('config')
    .upsert({ key, value }, { onConflict: 'key' });
  return !error;
}
