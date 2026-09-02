'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  ImagePlus,
  Pencil,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import {
  createCatalogCategory,
  createHomeBanner,
  deleteHomeBanner,
  listCatalogCategoriesAdmin,
  listHomeBannersAdmin,
  listPublishedProductsAdmin,
  reorderCatalogCategories,
  reorderHomeBanners,
  updateCatalogCategory,
  updateHomeBanner,
  type HomeBannerRow,
} from '@/lib/admin';
import type { CatalogCategory } from '@/lib/types';

function moveItem<T>(items: T[], index: number, direction: -1 | 1) {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= items.length) return items;
  const next = [...items];
  [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
  return next;
}

export function StorefrontManager({ previewMode }: { previewMode: boolean }) {
  const queryClient = useQueryClient();
  const [categoryName, setCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [productId, setProductId] = useState(0);
  const [mediaPosition, setMediaPosition] = useState(0);

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

  const categories = categoriesQuery.data || [];
  const banners = bannersQuery.data || [];
  const products = productsQuery.data || [];
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
    removeBanner.error;

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
    productsQuery.isLoading
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
            <span>Organização do catálogo</span>
            <h2 id="categories-title">Categorias</h2>
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
            <span>Destaques da página inicial</span>
            <h2 id="banners-title">Banners de produtos</h2>
          </div>
        </header>
        <div className="banner-builder">
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
          {selectedProduct && (
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
          <button
            type="button"
            className="button-pop button-primary"
            disabled={!selectedProduct || addBanner.isPending}
            onClick={() => addBanner.mutate({ productId, mediaPosition })}
          >
            <ImagePlus size={17} /> Adicionar banner
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
                images[banner.media_position] || product?.primary_image_url;
              return (
                <article key={banner.id}>
                  {image && <img src={image} alt="" />}
                  <div>
                    <small>{banner.is_active ? 'Ativo' : 'Oculto'}</small>
                    <strong>{product?.name || 'Produto indisponível'}</strong>
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
                          removeBanner.mutate(banner.id);
                      }}
                    >
                      <Trash2 />
                    </button>
                  </div>
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
    </div>
  );
}
