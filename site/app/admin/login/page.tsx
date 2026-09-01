'use client';

import { ArrowLeft, LockKeyhole } from 'lucide-react';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase, requireSupabase } from '@/lib/supabase';

export default function AdminLogin() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    void getSupabase()
      ?.auth.getSession()
      .then(({ data }) => {
        if (data.session) router.replace('/admin');
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
          options: { emailRedirectTo: `${window.location.origin}/admin/login` },
        });
        if (authError) throw authError;
        if (data.session) await supabase.auth.signOut();
        setPassword('');
        setConfirmPassword('');
        setMode('login');
        setMessage(
          'Conta criada. Confirme seu e-mail e aguarde a liberação do acesso de proprietária.',
        );
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (authError) throw authError;
        router.replace('/admin');
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
        <h1>{mode === 'login' ? 'Área da proprietária' : 'Criar conta'}</h1>
        <p>
          {mode === 'login'
            ? 'Entre para revisar e publicar as peças captadas.'
            : 'Cadastre seu acesso. A conta precisará ser liberada como proprietária.'}
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
