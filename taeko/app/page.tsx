import { Camera, MapPin, MessageCircle } from "lucide-react";
import Image from "next/image";
import { FrameSequenceBackground } from "@/components/taeko/frame-sequence-background";
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
                <span className="small-line" /> TAEKO NOIVAS · JACAREÍ
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

          <section className="inspiration section-pad" id="inspiracoes" aria-labelledby="inspiration-title">
            <div className="section-heading" data-reveal>
              <div>
                <p className="eyebrow">INSPIRAÇÕES</p>
                <h2 id="inspiration-title">
                  Qual estilo combina
                  <br />
                  <em>com você?</em>
                </h2>
              </div>
              <p className="heading-summary">
                Escolha uma referência para iniciar a conversa com a Taeko.
              </p>
            </div>

            <div className="inspiration-grid">
              <article className="inspiration-card" data-reveal>
                <div className="inspiration-photo">
                  <Image
                    src="/demonstracao-taeko/media/editorial-portrait.webp"
                    alt="Inspiração ilustrativa com renda delicada no vestido de noiva"
                    width="1024"
                    height="1536"
                    loading="lazy"
                  />
                </div>
                <div className="inspiration-content">
                  <div>
                    <p className="eyebrow">RENDA E DELICADEZA</p>
                    <h3>Detalhes leves e românticos</h3>
                    <p className="card-description">
                      Renda delicada, transparências sutis e acabamento romântico.
                    </p>
                  </div>
                </div>
              </article>

              <article className="inspiration-card" data-reveal>
                <div className="inspiration-photo inspiration-photo-wide">
                  <Image
                    src="/demonstracao-taeko/media/hero-editorial.webp"
                    alt="Inspiração ilustrativa com vestido de noiva clássico e fluido"
                    width="1536"
                    height="1024"
                    loading="lazy"
                  />
                </div>
                <div className="inspiration-content">
                  <div>
                    <p className="eyebrow">CLÁSSICO E ROMÂNTICO</p>
                    <h3>Clássico, leve e atemporal</h3>
                    <p className="card-description">
                      Linhas elegantes e uma saia fluida que acompanha o movimento.
                    </p>
                  </div>
                </div>
              </article>
            </div>

            <p className="image-note">
              Imagens ilustrativas. Veja trabalhos reais no Instagram da Taeko.
            </p>
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
