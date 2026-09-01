'use client';

import { ArrowLeft, LockKeyhole } from 'lucide-react';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase, requireSupabase } from '@/lib/supabase';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
    setLoading(true);
    try {
      const { error: authError } =
        await requireSupabase().auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      router.replace('/admin');
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
        <h1>Área da proprietária</h1>
        <p>Entre para revisar e publicar as peças captadas.</p>
        {error && (
          <div className="form-error" role="alert">
            {error}
          </div>
        )}
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
            autoComplete="current-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="button-pop button-primary full" disabled={loading}>
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
        <a className="demo-login" href="/admin?preview=1">
          Entrar sem login <span>modo de teste</span>
        </a>
      </form>
    </main>
  );
}
