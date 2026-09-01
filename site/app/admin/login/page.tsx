'use client';

import { ArrowLeft, LockKeyhole } from 'lucide-react';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase, requireSupabase } from '@/lib/supabase';

async function getSignedInDestination(userId: string) {
  const { data, error } = await requireSupabase()
    .from('staff_members')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data?.role === 'owner' ? '/admin' : '/?conta=conectada';
}

export default function AdminLogin() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    void getSupabase()
      ?.auth.getUser()
      .then(({ data }) => {
        if (data.user) {
          void getSignedInDestination(data.user.id)
            .then((destination) => router.replace(destination))
            .catch((cause) =>
              setError(
                cause instanceof Error
                  ? cause.message
                  : 'Não foi possível verificar a conta.',
              ),
            );
        }
      });
  }, [router]);
  async function submit(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const supabase = requireSupabase();
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          throw new Error('As senhas precisam ser iguais.');
        }
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin/login`,
            data: { marketing_opt_in: marketingOptIn },
          },
        });
        if (authError) throw authError;
        if (data.session) await supabase.auth.signOut();
        setPassword('');
        setConfirmPassword('');
        setMarketingOptIn(false);
        setMode('login');
        setMessage(
          'Conta criada. Confirme seu e-mail para concluir o cadastro e receber novidades da Belleland.',
        );
      } else {
        const { data, error: authError } =
          await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
        router.replace(await getSignedInDestination(data.user.id));
      }
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Não foi possível entrar.',
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="surface-page">
      <nav className="simple-nav">
        <a className="back-link" href="/">
          <ArrowLeft size={18} /> Site
        </a>
        <img src="/brand/belleland-logo.svg" alt="Belleland Closet" />
      </nav>
      <form className="form-card" onSubmit={submit}>
        <LockKeyhole color="#e73f8c" />
        <h1>{mode === 'login' ? 'Sua conta Belleland' : 'Criar conta'}</h1>
        <p>
          {mode === 'login'
            ? 'Entre na sua conta para acompanhar a Belleland.'
            : 'Crie sua conta para receber novidades, promoções e lançamentos da Belleland.'}
        </p>
        {error && (
          <div className="form-error" role="alert">
            {error}
          </div>
        )}
        {message && <output className="form-success">{message}</output>}
        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            autoComplete={
              mode === 'login' ? 'current-password' : 'new-password'
            }
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {mode === 'signup' && (
          <>
            <div className="field">
              <label htmlFor="confirm-password">Confirmar senha</label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <label className="consent-field">
              <input
                type="checkbox"
                required
                checked={marketingOptIn}
                onChange={(e) => setMarketingOptIn(e.target.checked)}
              />
              <span>
                Quero receber promoções, novidades e lançamentos da Belleland
                por e-mail.
              </span>
            </label>
          </>
        )}
        <button className="button-pop button-primary full" disabled={loading}>
          {loading
            ? mode === 'login'
              ? 'Entrando…'
              : 'Criando conta…'
            : mode === 'login'
              ? 'Entrar'
              : 'Criar conta'}
        </button>
        <button
          className="auth-toggle"
          type="button"
          onClick={() => {
            setMode(mode === 'login' ? 'signup' : 'login');
            setError('');
            setMessage('');
            setConfirmPassword('');
            setMarketingOptIn(false);
          }}
        >
          {mode === 'login'
            ? 'Ainda não tem conta? Criar conta'
            : 'Já tem conta? Entrar'}
        </button>
        <a className="demo-login" href="/admin?preview=1">
          Entrar sem login <span>modo de teste</span>
        </a>
      </form>
    </main>
  );
}
