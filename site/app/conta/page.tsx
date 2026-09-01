'use client';

import { ArrowLeft, LogOut, Save, ShieldCheck, UserRound } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Suspense, SyntheticEvent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AccountToast } from '@/components/account-toast';
import { getAccountSnapshot, isStaff } from '@/lib/account';
import { requireSupabase } from '@/lib/supabase';

type Profile = {
  email: string;
  full_name: string | null;
  phone: string | null;
  marketing_opt_in: boolean;
};

export default function AccountPage() {
  return (
    <Suspense fallback={<main className="surface-page account-page" />}>
      <AccountPageContent />
    </Suspense>
  );
}

function AccountPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const { data: account, isLoading: accountLoading } = useQuery({
    queryKey: ['current-account'],
    queryFn: getAccountSnapshot,
  });
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['customer-profile', account?.user?.id],
    enabled: Boolean(account?.user),
    queryFn: async () => {
      const { data, error: profileError } = await requireSupabase()
        .from('customer_profiles')
        .select('email,full_name,phone,marketing_opt_in')
        .eq('user_id', account!.user!.id)
        .single();
      if (profileError) throw profileError;
      return data as Profile;
    },
  });

  useEffect(() => {
    if (!accountLoading && !account?.user) router.replace('/admin/login');
  }, [account, accountLoading, router]);

  useEffect(() => {
    if (!profile) return;
    queueMicrotask(() => {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setMarketingOptIn(profile.marketing_opt_in);
    });
  }, [profile]);

  async function save(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!account?.user) return;
    setSaving(true);
    setError('');
    setMessage('');
    const normalizedName = fullName.trim();
    const normalizedPhone = phone.trim();
    const { error: updateError } = await requireSupabase()
      .from('customer_profiles')
      .update({
        full_name: normalizedName || null,
        phone: normalizedPhone || null,
        marketing_opt_in: marketingOptIn,
        marketing_opt_in_at: marketingOptIn
          ? new Date().toISOString()
          : null,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', account.user.id);
    setSaving(false);
    if (updateError) {
      setError('Não foi possível salvar seus dados. Confira os campos.');
      return;
    }
    setMessage('Dados atualizados com sucesso.');
    void queryClient.invalidateQueries({ queryKey: ['customer-profile'] });
  }

  async function logout() {
    await requireSupabase().auth.signOut();
    queryClient.clear();
    router.replace('/');
  }

  return (
    <main className="surface-page account-page">
      <AccountToast visible={searchParams.get('confirmada') === '1'} />
      <nav className="simple-nav">
        <a className="back-link" href="/">
          <ArrowLeft size={18} /> Site
        </a>
        <img src="/brand/belleland-logo.svg" alt="Belleland Closet" />
      </nav>
      <section className="account-shell">
        <header className="account-heading">
          <span className="account-icon">
            <UserRound />
          </span>
          <div>
            <p>Sua Belleland</p>
            <h1>Minha conta</h1>
          </div>
        </header>

        {accountLoading || profileLoading ? (
          <div className="account-loading">Carregando seus dados…</div>
        ) : (
          <form className="account-form" onSubmit={save}>
            {isStaff(account?.role || null) && (
              <a className="staff-shortcut" href="/admin">
                <ShieldCheck size={18} /> Abrir aprovações
              </a>
            )}
            {error && <div className="form-error">{error}</div>}
            {message && <output className="form-success">{message}</output>}
            <div className="field">
              <label htmlFor="account-email">E-mail</label>
              <input id="account-email" value={profile?.email || ''} disabled />
            </div>
            <div className="field">
              <label htmlFor="account-name">Nome completo</label>
              <input
                id="account-name"
                autoComplete="name"
                minLength={2}
                maxLength={120}
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="account-phone">Telefone ou WhatsApp</label>
              <input
                id="account-phone"
                type="tel"
                autoComplete="tel"
                minLength={8}
                maxLength={24}
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </div>
            <label className="consent-field account-consent">
              <input
                type="checkbox"
                checked={marketingOptIn}
                onChange={(event) => setMarketingOptIn(event.target.checked)}
              />
              <span>
                Quero receber promoções, novidades e lançamentos da Belleland
                por e-mail.
              </span>
            </label>
            <button className="button-pop button-primary full" disabled={saving}>
              <Save size={17} /> {saving ? 'Salvando…' : 'Salvar dados'}
            </button>
            <button className="account-logout" type="button" onClick={logout}>
              <LogOut size={17} /> Sair da conta
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
