'use client';

import { ImagePlus, Plus, Sparkles, X } from 'lucide-react';
import { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { analyzeProductImage, createManualCapture } from '@/lib/admin';
import { CatalogCategorySelect } from '@/components/catalog-category-select';
import { digitsToCents, formatPrice } from '@/lib/format';

const MAX_PRODUCT_IMAGES = 6;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

export function ManualProductForm({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [priceCents, setPriceCents] = useState(0);
  const [salePriceCents, setSalePriceCents] = useState(0);
  const [images, setImages] = useState<File[]>([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [analysisMessage, setAnalysisMessage] = useState('');
  const imagePreviews = useMemo(
    () => images.map((image) => URL.createObjectURL(image)),
    [images],
  );
  const primaryImage = images[primaryImageIndex] || null;

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  function addImages(selectedFiles: FileList | null) {
    const selected = Array.from(selectedFiles || []);
    if (!selected.length) return;
    if (selected.some((image) => !ALLOWED_IMAGE_TYPES.has(image.type))) {
      setError('Selecione somente imagens JPG, PNG ou WEBP.');
      return;
    }
    if (selected.some((image) => image.size > MAX_IMAGE_SIZE)) {
      setError('Cada imagem deve ter no máximo 10 MB.');
      return;
    }
    const known = new Set(
      images.map(
        (image) => `${image.name}:${image.size}:${image.lastModified}`,
      ),
    );
    const additions = selected.filter(
      (image) => !known.has(`${image.name}:${image.size}:${image.lastModified}`),
    );
    if (images.length + additions.length > MAX_PRODUCT_IMAGES) {
      setError('Você pode adicionar até 6 fotos por produto.');
      return;
    }
    setImages((current) => [...current, ...additions]);
    setError('');
    setAnalysisMessage('');
  }

  function removeImage(index: number) {
    setImages((current) => current.filter((_, itemIndex) => itemIndex !== index));
    setPrimaryImageIndex((current) => {
      if (index === current) return 0;
      return index < current ? current - 1 : current;
    });
    setAnalysisMessage('');
  }

  async function analyze() {
    if (!primaryImage) return;
    setAnalyzing(true);
    setError('');
    setAnalysisMessage('');
    try {
      const result = await analyzeProductImage(primaryImage);
      if (result.name) setName(result.name);
      if (result.category) setCategory(result.category);
      if (result.price_cents > 0) setPriceCents(result.price_cents);

      const details = [
        result.description,
        result.color ? `Cor: ${result.color}.` : '',
        result.size ? `Tamanho: ${result.size}.` : '',
      ].filter(Boolean);
      if (details.length) setDescription(details.join(' '));

      const confidence = Math.round(result.confidence * 100);
      const warning = result.warnings[0];
      setAnalysisMessage(
        warning
          ? `Sugestões preenchidas (${confidence}% de confiança). Confira: ${warning}`
          : `Sugestões preenchidas (${confidence}% de confiança). Revise antes de enviar.`,
      );
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Não foi possível analisar a imagem.',
      );
    } finally {
      setAnalyzing(false);
    }
  }

  async function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!images.length) return;
    setBusy(true);
    setError('');
    try {
      await createManualCapture({
        name,
        category,
        description,
        priceCents,
        salePriceCents,
        images,
        primaryImageIndex,
      });
      setName('');
      setCategory('');
      setDescription('');
      setPriceCents(0);
      setSalePriceCents(0);
      setImages([]);
      setPrimaryImageIndex(0);
      setAnalysisMessage('');
      setOpen(false);
      onCreated();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Não foi possível criar a peça.',
      );
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button className="manual-trigger" onClick={() => setOpen(true)}>
        <Plus size={17} /> Cadastrar por imagem
      </button>
    );
  }

  return (
    <form className="manual-product-form" onSubmit={submit}>
      <header>
        <div>
          <span>Cadastro assistido</span>
          <h2>Nova peça por imagem</h2>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Fechar"
        >
          <X />
        </button>
      </header>
      <p>
        Envie a arte da publicação e o programa vai sugerir os dados. A imagem
        só é analisada quando você pedir e tudo continua editável antes de
        publicar.
      </p>
      {error && <div className="form-error">{error}</div>}
      <div className="manual-grid">
        <div className="field manual-field-card">
          <span className="manual-field-number">01</span>
          <label htmlFor="manual-name">Nome</label>
          <input
            id="manual-name"
            required
            maxLength={120}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="field manual-field-card">
          <span className="manual-field-number">02</span>
          <label htmlFor="manual-category">Categoria</label>
          <CatalogCategorySelect
            id="manual-category"
            value={category}
            onChange={setCategory}
          />
        </div>
        <div className="field manual-field-card">
          <span className="manual-field-number">03</span>
          <label htmlFor="manual-price">Preço</label>
          <input
            id="manual-price"
            required
            inputMode="numeric"
            value={formatPrice(priceCents)}
            onChange={(event) =>
              setPriceCents(digitsToCents(event.target.value))
            }
          />
        </div>
        <div className="field manual-field-card">
          <span className="manual-field-number">04</span>
          <label htmlFor="manual-sale-price">Preço promocional</label>
          <input
            id="manual-sale-price"
            inputMode="numeric"
            value={formatPrice(salePriceCents)}
            onChange={(event) =>
              setSalePriceCents(digitsToCents(event.target.value))
            }
            aria-describedby="manual-sale-help"
          />
          <small id="manual-sale-help">
            Opcional e sempre menor que o preço normal.
          </small>
        </div>
        <div className="field manual-field-card manual-image-card">
          <span className="manual-field-number">05</span>
          <span className="manual-field-label">
            <ImagePlus size={16} /> Fotos do produto
          </span>
          <label className="manual-upload-zone" htmlFor="manual-image">
            <span>
              {images.length ? <Plus size={24} /> : <ImagePlus size={24} />}
              <strong>{images.length ? 'Adicionar fotos' : 'Escolher fotos'}</strong>
              <small>
                {images.length}/{MAX_PRODUCT_IMAGES} selecionadas
              </small>
            </span>
            <input
              id="manual-image"
              className="manual-file-input"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => {
                addImages(event.target.files);
                event.target.value = '';
              }}
            />
          </label>
          {images.length > 0 && (
            <div className="manual-photo-grid" aria-label="Fotos selecionadas">
              {imagePreviews.map((preview, index) => (
                <article
                  className={index === primaryImageIndex ? 'is-primary' : ''}
                  key={`${images[index].name}:${images[index].lastModified}`}
                >
                  <button
                    type="button"
                    className="manual-photo-select"
                    onClick={() => {
                      setPrimaryImageIndex(index);
                      setAnalysisMessage('');
                    }}
                    aria-pressed={index === primaryImageIndex}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt={`Foto ${index + 1} do produto`} />
                    <span>
                      {index === primaryImageIndex
                        ? 'Principal'
                        : 'Usar como principal'}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="manual-photo-remove"
                    onClick={() => removeImage(index)}
                    aria-label={`Remover foto ${index + 1}`}
                  >
                    <X size={14} />
                  </button>
                </article>
              ))}
            </div>
          )}
          <small>
            Escolha até 6 fotos. A principal será analisada e usada como capa.
          </small>
          <button
            type="button"
            className="button-pop ai-fill-button"
            onClick={analyze}
            disabled={!primaryImage || analyzing || busy}
          >
            <Sparkles size={16} />
            {analyzing ? 'Analisando imagem...' : 'Preencher dados'}
          </button>
          {analysisMessage && (
            <output className="analysis-message">{analysisMessage}</output>
          )}
        </div>
        <div className="field manual-field-card manual-description-card">
          <span className="manual-field-number">06</span>
          <label htmlFor="manual-description">Descrição</label>
          <textarea
            id="manual-description"
            rows={6}
            maxLength={800}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <small>Revise as informações antes de enviar para aprovação.</small>
        </div>
      </div>
      <button
        className="button-pop button-primary full"
        disabled={
          busy ||
          analyzing ||
          !images.length ||
          !name.trim() ||
          priceCents <= 0 ||
          salePriceCents >= priceCents
        }
      >
        {busy ? 'Criando…' : 'Enviar para aprovação'}
      </button>
    </form>
  );
}
