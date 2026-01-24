import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
let supabaseClient: SupabaseClient<Database> | null = null;

const ensureSupabaseCredentials = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL et clé ANON doivent être définis dans les variables d’environnement');
  }
};

export function getSupabaseClient() {
  ensureSupabaseCredentials();

  if (!supabaseClient) {
    supabaseClient = createClient<Database>(supabaseUrl!, supabaseAnonKey!);
  }

  return supabaseClient;
}
