'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Camera,
  ChevronDown,
  ClipboardCheck,
  Home,
  LayoutDashboard,
  LogIn,
  Menu,
  MessageCircle,
  Shirt,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { useState } from 'react';
import { getAccountSnapshot, isStaff } from '@/lib/account';
import { getCatalogCategories } from '@/lib/catalog';
import { whatsappUrl } from '@/lib/whatsapp';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from '@/components/ui/sheet';

export function BrandHeader() {
  const [open, setOpen] = useState(false);
  const { data: account } = useQuery({
    queryKey: ['current-account'],
    queryFn: getAccountSnapshot,
  });
  const { data: categories = [] } = useQuery({
    queryKey: ['catalog-categories'],
    queryFn: getCatalogCategories,
  });
  const close = () => setOpen(false);

  return (
    <header className="brand-header">
      <Sheet open={open} onOpenChange={setOpen}>
        <button
          className="icon-button"
          onClick={() => setOpen(true)}
          aria-label="Abrir menu"
          aria-expanded={open}
        >
          <Menu />
        </button>
        <SheetContent
          side="left"
          className="brand-drawer"
          aria-label="Menu principal"
        >
          <div className="drawer-brand">
            <img src="/brand/belleland-logo.svg" alt="Belleland Closet" />
            <SheetTitle>Menu Belleland</SheetTitle>
            <SheetDescription>
              Navegue pelo catálogo e fale com a gente.
            </SheetDescription>
          </div>
          <nav className="drawer-navigation">
            <a href="/" onClick={close}>
              <Home /> Início
            </a>
            <a href="/#colecao" onClick={close}>
              <Sparkles /> First Drop
            </a>
            <Collapsible>
              <CollapsibleTrigger className="drawer-products-trigger">
                <span>
                  <Shirt /> Produtos
                </span>
                <ChevronDown />
              </CollapsibleTrigger>
              <CollapsibleContent className="drawer-products-list">
                <a href="/?categoria=todos#colecao" onClick={close}>
                  Ver todos
                </a>
                <a href="/#novidades" onClick={close}>
                  Novidades
                </a>
                {categories.map((category) => (
                  <a
                    href={`/?categoria=${category.slug}#colecao`}
                    onClick={close}
                    key={category.id}
                  >
                    {category.name}
                  </a>
                ))}
              </CollapsibleContent>
            </Collapsible>
            <div className="drawer-divider" />
            {account?.user ? (
              <a href="/conta" onClick={close}>
                <UserRound /> Minha conta
              </a>
            ) : (
              <a href="/admin/login" onClick={close}>
                <LogIn /> Entrar ou criar conta
              </a>
            )}
            {isStaff(account?.role || null) && (
              <>
                <a href="/admin" onClick={close}>
                  <ClipboardCheck /> Aprovações
                </a>
                <a href="/admin?secao=vitrine" onClick={close}>
                  <LayoutDashboard /> Vitrine
                </a>
              </>
            )}
          </nav>
          <div className="drawer-contact">
            <a
              href="https://instagram.com/bellelandcloset"
              target="_blank"
              rel="noreferrer"
              onClick={close}
            >
              <Camera /> Instagram
            </a>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noreferrer"
              onClick={close}
            >
              <MessageCircle /> WhatsApp
            </a>
          </div>
        </SheetContent>
      </Sheet>
      <a href="/" aria-label="Belleland Closet, início">
        <img src="/brand/belleland-logo.svg" alt="Belleland Closet" />
      </a>
      <a
        className="icon-button"
        href={whatsappUrl()}
        target="_blank"
        rel="noreferrer"
        aria-label="Falar pelo WhatsApp"
      >
        <MessageCircle />
      </a>
    </header>
  );
}
