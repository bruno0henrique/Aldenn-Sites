'use client';

import {
  Check,
  Eye,
  Image as ImageIcon,
  RotateCcw,
  Trash2,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Capture, CaptureMedia } from '@/lib/types';
import { digitsToCents, formatPrice } from '@/lib/format';

export function ReviewCard({
  initial,
  busy,
  onPublish,
  onIgnore,
}: {
  initial: Capture;
  busy: boolean;
  onPublish: (capture: Capture) => void;
  onIgnore: (id: number) => void;
}) {
  const prepared = useMemo(
    () => ({
      ...initial,
      capture_media: initial.capture_media
        .sort((a, b) => a.source_position - b.source_position)
        .map((media, index) => ({
          ...media,
          decision:
            media.decision === 'pending'
              ? index === 0
                ? 'primary'
                : 'secondary'
              : media.decision,
        })),
    }),
    [initial],
  );
  const [capture, setCapture] = useState<Capture>(prepared);
  const [history, setHistory] = useState<CaptureMedia[][]>([]);
  function decide(id: number, decision: CaptureMedia['decision']) {
    setHistory((items) => [...items, capture.capture_media]);
    setCapture((current) => ({
      ...current,
      capture_media: current.capture_media.map((media) =>
        media.id === id
          ? { ...media, decision }
          : decision === 'primary' && media.decision === 'primary'
            ? { ...media, decision: 'secondary' }
            : media,
      ),
    }));
  }
  function undo() {
    const previous = history.at(-1);
    if (!previous) return;
    setCapture((current) => ({ ...current, capture_media: previous }));
    setHistory((items) => items.slice(0, -1));
  }
  const visible = capture.capture_media.filter(
    (media) => media.decision !== 'discarded',
  );
  const primary = visible.find((media) => media.decision === 'primary');
  const ready = Boolean(
    primary &&
    capture.proposed_name?.trim() &&
    capture.price_cents &&
    capture.price_cents > 0,
  );
  return (
    <section className="review-workspace">
      <div className="review-stack">
        <div className="review-card primary-review">
          <div className="card-label">
            <span>
              <ImageIcon size={16} /> Foto principal
            </span>
            <small>Verde · será a capa</small>
          </div>
          {primary ? (
            <img src={primary.public_url} alt="Foto principal proposta" />
          ) : (
            <div className="media-empty">Escolha uma foto principal</div>
          )}
        </div>
        {capture.capture_media
          .filter((media) => media.id !== primary?.id)
          .map((media) => (
            <div
              className={`review-card secondary-review ${media.decision === 'discarded' ? 'discarded' : ''}`}
              key={media.id}
            >
              <div className="card-label">
                <span>
                  <ImageIcon size={16} /> Foto {media.source_position + 1}
                </span>
                <small>Amarelo · foto adicional</small>
              </div>
              <img
                src={media.public_url}
                alt={`Foto adicional ${media.source_position + 1}`}
              />
              <div className="photo-actions">
                <button
                  onClick={() => decide(media.id, 'discarded')}
                  aria-label="Descartar foto"
                >
                  <X /> Descartar
                </button>
                <button
                  onClick={() => decide(media.id, 'primary')}
                  aria-label="Usar como principal"
                >
                  <Check /> Principal
                </button>
              </div>
            </div>
          ))}
        {history.length > 0 && (
          <button className="undo-button" onClick={undo}>
            <RotateCcw size={15} /> Desfazer última decisão
          </button>
        )}
      </div>
      <div className="review-card data-review">
        <div className="card-label">
          <span>Dados da peça</span>
          <small>Azul · revise antes de publicar</small>
        </div>
        <div className="field">
          <label htmlFor="product-name">Nome</label>
          <input
            id="product-name"
            value={capture.proposed_name || ''}
            onChange={(e) =>
              setCapture({ ...capture, proposed_name: e.target.value })
            }
          />
        </div>
        <div className="field">
          <label htmlFor="product-category">Categoria</label>
          <input
            id="product-category"
            value={capture.proposed_category || ''}
            onChange={(e) =>
              setCapture({ ...capture, proposed_category: e.target.value })
            }
          />
        </div>
        <div className="field">
          <label htmlFor="product-description">Descrição</label>
          <textarea
            id="product-description"
            rows={4}
            value={capture.proposed_description || ''}
            onChange={(e) =>
              setCapture({ ...capture, proposed_description: e.target.value })
            }
          />
        </div>
        <div className="field">
          <label htmlFor="product-price">Preço</label>
          <input
            id="product-price"
            inputMode="numeric"
            value={formatPrice(capture.price_cents || 0)}
            onChange={(e) =>
              setCapture({
                ...capture,
                price_cents: digitsToCents(e.target.value),
              })
            }
          />
        </div>
        <div className="review-actions">
          <button
            className="button-pop button-outline"
            onClick={() => onIgnore(capture.id)}
            disabled={busy}
          >
            <Trash2 size={17} /> Ignorar
          </button>
          {ready && (
            <a
              className="button-pop preview-button"
              target="_blank"
              href={primary?.public_url}
            >
              <Eye size={17} /> Prévia
            </a>
          )}
          <button
            className="button-pop button-primary"
            onClick={() => onPublish(capture)}
            disabled={!ready || busy}
          >
            {busy ? 'Publicando…' : 'Publicar peça'}
          </button>
        </div>
      </div>
    </section>
  );
}
