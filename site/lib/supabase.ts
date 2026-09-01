import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

let browserClient: SupabaseClient | null | undefined;
export function getSupabase() {
  if (browserClient !== undefined) return browserClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  browserClient = url && key ? createClient() : null;
  return browserClient;
}
export function requireSupabase() {
  const client = getSupabase();
  if (!client)
    throw new Error('Supabase ainda não foi configurado neste ambiente.');
  return client;
}
