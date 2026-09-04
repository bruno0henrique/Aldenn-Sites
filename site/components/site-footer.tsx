import { ArrowRight, Camera, CircleHelp, Info, UserRound } from 'lucide-react';
import { AccountFooterLink } from '@/components/account-footer-link';
import { whatsappUrl } from '@/lib/whatsapp';

export function SiteFooter() {
  return (
    <footer className="site-footer" id="fale-com-a-gente">
      <div className="footer-shell">
        <div className="footer-top">
          <div className="footer-brand">
            <img src="/brand/belleland-logo.svg" alt="Belleland Closet" />
            <p>Moda feminina com personalidade.</p>
          </div>
          <nav className="footer-navigation" aria-label="Rodapé">
            <section aria-labelledby="footer-about-title">
              <Info aria-hidden="true" />
              <h2 id="footer-about-title">Sobre</h2>
              <a href="/sobre">
                Conheça a Belleland <ArrowRight aria-hidden="true" />
              </a>
            </section>
            <section aria-labelledby="footer-contact-title">
              <Camera aria-hidden="true" />
              <h2 id="footer-contact-title">Contato</h2>
              <a
                href="https://instagram.com/bellelandcloset"
                target="_blank"
                rel="noreferrer"
              >
                Instagram <ArrowRight aria-hidden="true" />
              </a>
              <a href={whatsappUrl()} target="_blank" rel="noreferrer">
                WhatsApp <ArrowRight aria-hidden="true" />
              </a>
            </section>
            <section aria-labelledby="footer-help-title">
              <CircleHelp aria-hidden="true" />
              <h2 id="footer-help-title">Ajuda</h2>
              <a href={whatsappUrl()} target="_blank" rel="noreferrer">
                Atendimento <ArrowRight aria-hidden="true" />
              </a>
              <span className="footer-account-link">
                <AccountFooterLink />
                <UserRound aria-hidden="true" />
              </span>
            </section>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Belleland Closet</span>
          <span>Feita para você.</span>
        </div>
      </div>
    </footer>
  );
}
