'use client';

import { ArrowUpRight, LogOut, RefreshCw } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ReviewCard } from '@/components/review-card';
import {
  assertOwner,
  listCaptures,
  publishCapture,
  setCaptureStatus,
} from '@/lib/admin';
import { requireSupabase } from '@/lib/supabase';
import type { Capture } from '@/lib/types';

const tabs = [
  { id: 'pending_review', label: 'Revisar' },
  { id: 'publishing', label: 'Publicando' },
  { id: 'published', label: 'Publicados' },
  { id: 'ignored', label: 'Ignorados' },
];

export default function AdminPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('pending_review');
  const [accessError, setAccessError] = useState('');
  const [publishing, setPublishing] = useState<Capture[]>([]);
  useEffect(() => {
    assertOwner().catch((error) => {
      setAccessError(error.message);
      setTimeout(() => router.replace('/admin/login'), 1500);
    });
  }, [router]);
  const {
    data: captures = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['captures', tab],
    queryFn: () =>
      tab === 'publishing' ? Promise.resolve(publishing) : listCaptures(tab),
    enabled: !accessError,
  });
  const publish = useMutation({
    mutationFn: publishCapture,
    onMutate: async (capture) => {
      setPublishing((items) => [...items, capture]);
      queryClient.setQueryData<Capture[]>(
        ['captures', 'pending_review'],
        (old) => old?.filter((item) => item.id !== capture.id) || [],
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['captures'] });
      void queryClient.invalidateQueries({ queryKey: ['published-products'] });
    },
    onError: (_error, capture) => {
      queryClient.setQueryData<Capture[]>(
        ['captures', 'pending_review'],
        (old) => [capture, ...(old || [])],
      );
    },
    onSettled: (_data, _error, capture) =>
      setPublishing((items) => items.filter((item) => item.id !== capture.id)),
  });
  const status = useMutation({
    mutationFn: ({
      id,
      next,
    }: {
      id: number;
      next: 'pending_review' | 'ignored';
    }) => setCaptureStatus(id, next),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['captures'] });
    },
  });
  async function logout() {
    await requireSupabase().auth.signOut();
    router.replace('/admin/login');
  }
  const current = captures[0];
  return (
    <main className="admin-page">
      <header className="admin-header">
        <a href="/">
          <img src="/brand/belleland-logo.svg" alt="Belleland Closet" />
        </a>
        <div>
          <a className="admin-site-link" href="/" target="_blank">
            Ver site <ArrowUpRight size={15} />
          </a>
          <button className="icon-button" onClick={logout} aria-label="Sair">
            <LogOut />
          </button>
        </div>
      </header>
      <div className="admin-container">
        <div className="admin-title">
          <div>
            <span>Painel da proprietária</span>
            <h1>Curadoria de peças</h1>
          </div>
          <button
            className="refresh-button"
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ['captures'] })
            }
          >
            <RefreshCw size={16} /> Atualizar
          </button>
        </div>
        <nav className="admin-tabs" aria-label="Estados da curadoria">
          {tabs.map((item) => (
            <button
              className={tab === item.id ? 'active' : ''}
              onClick={() => setTab(item.id)}
              key={item.id}
            >
              {item.label}
              {item.id === 'publishing' && publishing.length > 0 && (
                <b>{publishing.length}</b>
              )}
            </button>
          ))}
        </nav>
        {accessError && <div className="form-error">{accessError}</div>}
        {error && (
          <div className="form-error">
            {error instanceof Error
              ? error.message
              : 'Falha ao carregar capturas.'}
          </div>
        )}
        {isLoading ? (
          <div className="admin-loading">Carregando capturas…</div>
        ) : current ? (
          tab === 'pending_review' ? (
            <ReviewCard
              key={current.id}
              initial={current}
              busy={publish.isPending || status.isPending}
              onPublish={(capture) => publish.mutate(capture)}
              onIgnore={(id) => status.mutate({ id, next: 'ignored' })}
            />
          ) : (
            <CaptureList
              captures={captures}
              tab={tab}
              onRestore={(id) => status.mutate({ id, next: 'pending_review' })}
            />
          )
        ) : (
          <EmptyAdmin tab={tab} />
        )}
        {publish.error && (
          <div className="form-error publish-error">
            A publicação falhou e a peça voltou para revisão.{' '}
            {publish.error.message}
          </div>
        )}
      </div>
    </main>
  );
}

function CaptureList({
  captures,
  tab,
  onRestore,
}: {
  captures: Capture[];
  tab: string;
  onRestore: (id: number) => void;
}) {
  return (
    <div className="capture-list">
      {captures.map((capture) => (
        <article key={capture.id}>
          <img
            src={
              capture.capture_media.find(
                (media) => media.decision === 'primary',
              )?.public_url || capture.capture_media[0]?.public_url
            }
            alt=""
          />
          <div>
            <span>
              {tab === 'published'
                ? 'Publicado'
                : tab === 'publishing'
                  ? 'Publicando'
                  : 'Ignorado'}
            </span>
            <h2>
              {capture.proposed_name || `Post ${capture.instagram_shortcode}`}
            </h2>
            <a href={capture.source_url} target="_blank" rel="noreferrer">
              Ver no Instagram
            </a>
          </div>
          {tab === 'ignored' && (
            <button
              className="button-pop button-outline"
              onClick={() => onRestore(capture.id)}
            >
              Restaurar
            </button>
          )}
        </article>
      ))}
    </div>
  );
}

function EmptyAdmin({ tab }: { tab: string }) {
  const messages: Record<string, string> = {
    pending_review: 'Não há mais produtos para cadastrar',
    publishing: 'Nenhuma publicação em andamento',
    published: 'Nenhum produto publicado ainda',
    ignored: 'Nenhuma captura ignorada',
  };
  return (
    <div className="admin-empty">
      <span>✦</span>
      <h2>{messages[tab]}</h2>
      <p>
        {tab === 'pending_review'
          ? 'Quando a sincronização encontrar posts com #bellelandproduto, eles aparecerão aqui.'
          : 'Esta lista será atualizada automaticamente.'}
      </p>
      {tab === 'pending_review' && (
        <a className="button-pop button-primary" href="/">
          Ir para o site
        </a>
      )}
    </div>
  );
}
