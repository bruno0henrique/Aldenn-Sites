'use client';

import type { User } from '@supabase/supabase-js';
import { requireSupabase } from '@/lib/supabase';

export type StaffRole = 'owner' | 'admin' | null;

export type AccountSnapshot = {
  user: User | null;
  role: StaffRole;
};

export async function getAccountSnapshot(): Promise<AccountSnapshot> {
  const supabase = requireSupabase();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return { user: null, role: null };

  const { data: membership } = await supabase
    .from('staff_members')
    .select('role')
    .eq('user_id', data.user.id)
    .maybeSingle();

  return {
    user: data.user,
    role:
      membership?.role === 'owner' || membership?.role === 'admin'
        ? membership.role
        : null,
  };
}

export function isStaff(role: StaffRole) {
  return role === 'owner' || role === 'admin';
}
