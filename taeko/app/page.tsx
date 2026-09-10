import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Camera,
  Heart,
  MapPin,
  MessageCircle,
  Palette,
  Phone,
  Scissors,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { FrameSequenceBackground } from "@/components/taeko/frame-sequence-background";
import { MotionProvider } from "@/components/taeko/motion-provider";
import { PreferenceLink } from "@/components/taeko/preference-link";
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
          <a href="#atendimento">Como funciona</a>
          <a href="#planejador">Comece aqui</a>
          <a href="#contato">Contato</a>
        </nav>
        <a
          className="header-contact"
          href={contact.whatsapp}
          target="_blank"
          rel="noreferrer"
        >
          Falar com a Taeko <ArrowUpRight size={17} />
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
                  feito <em>sob</em>
                </span>
                <span className="hero-reveal">
                  <em>medida.</em>
                </span>
              </h1>
              <p className="hero-description hero-reveal">
                Há 40 anos transformando sonhos em realidade.
                <br /> Conte sua ideia e dê o primeiro passo para o seu vestido.
              </p>
              <div className="hero-actions hero-reveal">
                <a className="button" href="#planejador">
                  Começar meu atendimento <ArrowDown size={18} />
                </a>
                <a
                  className="text-link"
                  href={contact.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ir direto ao WhatsApp <ArrowUpRight size={17} />
                </a>
              </div>
            </div>
            <div className="hero-bottom">
              <a href="#inspiracoes">
                <ArrowDown size={16} /> EXPLORE AS POSSIBILIDADES
              </a>
              <span>CONFECÇÃO SOB MEDIDA</span>
            </div>
          </section>

          <div className="signature-strip" aria-label="Diferenciais">
            <span>Uma história de amor.</span>
            <Sparkles size={18} strokeWidth={1} />
            <span>Um vestido só seu.</span>
            <Sparkles size={18} strokeWidth={1} />
            <span>Um momento para sempre.</span>
          </div>

          <section
            className="inspiration section-pad"
            id="inspiracoes"
            aria-labelledby="inspiration-title"
          >
            <div className="section-heading" data-reveal>
              <div>
                <p className="eyebrow">REFERÊNCIAS PARA O SEU GRANDE DIA</p>
                <h2 id="inspiration-title">
                  Descubra o que faz
                  <br />
                  <em>seus olhos brilharem.</em>
                </h2>
              </div>
              <div className="heading-aside">
                <p>
                  Observe tecidos, caimentos e detalhes. Escolha a inspiração
                  que mais combina com você e leve essa preferência para a conversa.
                </p>
                <a
                  className="text-link"
                  href={contact.instagram}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ver noivas reais no Instagram <ArrowUpRight size={17} />
                </a>
              </div>
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
                    <h3>Detalhes que contam uma história</h3>
                    <p>
                      Texturas, transparências e aplicações criam profundidade
                      sem pesar o visual.
                    </p>
                  </div>
                  <PreferenceLink preference="Renda delicada">
                    Quero explorar esta direção <ArrowRight size={18} />
                  </PreferenceLink>
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
                    <h3>Presença com leveza</h3>
                    <p>
                      Volume equilibrado, movimento suave e uma silhueta que
                      valoriza o momento.
                    </p>
                  </div>
                  <PreferenceLink preference="Clássico e romântico">
                    Quero explorar esta direção <ArrowRight size={18} />
                  </PreferenceLink>
                </div>
              </article>
            </div>

            <p className="image-note">
              Imagens editoriais ilustrativas. Os modelos disponíveis e as criações
              reais da Taeko podem ser consultados diretamente com a loja.
            </p>
          </section>

          <section className="service" id="atendimento" aria-labelledby="service-title">
            <div className="service-intro" data-reveal>
              <p className="eyebrow">ATENDIMENTO COM INTENÇÃO</p>
              <h2 id="service-title">
                Seu vestido começa
                <br />
                <em>com uma boa conversa.</em>
              </h2>
              <p>
                Você não precisa chegar com tudo decidido. Referências, dúvidas
                e o que deseja sentir no grande dia já são um ótimo começo.
              </p>
            </div>
            <div className="service-path">
              <article data-reveal>
                <MessageCircle strokeWidth={1.35} />
                <h3>Conte o seu momento</h3>
                <p>
                  Compartilhe a ocasião, suas referências e o que você já imagina
                  para o vestido.
                </p>
              </article>
              <article data-reveal>
                <Palette strokeWidth={1.35} />
                <h3>Encontre sua direção</h3>
                <p>
                  Tecidos, silhuetas e detalhes ajudam a transformar sensações
                  em uma referência visual clara.
                </p>
              </article>
              <article data-reveal>
                <Scissors strokeWidth={1.35} />
                <h3>Converse sobre o sob medida</h3>
                <p>
                  A Taeko apresenta as possibilidades da confecção de acordo com
                  a sua ideia e o seu momento.
                </p>
              </article>
            </div>
          </section>

          <section className="about" id="taeko" aria-labelledby="about-title">
            <div className="about-visual">
              <Image
                src="/demonstracao-taeko/media/editorial-portrait.webp"
                alt="Detalhes de um vestido em fotografia editorial ilustrativa"
                width="1024"
                height="1536"
                loading="lazy"
              />
              <span className="image-label">O CUIDADO MORA NOS DETALHES</span>
            </div>
            <div className="about-copy" data-reveal>
              <p className="eyebrow">A ESSÊNCIA TAEKO</p>
              <h2 id="about-title">
                Experiência para ouvir.
                <br />
                <em>Cuidado para criar.</em>
              </h2>
              <div className="history-note">
                <Heart strokeWidth={1.2} />
                <p>
                  Quatro décadas transformando sonhos em realidade, conforme a
                  história apresentada pela Taeko.
                </p>
              </div>
              <p>
                Em Jacareí, a Taeko Noivas une sua trajetória à confecção sob medida
                para fazer parte de momentos especiais.
              </p>
              <a
                className="text-link"
                href={contact.instagram}
                target="_blank"
                rel="noreferrer"
              >
                Conhecer mais da história <ArrowUpRight size={17} />
              </a>
            </div>
          </section>

          <section className="planner-section section-pad" id="planejador">
            <div className="planner-heading" data-reveal>
              <p className="eyebrow">PREPARE SUA PRIMEIRA CONVERSA</p>
              <h2>
                Conte um pouco
                <br />
                <em>do que você procura.</em>
              </h2>
              <p>
                Faça suas escolhas e abra o WhatsApp com a mensagem pronta.
                Nenhuma resposta fica salva neste site.
              </p>
            </div>
            <VisitPlanner />
          </section>

          <section className="contact section-pad" id="contato" aria-labelledby="contact-title">
            <p className="eyebrow" data-reveal>
              QUANDO QUISER, A TAEKO ESTÁ PERTO
            </p>
            <h2 id="contact-title" data-reveal>
              Escolha como deseja
              <br />
              <em>continuar essa conversa.</em>
            </h2>
            <div className="contact-grid">
              <article>
                <MessageCircle size={24} strokeWidth={1.25} />
                <p className="eyebrow">WHATSAPP</p>
                <a href={contact.whatsapp} target="_blank" rel="noreferrer">
                  (12) 99755-0893 <ArrowUpRight size={16} />
                </a>
                <p>Tire dúvidas e conte o que você procura.</p>
              </article>
              <article>
                <MapPin size={24} strokeWidth={1.25} />
                <p className="eyebrow">LOCALIZAÇÃO</p>
                <p>
                  Av. Adhemar Pereira de Barros, 1737
                  <br /> Jacareí · SP · 12328-300
                </p>
                <a
                  className="text-link"
                  href={contact.map}
                  target="_blank"
                  rel="noreferrer"
                >
                  Abrir no mapa <ArrowUpRight size={15} />
                </a>
              </article>
              <article>
                <Camera size={24} strokeWidth={1.25} />
                <p className="eyebrow">INSTAGRAM</p>
                <a href={contact.instagram} target="_blank" rel="noreferrer">
                  @taekonoivas <ArrowUpRight size={16} />
                </a>
                <p>Veja modelos, trabalhos e novidades da loja.</p>
              </article>
              <article>
                <Phone size={24} strokeWidth={1.25} />
                <p className="eyebrow">ANTES DE VISITAR</p>
                <p>Confirme pelo WhatsApp os horários e o melhor momento para ir.</p>
              </article>
            </div>
          </section>
        </main>

        <a
          className="mobile-whatsapp"
          href={contact.whatsapp}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle size={19} /> Falar com a Taeko
        </a>

        <footer>
          <a href="#inicio" aria-label="Voltar ao início">
            <Wordmark />
          </a>
          <span>FEITO PARA CELEBRAR A SUA HISTÓRIA.</span>
          <span>Taeko Noivas · Jacareí</span>
        </footer>
      </MotionProvider>
    </>
  );
}
