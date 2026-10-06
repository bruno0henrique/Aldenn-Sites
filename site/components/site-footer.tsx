import { ArrowRight, CircleHelp, Info, UserRound } from 'lucide-react';
import { AccountFooterLink } from '@/components/account-footer-link';

export function SiteFooter() {
  return (
    <footer className="site-footer" id="fale-com-a-gente">
      <div className="footer-shell">
        <div className="footer-top">
          <div className="footer-brand">
            <img src="/brand/veloura-logo.svg" alt="Veloura Closet" />
            <p>Moda feminina com personalidade.</p>
          </div>
          <nav className="footer-navigation" aria-label="Rodapé">
            <section aria-labelledby="footer-about-title">
              <Info aria-hidden="true" />
              <h2 id="footer-about-title">Sobre</h2>
              <a href="/sobre">
                Conheça a Veloura <ArrowRight aria-hidden="true" />
              </a>
            </section>
            <section aria-labelledby="footer-contact-title">
              <Info aria-hidden="true" />
              <h2 id="footer-contact-title">Contato</h2>
              <p className="footer-note">Canais em definição</p>
            </section>
            <section aria-labelledby="footer-help-title">
              <CircleHelp aria-hidden="true" />
              <h2 id="footer-help-title">Ajuda</h2>
              <a href="/sobre">Conheça a proposta <ArrowRight aria-hidden="true" /></a>
              <span className="footer-account-link">
                <AccountFooterLink />
                <UserRound aria-hidden="true" />
              </span>
            </section>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Veloura Closet</span>
          <span>Feita para você.</span>
        </div>
      </div>
    </footer>
  );
}
