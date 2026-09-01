import { requireSupabase } from '@/lib/supabase';
import type { Capture } from '@/lib/types';

export async function assertStaff() {
  const supabase = requireSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error('Sessão expirada.');
  const { data, error } = await supabase
    .from('staff_members')
    .select('role')
    .eq('user_id', auth.user.id)
    .maybeSingle();
  if (error || !['owner', 'admin'].includes(data?.role || ''))
    throw new Error('Esta conta não tem acesso às aprovações.');
  return auth.user;
}
export async function listCaptures(status: string): Promise<Capture[]> {
  await assertStaff();
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
  await assertStaff();
  const { error } = await requireSupabase()
    .from('instagram_captures')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}

export async function createManualCapture({
  name,
  description,
  category,
  priceCents,
  image,
}: {
  name: string;
  description: string;
  category: string;
  priceCents: number;
  image: File;
}) {
  const user = await assertStaff();
  const allowedImageTypes: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  };
  const extension = allowedImageTypes[image.type];
  if (!extension)
    throw new Error('Selecione uma imagem válida.');
  if (image.size > 10 * 1024 * 1024)
    throw new Error('A imagem deve ter no máximo 10 MB.');

  const supabase = requireSupabase();
  const manualId = crypto.randomUUID();
  const { data: capture, error: captureError } = await supabase
    .from('instagram_captures')
    .insert({
      instagram_shortcode: `manual-${manualId}`,
      source_url: '',
      captured_at: new Date().toISOString(),
      status: 'pending_review',
      proposed_name: name.trim(),
      proposed_description: description.trim() || null,
      proposed_category: category.trim() || null,
      price_cents: priceCents || null,
    })
    .select('id')
    .single();
  if (captureError) throw captureError;

  const storagePath = `manual/${user.id}/${manualId}.${extension}`;
  const { error: uploadError } = await supabase.storage
    .from('product-media')
    .upload(storagePath, image, { contentType: image.type, upsert: false });
  if (uploadError) {
    await supabase.from('instagram_captures').delete().eq('id', capture.id);
    throw uploadError;
  }

  const { data: publicImage } = supabase.storage
    .from('product-media')
    .getPublicUrl(storagePath);
  const { error: mediaError } = await supabase.from('capture_media').insert({
    capture_id: capture.id,
    source_position: 0,
    source_url: publicImage.publicUrl,
    storage_path: storagePath,
    public_url: publicImage.publicUrl,
    mime_type: image.type,
    decision: 'primary',
  });
  if (mediaError) {
    await supabase.storage.from('product-media').remove([storagePath]);
    await supabase.from('instagram_captures').delete().eq('id', capture.id);
    throw mediaError;
  }
  return capture.id as number;
}
