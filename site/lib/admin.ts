import { requireSupabase } from '@/lib/supabase';
import type { Capture } from '@/lib/types';

export async function assertOwner() {
  const supabase = requireSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error('Sessão expirada.');
  const { data, error } = await supabase
    .from('staff_members')
    .select('role')
    .eq('user_id', auth.user.id)
    .maybeSingle();
  if (error || data?.role !== 'owner')
    throw new Error('Esta conta não tem acesso de proprietária.');
  return auth.user;
}
export async function listCaptures(status: string): Promise<Capture[]> {
  await assertOwner();
  const { data, error } = await requireSupabase()
    .from('instagram_captures')
    .select(
      'id,instagram_shortcode,source_url,proposed_name,proposed_description,proposed_category,price_cents,status,capture_media(id,public_url,decision,source_position)',
    )
    .eq('status', status)
    .order('captured_at');
  if (error) throw error;
  return (data || []) as Capture[];
}
export async function saveCapture(capture: Capture) {
  const supabase = requireSupabase();
  const { error } = await supabase
    .from('instagram_captures')
    .update({
      proposed_name: capture.proposed_name,
      proposed_description: capture.proposed_description,
      proposed_category: capture.proposed_category,
      price_cents: capture.price_cents,
      status: 'in_review',
    })
    .eq('id', capture.id);
  if (error) throw error;
  const primary = capture.capture_media.find(
    (media) => media.decision === 'primary',
  );
  const { error: demoteError } = await supabase
    .from('capture_media')
    .update({ decision: 'secondary' })
    .eq('capture_id', capture.id)
    .eq('decision', 'primary');
  if (demoteError) throw demoteError;
  for (const media of capture.capture_media.filter(
    (item) => item.id !== primary?.id,
  )) {
    const { error: mediaError } = await supabase
      .from('capture_media')
      .update({ decision: media.decision })
      .eq('id', media.id)
      .eq('capture_id', capture.id);
    if (mediaError) throw mediaError;
  }
  if (primary) {
    const { error: primaryError } = await supabase
      .from('capture_media')
      .update({ decision: 'primary' })
      .eq('id', primary.id)
      .eq('capture_id', capture.id);
    if (primaryError) throw primaryError;
  }
}
export async function publishCapture(capture: Capture) {
  await saveCapture(capture);
  const { data, error } = await requireSupabase().rpc('publish_capture', {
    target_capture_id: capture.id,
  });
  if (error) throw error;
  return data as number;
}
export async function setCaptureStatus(
  id: number,
  status: 'pending_review' | 'ignored',
) {
  await assertOwner();
  const { error } = await requireSupabase()
    .from('instagram_captures')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}
