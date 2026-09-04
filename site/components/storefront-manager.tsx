'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  ImagePlus,
  Images,
  Pencil,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import {
  createCatalogCategory,
  createHomeBanner,
  createHomeFeaturedProduct,
  deleteHomeBanner,
  deleteHomeFeaturedProduct,
  listCatalogCategoriesAdmin,
  listHomeBannersAdmin,
  listHomeFeaturedProductsAdmin,
  listPublishedProductsAdmin,
  reorderCatalogCategories,
  reorderHomeBanners,
  reorderHomeFeaturedProducts,
  updateCatalogCategory,
  updateHomeBanner,
  updateHomeFeaturedProduct,
  type HomeBannerRow,
} from '@/lib/admin';
import type { CatalogCategory, HomeFeaturedProduct } from '@/lib/types';

function moveItem<T>(items: T[], index: number, direction: -1 | 1) {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= items.length) return items;
  const next = [...items];
  [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
  return next;
}

function formText(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === 'string' ? value.trim() : '';
}

export function StorefrontManager({ previewMode }: { previewMode: boolean }) {
  const queryClient = useQueryClient();
  const [categoryName, setCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [bannerMode, setBannerMode] = useState<'product' | 'editorial'>(
    'product',
  );
  const [productId, setProductId] = useState(0);
  const [mediaPosition, setMediaPosition] = useState(0);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [bannerEyebrow, setBannerEyebrow] = useState('');
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerDescription, setBannerDescription] = useState('');
  const [bannerCtaLabel, setBannerCtaLabel] = useState('');
  const [bannerCtaUrl, setBannerCtaUrl] = useState('');
  const [featuredProductId, setFeaturedProductId] = useState(0);

  const categoriesQuery = useQuery({
    queryKey: ['admin-catalog-categories'],
    queryFn: listCatalogCategoriesAdmin,
    enabled: !previewMode,
  });
  const bannersQuery = useQuery({
    queryKey: ['admin-home-banners'],
    queryFn: listHomeBannersAdmin,
    enabled: !previewMode,
  });
  const productsQuery = useQuery({
    queryKey: ['admin-published-products'],
    queryFn: listPublishedProductsAdmin,
    enabled: !previewMode,
  });
  const featuredQuery = useQuery({
    queryKey: ['admin-home-featured-products'],
    queryFn: listHomeFeaturedProductsAdmin,
    enabled: !previewMode,
  });

  const categories = categoriesQuery.data || [];
  const banners = bannersQuery.data || [];
  const products = productsQuery.data || [];
  const featuredItems = featuredQuery.data || [];
  const selectedProduct = products.find((product) => product.id === productId);

  function refreshCategories() {
    void queryClient.invalidateQueries({
      queryKey: ['admin-catalog-categories'],
    });
    void queryClient.invalidateQueries({ queryKey: ['catalog-categories'] });
  }
  function refreshBanners() {
    void queryClient.invalidateQueries({ queryKey: ['admin-home-banners'] });
    void queryClient.invalidateQueries({ queryKey: ['home-banners'] });
  }
  function refreshFeatured() {
    void queryClient.invalidateQueries({
      queryKey: ['admin-home-featured-products'],
    });
    void queryClient.invalidateQueries({ queryKey: ['home-catalog'] });
  }

  const addCategory = useMutation({
    mutationFn: createCatalogCategory,
    onSuccess: () => {
      setCategoryName('');
      refreshCategories();
    },
  });
  const changeCategory = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: number;
      updates: Partial<
        Pick<CatalogCategory, 'name' | 'is_active' | 'sort_order'>
      >;
    }) => updateCatalogCategory(id, updates),
    onSuccess: () => {
      setEditingCategory(null);
      refreshCategories();
      void queryClient.invalidateQueries({ queryKey: ['published-products'] });
    },
  });
  const orderCategories = useMutation({
    mutationFn: reorderCatalogCategories,
    onSuccess: refreshCategories,
  });
  const addBanner = useMutation({
    mutationFn: createHomeBanner,
    onSuccess: () => {
      setProductId(0);
      setMediaPosition(0);
      setBannerImage(null);
      setBannerEyebrow('');
      setBannerTitle('');
      setBannerDescription('');
      setBannerCtaLabel('');
      setBannerCtaUrl('');
      refreshBanners();
    },
  });
  const changeBanner = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: number;
      updates: Partial<HomeBannerRow>;
    }) => updateHomeBanner(id, updates),
    onSuccess: refreshBanners,
  });
  const orderBanners = useMutation({
    mutationFn: reorderHomeBanners,
    onSuccess: refreshBanners,
  });
  const removeBanner = useMutation({
    mutationFn: deleteHomeBanner,
    onSuccess: refreshBanners,
  });
  const addFeatured = useMutation({
    mutationFn: createHomeFeaturedProduct,
    onSuccess: () => {
      setFeaturedProductId(0);
      refreshFeatured();
    },
  });
  const changeFeatured = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: number;
      updates: Partial<Pick<HomeFeaturedProduct, 'sort_order' | 'is_active'>>;
    }) => updateHomeFeaturedProduct(id, updates),
    onSuccess: refreshFeatured,
  });
  const orderFeatured = useMutation({
    mutationFn: reorderHomeFeaturedProducts,
    onSuccess: refreshFeatured,
  });
  const removeFeatured = useMutation({
    mutationFn: deleteHomeFeaturedProduct,
    onSuccess: refreshFeatured,
  });

  const error =
    categoriesQuery.error ||
    bannersQuery.error ||
    productsQuery.error ||
    addCategory.error ||
    changeCategory.error ||
    orderCategories.error ||
    addBanner.error ||
    changeBanner.error ||
    orderBanners.error ||
    removeBanner.error ||
    featuredQuery.error ||
    addFeatured.error ||
    changeFeatured.error ||
    orderFeatured.error ||
    removeFeatured.error;

  if (previewMode) {
    return (
      <div className="admin-empty">
        <span>✦</span>
        <h2>Vitrine disponível na conta administrativa</h2>
        <p>O modo demonstração não altera categorias nem banners reais.</p>
      </div>
    );
  }

  if (
    categoriesQuery.isLoading ||
    bannersQuery.isLoading ||
    productsQuery.isLoading ||
    featuredQuery.isLoading
  ) {
    return <div className="admin-loading">Carregando vitrine...</div>;
  }

  return (
    <div className="storefront-manager">
      {error && (
        <div className="form-error">
          {error instanceof Error
            ? error.message
            : 'Não foi possível atualizar a vitrine.'}
        </div>
      )}

      <section className="storefront-panel" aria-labelledby="categories-title">
        <header>
          <div>
            <span>Opções da barra lateral</span>
            <h2 id="categories-title">Menu de produtos</h2>
            <p>
              Adicione, renomeie, ordene ou oculte os tópicos exibidos dentro de
              Produtos.
            </p>
          </div>
        </header>
        <form
          className="storefront-inline-form"
          onSubmit={(event) => {
            event.preventDefault();
            addCategory.mutate(categoryName);
          }}
        >
          <div className="field">
            <label htmlFor="new-category">Nova categoria</label>
            <input
              id="new-category"
              value={categoryName}
              maxLength={60}
              onChange={(event) => setCategoryName(event.target.value)}
              placeholder="Ex.: Jaquetas"
            />
          </div>
          <button
            className="button-pop button-primary"
            disabled={addCategory.isPending || categoryName.trim().length < 2}
          >
            <Plus size={17} /> Adicionar
          </button>
        </form>
        <div className="storefront-list">
          {categories.map((category, index) => (
            <article key={category.id}>
              <div className="storefront-list-main">
                {editingCategory === category.id ? (
                  <input
                    aria-label="Nome da categoria"
                    value={editingName}
                    maxLength={60}
                    onChange={(event) => setEditingName(event.target.value)}
                  />
                ) : (
                  <div>
                    <strong>{category.name}</strong>
                    <small>{category.is_active ? 'Visível' : 'Oculta'}</small>
                  </div>
                )}
              </div>
              <div className="storefront-row-actions">
                <button
                  type="button"
                  aria-label="Mover categoria para cima"
                  disabled={index === 0 || orderCategories.isPending}
                  onClick={() =>
                    orderCategories.mutate(moveItem(categories, index, -1))
                  }
                >
                  <ChevronUp />
                </button>
                <button
                  type="button"
                  aria-label="Mover categoria para baixo"
                  disabled={
                    index === categories.length - 1 || orderCategories.isPending
                  }
                  onClick={() =>
                    orderCategories.mutate(moveItem(categories, index, 1))
                  }
                >
                  <ChevronDown />
                </button>
                {editingCategory === category.id ? (
                  <button
                    type="button"
                    aria-label="Salvar categoria"
                    onClick={() =>
                      changeCategory.mutate({
                        id: category.id,
                        updates: { name: editingName },
                      })
                    }
                  >
                    <Save />
                  </button>
                ) : (
                  <button
                    type="button"
                    aria-label="Renomear categoria"
                    onClick={() => {
                      setEditingCategory(category.id);
                      setEditingName(category.name);
                    }}
                  >
                    <Pencil />
                  </button>
                )}
                <button
                  type="button"
                  aria-label={
                    category.is_active
                      ? 'Ocultar categoria'
                      : 'Ativar categoria'
                  }
                  onClick={() =>
                    changeCategory.mutate({
                      id: category.id,
                      updates: { is_active: !category.is_active },
                    })
                  }
                >
                  {category.is_active ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="storefront-panel" aria-labelledby="banners-title">
        <header>
          <div>
            <span>Primeira impressão</span>
            <h2 id="banners-title">Carrossel de chegada</h2>
            <p>
              Use uma peça publicada ou envie uma arte livre para promoções,
              campanhas e modelos.
            </p>
          </div>
        </header>
        <div className="banner-builder">
          <div className="storefront-choice" aria-label="Tipo de destaque">
            <button
              type="button"
              className={bannerMode === 'product' ? 'active' : ''}
              onClick={() => setBannerMode('product')}
            >
              Produto
            </button>
            <button
              type="button"
              className={bannerMode === 'editorial' ? 'active' : ''}
              onClick={() => setBannerMode('editorial')}
            >
              Arte livre
            </button>
          </div>
          {bannerMode === 'product' ? (
            <div className="field">
              <label htmlFor="banner-product">Produto publicado</label>
              <select
                id="banner-product"
                value={productId}
                onChange={(event) => {
                  setProductId(Number(event.target.value));
                  setMediaPosition(0);
                }}
              >
                <option value={0}>Selecione um produto</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="field">
              <label htmlFor="banner-image">Imagem do destaque</label>
              <input
                id="banner-image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) =>
                  setBannerImage(event.target.files?.[0] || null)
                }
              />
            </div>
          )}
          {bannerMode === 'product' && selectedProduct && (
            <div className="banner-image-options" aria-label="Escolha a foto">
              {(
                selectedProduct.images || [selectedProduct.primary_image_url]
              ).map((image, index) => (
                <button
                  type="button"
                  className={mediaPosition === index ? 'active' : ''}
                  key={`${image}-${index}`}
                  onClick={() => setMediaPosition(index)}
                  aria-label={`Usar foto ${index + 1}`}
                >
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          )}
          <div className="storefront-editor-fields">
            <div className="field">
              <label htmlFor="banner-eyebrow">Chamada curta</label>
              <input
                id="banner-eyebrow"
                value={bannerEyebrow}
                maxLength={40}
                placeholder="Ex.: Promoção especial"
                onChange={(event) => setBannerEyebrow(event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="banner-title">Título</label>
              <input
                id="banner-title"
                value={bannerTitle}
                maxLength={90}
                placeholder={
                  bannerMode === 'product'
                    ? 'Opcional: usa o nome da peça'
                    : 'Título principal do destaque'
                }
                onChange={(event) => setBannerTitle(event.target.value)}
              />
            </div>
            <div className="field storefront-wide-field">
              <label htmlFor="banner-description">Texto</label>
              <input
                id="banner-description"
                value={bannerDescription}
                maxLength={180}
                placeholder="Uma frase curta para acompanhar a imagem"
                onChange={(event) => setBannerDescription(event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="banner-cta-label">Texto do botão</label>
              <input
                id="banner-cta-label"
                value={bannerCtaLabel}
                maxLength={32}
                placeholder="Ex.: Ver coleção"
                onChange={(event) => setBannerCtaLabel(event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="banner-cta-url">Destino do botão</label>
              <input
                id="banner-cta-url"
                value={bannerCtaUrl}
                maxLength={500}
                placeholder="Ex.: /?categoria=vestidos#colecao"
                onChange={(event) => setBannerCtaUrl(event.target.value)}
              />
            </div>
          </div>
          <button
            type="button"
            className="button-pop button-primary"
            disabled={
              addBanner.isPending ||
              (bannerMode === 'product' ? !selectedProduct : !bannerImage)
            }
            onClick={() =>
              addBanner.mutate({
                productId: bannerMode === 'product' ? productId : null,
                mediaPosition,
                image: bannerMode === 'editorial' ? bannerImage : null,
                eyebrow: bannerEyebrow,
                title: bannerTitle,
                description: bannerDescription,
                ctaLabel: bannerCtaLabel,
                ctaUrl: bannerCtaUrl,
              })
            }
          >
            <ImagePlus size={17} /> Adicionar destaque
          </button>
        </div>

        <div className="banner-admin-list">
          {banners.length ? (
            banners.map((banner, index) => {
              const product = products.find(
                (item) => item.id === banner.product_id,
              );
              const images = product?.images || [];
              const image =
                banner.image_url ||
                images[banner.media_position] ||
                product?.primary_image_url;
              return (
                <article key={banner.id}>
                  {image && <img src={image} alt="" />}
                  <div>
                    <small>{banner.is_active ? 'Ativo' : 'Oculto'}</small>
                    <strong>
                      {banner.title || product?.name || 'Destaque editorial'}
                    </strong>
                    {product && images.length > 1 && (
                      <select
                        aria-label="Foto do banner"
                        value={banner.media_position}
                        onChange={(event) =>
                          changeBanner.mutate({
                            id: banner.id,
                            updates: {
                              media_position: Number(event.target.value),
                            },
                          })
                        }
                      >
                        {images.map((_, imageIndex) => (
                          <option key={imageIndex} value={imageIndex}>
                            Foto {imageIndex + 1}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div className="storefront-row-actions">
                    <button
                      type="button"
                      aria-label="Mover banner para cima"
                      disabled={index === 0 || orderBanners.isPending}
                      onClick={() =>
                        orderBanners.mutate(moveItem(banners, index, -1))
                      }
                    >
                      <ChevronUp />
                    </button>
                    <button
                      type="button"
                      aria-label="Mover banner para baixo"
                      disabled={
                        index === banners.length - 1 || orderBanners.isPending
                      }
                      onClick={() =>
                        orderBanners.mutate(moveItem(banners, index, 1))
                      }
                    >
                      <ChevronDown />
                    </button>
                    <button
                      type="button"
                      aria-label={
                        banner.is_active ? 'Ocultar banner' : 'Ativar banner'
                      }
                      onClick={() =>
                        changeBanner.mutate({
                          id: banner.id,
                          updates: { is_active: !banner.is_active },
                        })
                      }
                    >
                      {banner.is_active ? <EyeOff /> : <Eye />}
                    </button>
                    <button
                      type="button"
                      aria-label="Excluir banner"
                      onClick={() => {
                        if (
                          window.confirm(
                            'Excluir este banner da página inicial?',
                          )
                        )
                          removeBanner.mutate(banner);
                      }}
                    >
                      <Trash2 />
                    </button>
                  </div>
                  <details className="banner-edit-details">
                    <summary>
                      <Pencil /> Editar textos
                    </summary>
                    <form
                      className="storefront-editor-fields"
                      onSubmit={(event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        changeBanner.mutate({
                          id: banner.id,
                          updates: {
                            eyebrow: formText(formData, 'eyebrow') || null,
                            title: formText(formData, 'title') || null,
                            description:
                              formText(formData, 'description') || null,
                            cta_label: formText(formData, 'cta_label') || null,
                            cta_url: formText(formData, 'cta_url') || null,
                          },
                        });
                      }}
                    >
                      <input
                        name="eyebrow"
                        maxLength={40}
                        defaultValue={banner.eyebrow || ''}
                        placeholder="Chamada curta"
                        aria-label="Chamada curta"
                      />
                      <input
                        name="title"
                        maxLength={90}
                        defaultValue={banner.title || ''}
                        placeholder="Título"
                        aria-label="Título"
                      />
                      <input
                        name="description"
                        maxLength={180}
                        defaultValue={banner.description || ''}
                        placeholder="Texto"
                        aria-label="Texto"
                      />
                      <input
                        name="cta_label"
                        maxLength={32}
                        defaultValue={banner.cta_label || ''}
                        placeholder="Texto do botão"
                        aria-label="Texto do botão"
                      />
                      <input
                        name="cta_url"
                        maxLength={500}
                        defaultValue={banner.cta_url || ''}
                        placeholder="Destino do botão"
                        aria-label="Destino do botão"
                      />
                      <button
                        className="button-pop button-primary"
                        disabled={changeBanner.isPending}
                      >
                        <Save /> Salvar textos
                      </button>
                    </form>
                  </details>
                </article>
              );
            })
          ) : (
            <div className="storefront-empty">
              Nenhum banner ativo. A abertura atual continuará aparecendo.
            </div>
          )}
        </div>
      </section>

      <section className="storefront-panel" aria-labelledby="featured-title">
        <header>
          <div>
            <span>Segundo carrossel</span>
            <h2 id="featured-title">Novidades</h2>
            <p>
              Escolha e ordene as peças. Sem seleção manual, o site usa
              automaticamente os produtos mais recentes.
            </p>
          </div>
        </header>
        <div className="featured-builder">
          <div className="field">
            <label htmlFor="featured-product">Adicionar peça</label>
            <select
              id="featured-product"
              value={featuredProductId}
              onChange={(event) =>
                setFeaturedProductId(Number(event.target.value))
              }
            >
              <option value={0}>Selecione um produto</option>
              {products
                .filter(
                  (product) =>
                    !featuredItems.some(
                      (item) => item.product_id === product.id,
                    ),
                )
                .map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
            </select>
          </div>
          <button
            type="button"
            className="button-pop button-primary"
            disabled={!featuredProductId || addFeatured.isPending}
            onClick={() => addFeatured.mutate(featuredProductId)}
          >
            <Images /> Adicionar em Novidades
          </button>
        </div>
        <div className="banner-admin-list">
          {featuredItems.length ? (
            featuredItems.map((item, index) => {
              const product = products.find(
                (candidate) => candidate.id === item.product_id,
              );
              return (
                <article key={item.id}>
                  {product?.primary_image_url && (
                    <img src={product.primary_image_url} alt="" />
                  )}
                  <div>
                    <small>{item.is_active ? 'Visível' : 'Oculto'}</small>
                    <strong>{product?.name || 'Produto indisponível'}</strong>
                  </div>
                  <div className="storefront-row-actions">
                    <button
                      type="button"
                      aria-label="Mover novidade para cima"
                      disabled={index === 0 || orderFeatured.isPending}
                      onClick={() =>
                        orderFeatured.mutate(moveItem(featuredItems, index, -1))
                      }
                    >
                      <ChevronUp />
                    </button>
                    <button
                      type="button"
                      aria-label="Mover novidade para baixo"
                      disabled={
                        index === featuredItems.length - 1 ||
                        orderFeatured.isPending
                      }
                      onClick={() =>
                        orderFeatured.mutate(moveItem(featuredItems, index, 1))
                      }
                    >
                      <ChevronDown />
                    </button>
                    <button
                      type="button"
                      aria-label={
                        item.is_active ? 'Ocultar novidade' : 'Exibir novidade'
                      }
                      onClick={() =>
                        changeFeatured.mutate({
                          id: item.id,
                          updates: { is_active: !item.is_active },
                        })
                      }
                    >
                      {item.is_active ? <EyeOff /> : <Eye />}
                    </button>
                    <button
                      type="button"
                      aria-label="Remover de Novidades"
                      onClick={() => removeFeatured.mutate(item.id)}
                    >
                      <Trash2 />
                    </button>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="storefront-empty">
              Seleção automática ativa: os produtos mais recentes aparecem em
              Novidades.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
