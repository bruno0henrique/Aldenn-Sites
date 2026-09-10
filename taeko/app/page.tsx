import { Camera, MapPin, MessageCircle } from "lucide-react";
import { FrameSequenceBackground } from "@/components/taeko/frame-sequence-background";
import { MotionProvider } from "@/components/taeko/motion-provider";
import { ScrollFrameSequence } from "@/components/taeko/scroll-frame-sequence";
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
          <a href="#planejador">Atendimento</a>
          <a href="#contato">Contato</a>
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
                  Role para acompanhar como cada detalhe ganha forma.
                </p>
              </div>
            </div>

            <ScrollFrameSequence />
          </section>

          <section className="planner-section section-pad" id="planejador">
            <div className="planner-heading" data-reveal>
              <p className="eyebrow">ATENDIMENTO</p>
              <h2>
                Prepare sua
                <br />
                <em>mensagem.</em>
              </h2>
              <p>Duas escolhas e o WhatsApp abre com o texto pronto para revisar.</p>
            </div>
            <VisitPlanner />
          </section>

          <section className="contact section-pad" id="contato" aria-labelledby="contact-title">
            <p className="eyebrow" data-reveal>CONTATO</p>
            <h2 id="contact-title" data-reveal>
              Fale com a <em>Taeko.</em>
            </h2>
            <div className="contact-grid compact-contact">
              <article>
                <MessageCircle size={24} strokeWidth={1.25} />
                <p className="eyebrow">WHATSAPP</p>
                <a href={contact.whatsapp} target="_blank" rel="noreferrer">
                  (12) 99755-0893
                </a>
              </article>
              <article>
                <MapPin size={24} strokeWidth={1.25} />
                <p className="eyebrow">ENDEREÇO</p>
                <p>
                  Av. Adhemar Pereira de Barros, 1737
                  <br /> Jacareí · SP · 12328-300
                </p>
                <a className="text-link" href={contact.map} target="_blank" rel="noreferrer">
                  Abrir no mapa
                </a>
              </article>
              <article>
                <Camera size={24} strokeWidth={1.25} />
                <p className="eyebrow">INSTAGRAM</p>
                <a href={contact.instagram} target="_blank" rel="noreferrer">
                  @taekonoivas
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
