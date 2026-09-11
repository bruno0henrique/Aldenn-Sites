import { Camera, MapPin } from "lucide-react";
import type { CSSProperties } from "react";
import { FrameSequenceBackground } from "@/components/taeko/frame-sequence-background";
import { EditorialFabricScene } from "@/components/taeko/editorial-fabric-scene";
import { MotionProvider } from "@/components/taeko/motion-provider";
import { VisitPlanner } from "@/components/taeko/visit-planner";
import { heroMedia } from "@/lib/hero-media";
import { contact } from "@/lib/taeko";

function Wordmark() {
  return (
    <span className="wordmark">
      taeko<span>NOIVAS</span>
    </span>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>

      <header className="site-header">
        <a href="#inicio" aria-label="Taeko Noivas, início">
          <Wordmark />
        </a>
        <nav aria-label="Navegação principal">
          <a href="#inspiracoes">Inspirações</a>
          <a href="#visite">Visite a loja</a>
        </nav>
        <a className="header-contact" href="#planejador">
          Entrar em contato
        </a>
      </header>

      <MotionProvider>
        <main id="conteudo">
          <section className="hero" id="inicio" aria-labelledby="hero-title">
            <FrameSequenceBackground config={heroMedia} />
            <div className="hero-shade" />
            <div className="hero-copy">
              <p className="eyebrow hero-reveal">
                VESTIDOS SOB MEDIDA · JACAREÍ
              </p>
              <h1 id="hero-title">
                <span className="hero-reveal">O seu sonho,</span>
                <span className="hero-reveal">
                  feito <em>sob medida.</em>
                </span>
              </h1>
              <p className="hero-description hero-reveal">
                Confecção sob medida para o seu momento.
              </p>
              <div className="hero-history hero-reveal">
                <p className="eyebrow">HÁ 40 ANOS</p>
                <p>
                  Em Jacareí, a Taeko transforma sonhos em vestidos feitos sob medida, com cuidado em cada etapa.
                </p>
              </div>
            </div>
          </section>

          <section className="inspiration" id="inspiracoes" aria-labelledby="inspiration-title">
            <div className="inspiration-intro section-pad">
              <div className="section-heading" data-reveal>
                <div>
                  <p className="eyebrow">CAIMENTO E MOVIMENTO</p>
                  <h2 id="inspiration-title">
                    Um vestido pensado
                    <br />
                    <em>para você.</em>
                  </h2>
                </div>
                <p className="heading-summary">
                  Renda, caimento e acabamento vistos de perto.
                </p>
              </div>
            </div>

            <EditorialFabricScene />
          </section>

          <section className="planner-section section-pad" id="planejador">
            <div className="planner-heading" data-reveal>
              <p className="eyebrow">ATENDIMENTO</p>
              <h2>
                Prepare sua
                <br />
                <em>mensagem.</em>
              </h2>
              <p>Conte o momento, o estilo e a etapa da sua escolha. O WhatsApp abre com o texto pronto para revisar.</p>
            </div>
            <VisitPlanner />
          </section>

          <section className="contact section-pad" id="visite" aria-labelledby="visit-title">
            <p className="eyebrow" data-reveal>VISITE A LOJA</p>
            <h2 id="visit-title" data-reveal>
              Encontre a Taeko <em>em Jacareí.</em>
            </h2>
            <p className="visit-intro" data-reveal>
              Veja como chegar e conheça os trabalhos recentes da loja.
            </p>
            <div className="contact-grid visit-grid">
              <article className="visit-map-card">
                <iframe
                  title="Mapa da Taeko Noivas em Jacareí"
                  src={contact.mapEmbed}
                  loading="eager"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="visit-address">
                  <MapPin size={22} strokeWidth={1.25} />
                  <div>
                    <p className="eyebrow">ENDEREÇO</p>
                    <p>
                      Av. Adhemar Pereira de Barros, 1737
                      <br /> Jacareí · SP · 12328-300
                    </p>
                  </div>
                </div>
              </article>
              <article className="visit-social-card">
                <Camera size={26} strokeWidth={1.25} />
                <p className="eyebrow">REDES SOCIAIS</p>
                <a className="social-handle" href={contact.instagram} target="_blank" rel="noreferrer">
                  @taekonoivas
                </a>
                <p>Veja modelos, detalhes e trabalhos recentes no perfil da loja.</p>
                <a
                  className="instagram-button"
                  href={contact.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Abrir Instagram da Taeko Noivas"
                >
                  <span className="instagram-button-outline" aria-hidden="true" />
                  <span className="instagram-button-state" aria-hidden="true">
                    <span className="instagram-button-icon">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
                        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
                        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
                        <circle cx="17.4" cy="6.7" r="1.1" fill="currentColor" />
                      </svg>
                    </span>
                    <span className="instagram-button-label">
                      {"Instagram".split("").map((letter, index) => (
                        <span key={`${letter}-${index}`} style={{ "--letter-index": index } as CSSProperties}>
                          {letter}
                        </span>
                      ))}
                    </span>
                  </span>
                </a>
              </article>
            </div>
          </section>
        </main>

        <footer>
          <a href="#inicio" aria-label="Voltar ao início">
            <Wordmark />
          </a>
          <span>Taeko Noivas · Jacareí</span>
        </footer>
      </MotionProvider>
    </>
  );
}
