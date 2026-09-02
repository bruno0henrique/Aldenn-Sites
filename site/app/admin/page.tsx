'use client';

import {
  ArrowLeft,
  ArrowUpRight,
  Images,
  LogOut,
  Pencil,
  RefreshCw,
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReviewCard } from '@/components/review-card';
import { ManualProductForm } from '@/components/manual-product-form';
import { PublishedProductCard } from '@/components/published-product-card';
import {
  assertStaff,
  deleteCapture,
  listCaptures,
  listPublishedProductsAdmin,
  publishCapture,
  removePublishedProduct,
  setCaptureStatus,
  syncInstagramPosts,
  updatePublishedProduct,
} from '@/lib/admin';
import { requireSupabase } from '@/lib/supabase';
import type { Capture, Product } from '@/lib/types';

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
  proposed_sale_price_cents: null,
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
  const [syncMessage, setSyncMessage] = useState('');
  const [selectedCaptureId, setSelectedCaptureId] = useState<number | null>(
    null,
  );
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
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
    enabled: !accessError && !previewMode && tab !== 'published',
  });
  const {
    data: publishedProducts = [],
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ['admin-published-products'],
    queryFn: listPublishedProductsAdmin,
    enabled: !accessError && !previewMode && tab === 'published',
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
  const demoProducts: Product[] = demoPublished.map((capture) => ({
    id: capture.id,
    slug: `demo-${capture.id}`,
    name: capture.proposed_name || 'Peça Belleland',
    description: capture.proposed_description,
    category: capture.proposed_category,
    price_cents: capture.price_cents || 0,
    sale_price_cents: capture.proposed_sale_price_cents,
    instagram_url: capture.source_url || null,
    primary_image_url:
      capture.capture_media.find((media) => media.decision === 'primary')
        ?.public_url ||
      capture.capture_media[0]?.public_url ||
      '',
    images: capture.capture_media.map((media) => media.public_url),
  }));
  const displayedProducts = previewMode ? demoProducts : publishedProducts;
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
  const removeCapture = useMutation({
    mutationFn: deleteCapture,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['captures'] });
    },
  });
  const updateProduct = useMutation({
    mutationFn: updatePublishedProduct,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['admin-published-products'],
      });
      void queryClient.invalidateQueries({ queryKey: ['published-products'] });
    },
  });
  const removeProduct = useMutation({
    mutationFn: removePublishedProduct,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['admin-published-products'],
      });
      void queryClient.invalidateQueries({ queryKey: ['published-products'] });
      void queryClient.invalidateQueries({ queryKey: ['captures'] });
    },
  });
  const synchronize = useMutation({
    mutationFn: syncInstagramPosts,
    onSuccess: (result) => {
      setTab('pending_review');
      setSelectedCaptureId(null);
      setSyncMessage(
        result.created
          ? `${result.created} nova${result.created === 1 ? '' : 's'} publicação${result.created === 1 ? '' : 'ões'} adicionada${result.created === 1 ? '' : 's'} para revisão.`
          : 'Instagram conferido. Nenhuma publicação nova no momento.',
      );
      void queryClient.invalidateQueries({ queryKey: ['captures'] });
    },
    onError: (syncError) => setSyncMessage(syncError.message),
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
    setSyncMessage('Demonstração atualizada.');
    setSelectedCaptureId(null);
    setSelectedProductId(null);
    setTab('pending_review');
  }
  function handlePublish(capture: Capture) {
    setSelectedCaptureId(null);
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
    setSelectedCaptureId(null);
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
  function handleDeleteCapture(capture: Capture) {
    if (!window.confirm('Excluir esta captura e suas fotos definitivamente?'))
      return;
    if (!previewMode) {
      setSelectedCaptureId(null);
      removeCapture.mutate(capture);
      return;
    }
    setDemoPending((items) => items.filter((item) => item.id !== capture.id));
    setDemoIgnored((items) => items.filter((item) => item.id !== capture.id));
  }
  function handleUpdateProduct(product: Product) {
    setSelectedProductId(null);
    if (!previewMode) {
      updateProduct.mutate(product);
      return;
    }
    setDemoPublished((items) =>
      items.map((item) =>
        item.id === product.id
          ? {
              ...item,
              proposed_name: product.name,
              proposed_description: product.description,
              proposed_category: product.category,
              price_cents: product.price_cents,
              proposed_sale_price_cents: product.sale_price_cents,
            }
          : item,
      ),
    );
  }
  function handleDeleteProduct(id: number) {
    setSelectedProductId(null);
    if (!previewMode) {
      removeProduct.mutate(id);
      return;
    }
    setDemoPublished((items) => items.filter((item) => item.id !== id));
  }
  const selectedCapture = displayedCaptures.find(
    (capture) => capture.id === selectedCaptureId,
  );
  const selectedProduct = displayedProducts.find(
    (product) => product.id === selectedProductId,
  );
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
            disabled={synchronize.isPending}
            onClick={() => (previewMode ? resetDemo() : synchronize.mutate())}
          >
            <RefreshCw
              size={16}
              className={synchronize.isPending ? 'refresh-spinning' : ''}
            />{' '}
            {synchronize.isPending ? 'Buscando...' : 'Atualizar'}
          </button>
        </div>
        {syncMessage && (
          <output
            className={synchronize.isError ? 'form-error' : 'sync-message'}
          >
            {syncMessage}
          </output>
        )}
        {!previewMode && (
          <ManualProductForm
            onCreated={() => {
              setTab('pending_review');
              setSelectedCaptureId(null);
              void queryClient.invalidateQueries({ queryKey: ['captures'] });
            }}
          />
        )}
        <nav className="admin-tabs" aria-label="Estados da curadoria">
          {tabs.map((item) => (
            <button
              className={tab === item.id ? 'active' : ''}
              onClick={() => {
                setTab(item.id);
                setSelectedCaptureId(null);
                setSelectedProductId(null);
              }}
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
        {productsError && (
          <div className="form-error">
            {productsError instanceof Error
              ? productsError.message
              : 'Falha ao carregar produtos publicados.'}
          </div>
        )}
        {!previewMode && (tab === 'published' ? productsLoading : isLoading) ? (
          <div className="admin-loading">Carregando capturas…</div>
        ) : tab === 'published' && selectedProduct ? (
          <div className="selected-editor">
            <button
              className="back-to-products"
              type="button"
              onClick={() => setSelectedProductId(null)}
            >
              <ArrowLeft size={17} /> Voltar aos produtos
            </button>
            <div className="published-product-list">
              <PublishedProductCard
                key={selectedProduct.id}
                initial={selectedProduct}
                busy={updateProduct.isPending || removeProduct.isPending}
                onSave={handleUpdateProduct}
                onDelete={handleDeleteProduct}
              />
            </div>
          </div>
        ) : tab === 'published' && displayedProducts.length ? (
          <ProductChooser
            products={displayedProducts}
            onSelect={setSelectedProductId}
          />
        ) : tab === 'published' ? (
          <EmptyAdmin tab={tab} />
        ) : displayedCaptures.length ? (
          tab === 'pending_review' ? (
            selectedCapture ? (
              <div className="selected-editor">
                <button
                  className="back-to-products"
                  type="button"
                  onClick={() => setSelectedCaptureId(null)}
                >
                  <ArrowLeft size={17} /> Voltar às peças
                </button>
                <ReviewCard
                  key={selectedCapture.id}
                  initial={selectedCapture}
                  busy={
                    previewMode
                      ? demoBusy
                      : publish.isPending ||
                        status.isPending ||
                        removeCapture.isPending
                  }
                  onPublish={handlePublish}
                  onIgnore={handleIgnore}
                  onDelete={handleDeleteCapture}
                />
              </div>
            ) : (
              <CaptureChooser
                captures={displayedCaptures}
                onSelect={setSelectedCaptureId}
              />
            )
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
        {(removeCapture.error ||
          updateProduct.error ||
          removeProduct.error) && (
          <div className="form-error publish-error">
            {(removeCapture.error || updateProduct.error || removeProduct.error)
              ?.message || 'Não foi possível concluir a alteração.'}
          </div>
        )}
      </div>
    </main>
  );
}

function CaptureChooser({
  captures,
  onSelect,
}: {
  captures: Capture[];
  onSelect: (id: number) => void;
}) {
  return (
    <div className="product-chooser">
      {captures.map((capture) => {
        const image =
          capture.capture_media.find((media) => media.decision === 'primary')
            ?.public_url || capture.capture_media[0]?.public_url;
        return (
          <button
            className="product-choice-card"
            key={capture.id}
            type="button"
            aria-label={`Editar ${capture.proposed_name || `post ${capture.instagram_shortcode}`}`}
            onClick={() => onSelect(capture.id)}
          >
            {image ? (
              <img src={image} alt="" loading="lazy" />
            ) : (
              <span className="choice-image-empty">
                <Images size={24} />
              </span>
            )}
            <span className="choice-card-copy">
              <small>{capture.capture_media.length} foto(s)</small>
              <strong>
                {capture.proposed_name || `Post ${capture.instagram_shortcode}`}
              </strong>
              <span>
                <Pencil size={14} /> Editar peça
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ProductChooser({
  products,
  onSelect,
}: {
  products: Product[];
  onSelect: (id: number) => void;
}) {
  return (
    <div className="product-chooser">
      {products.map((product) => (
        <button
          className="product-choice-card"
          key={product.id}
          type="button"
          aria-label={`Editar ${product.name}`}
          onClick={() => onSelect(product.id)}
        >
          <img src={product.primary_image_url} alt="" loading="lazy" />
          <span className="choice-card-copy">
            <small>Publicado</small>
            <strong>{product.name}</strong>
            <span>
              <Pencil size={14} /> Editar produto
            </span>
          </span>
        </button>
      ))}
    </div>
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
          ? 'Clique em Atualizar para buscar novas publicações do Instagram.'
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
