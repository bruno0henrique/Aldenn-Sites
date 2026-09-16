import { ArrowRight, Camera, MapPin, MessageCircle, Route, Scissors, Sparkles } from "lucide-react";
import Image from "next/image";
import type { CSSProperties } from "react";
import { FrameSequenceBackground } from "@/components/taeko/frame-sequence-background";
import { EditorialFabricScene } from "@/components/taeko/editorial-fabric-scene";
import { MotionProvider } from "@/components/taeko/motion-provider";
import { OccasionShowcase } from "@/components/taeko/occasion-showcase";
import { SiteHeader, Wordmark } from "@/components/taeko/site-header";
import { VisitPlanner } from "@/components/taeko/visit-planner";
import { heroMedia } from "@/lib/hero-media";
import { contact } from "@/lib/taeko";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>

      <SiteHeader />

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
                Vestidos sob medida para noivas, debutantes e madrinhas em Jacareí, criados com cuidado para que você se reconheça em cada detalhe.
              </p>
              <div className="hero-actions hero-reveal" aria-label="Próximos passos">
                <a className="button hero-primary-action" href="#planejador">
                  Encontrar meu vestido
                  <ArrowRight size={17} strokeWidth={1.5} aria-hidden="true" />
                </a>
                <a className="hero-secondary-action" href={contact.whatsapp} target="_blank" rel="noreferrer">
                  <MessageCircle size={18} strokeWidth={1.4} aria-hidden="true" />
                  Falar no WhatsApp
                </a>
              </div>
              <div className="hero-history hero-reveal">
                <p className="eyebrow">HÁ 40 ANOS</p>
                <p>
                  Há 40 anos, a Taeko acolhe mulheres de Jacareí e região para transformar ideias, referências e sonhos em vestidos feitos sob medida.
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
                    <em>com você.</em>
                  </h2>
                </div>
                <p className="heading-summary">
                  É de perto que a renda, o caimento e os acabamentos revelam o cuidado presente em cada vestido.
                </p>
              </div>
            </div>

            <EditorialFabricScene />
          </section>

          <OccasionShowcase />

          <section className="planner-section section-pad" id="planejador">
            <div className="planner-heading" data-reveal>
              <p className="eyebrow">VAMOS CONVERSAR</p>
              <h2>
                Conte um pouco sobre
                <br />
                <em>o seu momento.</em>
              </h2>
              <p>Escolha o que mais combina com você. Ao final, sua mensagem estará pronta para abrir no WhatsApp.</p>
            </div>
            <VisitPlanner />
          </section>

          <section className="process section-pad" id="processo" aria-labelledby="process-title">
            <div className="process-visual" data-reveal>
              <Image
                src="/demonstracao-taeko/media/editorial-portrait.webp"
                alt="Detalhes de um vestido de noiva durante a criação"
                width={1024}
                height={1536}
                sizes="(max-width: 1100px) 88vw, 40vw"
              />
              <div className="process-visual-caption">
                <span>FEITO EM JACAREÍ</span>
                <p>Da primeira conversa ao último ajuste.</p>
              </div>
            </div>
            <div className="process-copy">
              <p className="eyebrow" data-reveal>UM VESTIDO, MUITOS CUIDADOS</p>
              <h2 id="process-title" data-reveal>
                Cuidado que acompanha
                <br />
                <em>cada etapa.</em>
              </h2>
              <div className="process-list">
                <article data-reveal>
                  <MessageCircle size={23} strokeWidth={1.25} />
                  <div>
                    <h3>A primeira conversa</h3>
                    <p>Antes de começar, ouvimos você: o seu momento, as suas referências e como gostaria de se sentir ao vestir a peça.</p>
                  </div>
                </article>
                <article data-reveal>
                  <Scissors size={23} strokeWidth={1.25} />
                  <div>
                    <h3>Provas e ajustes</h3>
                    <p>A cada prova, ajustamos o caimento com calma, sempre atentas ao conforto e à liberdade de movimento.</p>
                  </div>
                </article>
                <article data-reveal>
                  <Sparkles size={23} strokeWidth={1.25} />
                  <div>
                    <h3>O momento da entrega</h3>
                    <p>Antes da entrega, revemos cada detalhe para que você vista a peça com segurança e tranquilidade.</p>
                  </div>
                </article>
              </div>
              <a className="text-link process-cta" href="#planejador">
                Quero conversar sobre meu vestido
                <ArrowRight size={17} strokeWidth={1.4} aria-hidden="true" />
              </a>
            </div>
          </section>

          <section className="contact section-pad" id="visite" aria-labelledby="visit-title">
            <p className="eyebrow" data-reveal>VENHA NOS CONHECER</p>
            <h2 id="visit-title" data-reveal>
              Será um prazer receber você <em>em Jacareí.</em>
            </h2>
            <p className="visit-intro" data-reveal>
              Veja o endereço, planeje o caminho e acompanhe as novidades da Taeko pelo Instagram.
            </p>
            <div className="visit-composition">
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
                    <a className="visit-route-link" href={contact.map} target="_blank" rel="noreferrer">
                      <Route size={16} strokeWidth={1.4} aria-hidden="true" />
                      Traçar rota no Google Maps
                    </a>
                  </div>
                </div>
              </article>
              <article className="visit-social-card">
                <Camera size={26} strokeWidth={1.25} />
                <p className="eyebrow">REDES SOCIAIS</p>
                <a className="social-handle" href={contact.instagram} target="_blank" rel="noreferrer">
                  @taekonoivas
                </a>
                <p>No Instagram, você encontra vestidos, detalhes de acabamento e trabalhos recentes da Taeko.</p>
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
