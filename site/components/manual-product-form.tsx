'use client';

import { ImagePlus, Plus, Sparkles, X } from 'lucide-react';
import { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { analyzeProductImage, createManualCapture } from '@/lib/admin';
import { digitsToCents, formatPrice } from '@/lib/format';

export function ManualProductForm({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [priceCents, setPriceCents] = useState(0);
  const [salePriceCents, setSalePriceCents] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [analysisMessage, setAnalysisMessage] = useState('');
  const imagePreview = useMemo(
    () => (image ? URL.createObjectURL(image) : ''),
    [image],
  );

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  async function analyze() {
    if (!image) return;
    setAnalyzing(true);
    setError('');
    setAnalysisMessage('');
    try {
      const result = await analyzeProductImage(image);
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
    if (!image) return;
    setBusy(true);
    setError('');
    try {
      await createManualCapture({
        name,
        category,
        description,
        priceCents,
        salePriceCents,
        image,
      });
      setName('');
      setCategory('');
      setDescription('');
      setPriceCents(0);
      setSalePriceCents(0);
      setImage(null);
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
        Envie a arte da publicação e o programa vai sugerir os dados. A imagem só
        é analisada quando você pedir e tudo continua editável antes de publicar.
      </p>
      {error && <div className="form-error">{error}</div>}
      <div className="manual-grid">
        <div className="field">
          <label htmlFor="manual-name">Nome</label>
          <input
            id="manual-name"
            required
            maxLength={120}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="manual-category">Categoria</label>
          <input
            id="manual-category"
            maxLength={80}
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          />
        </div>
        <div className="field">
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
        <div className="field">
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
        <div className="field manual-image-field">
          <label htmlFor="manual-image">
            <ImagePlus size={16} /> Foto principal
          </label>
          <input
            id="manual-image"
            type="file"
            required
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => {
              setImage(event.target.files?.[0] || null);
              setAnalysisMessage('');
            }}
          />
          <small>
            Prefira a arte original ou recorte o print. Esta será a foto do
            produto no catálogo.
          </small>
        </div>
      </div>
      {imagePreview && (
        <div className="manual-analysis">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imagePreview} alt="Prévia da imagem escolhida" />
          <div>
            <strong>Preencher dados</strong>
            <p>
              A imagem será enviada ao programa somente para sugerir os campos
              deste cadastro.
            </p>
          </div>
          <button
            type="button"
            className="button-pop ai-fill-button"
            onClick={analyze}
            disabled={analyzing || busy}
          >
            <Sparkles size={16} />
            {analyzing ? 'Analisando imagem...' : 'Preencher dados'}
          </button>
        </div>
      )}
      {analysisMessage && (
        <output className="analysis-message">{analysisMessage}</output>
      )}
      <div className="field">
        <label htmlFor="manual-description">Descrição</label>
        <textarea
          id="manual-description"
          rows={3}
          maxLength={800}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>
      <button
        className="button-pop button-primary full"
        disabled={
          busy ||
          analyzing ||
          !image ||
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
