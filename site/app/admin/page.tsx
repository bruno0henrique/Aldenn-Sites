'use client';

import { ArrowUpRight, LogOut, RefreshCw } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReviewCard } from '@/components/review-card';
import { ManualProductForm } from '@/components/manual-product-form';
import {
  assertStaff,
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

const demoCapture: Capture = {
  id: -1,
  instagram_shortcode: 'demo-belleland',
  source_url: 'https://www.instagram.com/bellelandcloset/',
  proposed_name: 'Peça de teste Belleland',
  proposed_description:
    'Captura de demonstração para testar a curadoria antes da conexão com o Supabase.',
  proposed_category: 'Novidades',
  price_cents: 11990,
  status: 'pending_review',
  capture_media: [
    {
      id: -11,
      public_url: '/brand/dear-belle-girl.jpeg',
      decision: 'primary',
      source_position: 0,
    },
    {
      id: -12,
      public_url: '/brand/hero-abstract.png',
      decision: 'secondary',
      source_position: 1,
    },
  ],
};

export default function AdminPage() {
  return (
    <Suspense fallback={<main className="admin-page" />}>
      <AdminPageContent />
    </Suspense>
  );
}

function AdminPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const previewMode = searchParams.get('preview') === '1';
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('pending_review');
  const [accessError, setAccessError] = useState('');
  const [publishing, setPublishing] = useState<Capture[]>([]);
  const [demoPending, setDemoPending] = useState<Capture[]>([demoCapture]);
  const [demoPublishing, setDemoPublishing] = useState<Capture[]>([]);
  const [demoPublished, setDemoPublished] = useState<Capture[]>([]);
  const [demoIgnored, setDemoIgnored] = useState<Capture[]>([]);
  const [demoBusy, setDemoBusy] = useState(false);
  useEffect(() => {
    if (previewMode) return;
    assertStaff().catch((error) => {
      setAccessError(error.message);
      setTimeout(() => router.replace('/admin/login'), 1500);
    });
  }, [previewMode, router]);
  const {
    data: captures = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['captures', tab],
    queryFn: () =>
      tab === 'publishing' ? Promise.resolve(publishing) : listCaptures(tab),
    enabled: !accessError && !previewMode,
  });
  const demoCaptures: Record<string, Capture[]> = {
    pending_review: demoPending,
    publishing: demoPublishing,
    published: demoPublished,
    ignored: demoIgnored,
  };
  const displayedCaptures = previewMode
    ? demoCaptures[tab] || []
    : tab === 'publishing'
      ? publishing
      : captures;
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
    if (previewMode) {
      router.replace('/admin/login');
      return;
    }
    await requireSupabase().auth.signOut();
    router.replace('/admin/login');
  }
  function resetDemo() {
    setDemoPending([demoCapture]);
    setDemoPublishing([]);
    setDemoPublished([]);
    setDemoIgnored([]);
    setDemoBusy(false);
    setTab('pending_review');
  }
  function handlePublish(capture: Capture) {
    if (!previewMode) {
      publish.mutate(capture);
      return;
    }
    setDemoBusy(true);
    setDemoPending((items) => items.filter((item) => item.id !== capture.id));
    setDemoPublishing([{ ...capture, status: 'publishing' }]);
    setTab('publishing');
    window.setTimeout(() => {
      setDemoPublishing([]);
      setDemoPublished([{ ...capture, status: 'published' }]);
      setDemoBusy(false);
      setTab('published');
    }, 700);
  }
  function handleIgnore(id: number) {
    if (!previewMode) {
      status.mutate({ id, next: 'ignored' });
      return;
    }
    const capture = demoPending.find((item) => item.id === id);
    if (!capture) return;
    setDemoPending((items) => items.filter((item) => item.id !== id));
    setDemoIgnored([{ ...capture, status: 'ignored' }]);
    setTab('ignored');
  }
  function handleRestore(id: number) {
    if (!previewMode) {
      status.mutate({ id, next: 'pending_review' });
      return;
    }
    const capture = demoIgnored.find((item) => item.id === id);
    if (!capture) return;
    setDemoIgnored((items) => items.filter((item) => item.id !== id));
    setDemoPending([{ ...capture, status: 'pending_review' }]);
    setTab('pending_review');
  }
  const current = displayedCaptures[0];
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
            <span>Painel administrativo</span>
            <h1>Aprovações</h1>
            {previewMode && (
              <p className="preview-badge">
                Modo demonstração: dados locais de teste
              </p>
            )}
          </div>
          <button
            className="refresh-button"
            onClick={() =>
              previewMode
                ? resetDemo()
                : queryClient.invalidateQueries({ queryKey: ['captures'] })
            }
          >
            <RefreshCw size={16} /> Atualizar
          </button>
        </div>
        {!previewMode && (
          <ManualProductForm
            onCreated={() => {
              setTab('pending_review');
              void queryClient.invalidateQueries({ queryKey: ['captures'] });
            }}
          />
        )}
        <nav className="admin-tabs" aria-label="Estados da curadoria">
          {tabs.map((item) => (
            <button
              className={tab === item.id ? 'active' : ''}
              onClick={() => setTab(item.id)}
              key={item.id}
            >
              {item.label}
              {item.id === 'publishing' &&
                (previewMode ? demoPublishing.length : publishing.length) >
                  0 && (
                  <b>
                    {previewMode ? demoPublishing.length : publishing.length}
                  </b>
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
        {!previewMode && isLoading ? (
          <div className="admin-loading">Carregando capturas…</div>
        ) : current ? (
          tab === 'pending_review' ? (
            <ReviewCard
              key={current.id}
              initial={current}
              busy={
                previewMode ? demoBusy : publish.isPending || status.isPending
              }
              onPublish={handlePublish}
              onIgnore={handleIgnore}
            />
          ) : (
            <CaptureList
              captures={displayedCaptures}
              tab={tab}
              onRestore={handleRestore}
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
            {capture.source_url ? (
              <a href={capture.source_url} target="_blank" rel="noreferrer">
                Ver no Instagram
              </a>
            ) : (
              <small>Cadastro manual</small>
            )}
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
