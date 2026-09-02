'use client';

import { ImagePlus, Plus, X } from 'lucide-react';
import { SyntheticEvent, useState } from 'react';
import { createManualCapture } from '@/lib/admin';
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
  const [error, setError] = useState('');

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
      setOpen(false);
      onCreated();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Não foi possível criar a peça.',
      );
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button className="manual-trigger" onClick={() => setOpen(true)}>
        <Plus size={17} /> Nova peça manual
      </button>
    );
  }

  return (
    <form className="manual-product-form" onSubmit={submit}>
      <header>
        <div>
          <span>Cadastro livre</span>
          <h2>Nova peça manual</h2>
        </div>
        <button type="button" onClick={() => setOpen(false)} aria-label="Fechar">
          <X />
        </button>
      </header>
      <p>
        Crie uma peça sem depender da captura do Instagram. Depois você ainda
        poderá revisar tudo antes de publicar.
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
            onChange={(event) => setPriceCents(digitsToCents(event.target.value))}
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
            onChange={(event) => setImage(event.target.files?.[0] || null)}
          />
        </div>
      </div>
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
