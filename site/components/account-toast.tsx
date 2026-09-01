'use client';

import { Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export function AccountToast({ visible }: { visible: boolean }) {
  const [open, setOpen] = useState(visible);

  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(() => setOpen(false), 4500);
    window.history.replaceState({}, '', window.location.pathname);
    return () => window.clearTimeout(timer);
  }, [visible]);

  if (!open) return null;

  return (
    <output className="account-toast" aria-live="polite">
      <span>
        <Check size={17} /> Conta conectada com sucesso.
      </span>
      <button onClick={() => setOpen(false)} aria-label="Fechar aviso">
        <X size={17} />
      </button>
    </output>
  );
}
