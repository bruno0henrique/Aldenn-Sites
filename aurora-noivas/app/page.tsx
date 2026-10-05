import { ArrowDown, ArrowRight, Camera, MapPin, MessageCircle } from "lucide-react";
import Image from "next/image";
import { MotionProvider } from "@/components/aurora/motion-provider";
import { SiteHeader, Wordmark } from "@/components/aurora/site-header";
import { VisitPlanner } from "@/components/aurora/visit-planner";
import { DressSamples } from "@/components/aurora/dress-samples";
import { contact, brand } from "@/lib/brand";
import { basePath } from "@/lib/catalog";

export default function Home() {
  return <>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <SiteHeader />
    <MotionProvider>
      <main id="conteudo">
        <section className="hero" id="inicio" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow hero-reveal">PARA OS DIAS QUE FICAM PARA SEMPRE</p>
            <h1 id="hero-title"><span className="hero-reveal">O seu momento.</span><span className="hero-reveal">O seu jeito.</span><span className="hero-reveal"><em>O seu vestido.</em></span></h1>
            <p className="hero-description hero-reveal">Entre rendas, cores e novas possibilidades, descubra o que faz você se sentir inteiramente você.</p>
            <div className="hero-actions hero-reveal"><a className="button" href="#vestidos">Descobrir os vestidos<ArrowRight size={19} aria-hidden="true" /></a><a className="text-link" href="#planejador">Começar uma conversa</a></div>
            <a className="hero-scroll hero-reveal" href="#vestidos"><ArrowDown size={17} aria-hidden="true" /> UM ENCONTRO COM O SEU ESTILO</a>
          </div>
          <div className="hero-visual">
            <Image src={`${basePath}/media/noiva-jasmim.webp`} alt="Modelo de pele escura e cabelo cacheado com vestido de noiva de renda e saia ampla" width={1024} height={1536} sizes="(max-width: 760px) 100vw, 52vw" loading="eager" fetchPriority="high" />
            <div className="hero-photo-caption"><span>AURORA NOIVAS</span><p>Um novo capítulo,<br /><em>todo seu.</em></p></div>
          </div>
        </section>
        <DressSamples />
        <section className="location-section section-pad" id="localizacao" aria-labelledby="location-title">
          <div className="location-heading"><div><p className="eyebrow">UM LUGAR PARA IMAGINAR</p><h2 id="location-title">O próximo encontro.</h2></div><p>Localização ilustrativa · Liberdade, São Paulo.<br />Endereço fictício, sem atendimento no local.</p></div>
          <div className="illustrative-map"><iframe title="Mapa ilustrativo do bairro Liberdade, em São Paulo" src={contact.mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>
        </section>
        <section className="planner-section section-pad" id="planejador" aria-labelledby="planner-title">
          <div className="planner-heading" data-reveal><p className="eyebrow">SEU PRIMEIRO PASSO</p><h2 id="planner-title">Vamos imaginar<br /><em>juntas?</em></h2><p>Conte sobre o seu momento e reúna as referências que mais combinam com você.</p><span className="planner-demo-note">Você está experimentando uma demonstração. O contato será com a Aldenn, sobre um site para sua loja.</span></div>
          <VisitPlanner />
        </section>
        <section className="process section-pad" id="processo" aria-labelledby="process-title">
          <div className="process-photo"><Image src={`${basePath}/media/noiva-magnolia.webp`} alt="Modelo morena de cabelo cacheado com vestido de noiva em cetim marfim" width={1024} height={1536} sizes="(max-width: 760px) 86vw, 43vw" /></div>
          <div className="process-copy"><p className="eyebrow" data-reveal>DO SEU JEITO</p><h2 id="process-title" data-reveal>Encontre o que<br /><em>combina com você.</em></h2><p className="showroom-description">Guarde suas referências e comece a conversa.</p><a className="button" href="#vestidos">Escolher uma referência<ArrowRight size={17} aria-hidden="true" /></a></div>
        </section>
        <section className="contact section-pad" id="contato" aria-labelledby="contact-title">
          <div className="contact-intro"><p className="eyebrow">TRANSFORME INSPIRAÇÃO EM PRESENÇA</p><h2 id="contact-title">Imagine essa experiência<br /><em>na sua loja.</em></h2><p>A Aurora Noivas é uma marca fictícia criada para apresentar uma possibilidade de site. Para conversar sobre seu projeto, fale com a Aldenn.</p><a className="button button-light" href={contact.whatsapp} target="_blank" rel="noreferrer">Falar com a Aldenn<MessageCircle size={18} aria-hidden="true" /></a></div>
          <div className="contact-cards"><article className="contact-social"><Camera size={24} aria-hidden="true" /><p className="eyebrow">INSTAGRAM DA ALDENN</p><a href={contact.instagram} target="_blank" rel="noreferrer">@aldenn.com.br<ArrowRight size={18} aria-hidden="true" /></a><p>Conheça outros projetos e possibilidades para o seu negócio.</p></article><article className="contact-address"><MapPin size={24} aria-hidden="true" /><p className="eyebrow">LOCALIZAÇÃO ILUSTRATIVA</p><p>{brand.fictionalAddress}</p><span>Endereço fictício. Não há loja ou atendimento neste local.</span></article></div>

        </section>
      </main>
      <footer><a href="#inicio" aria-label="Aurora Noivas, voltar ao início"><Wordmark /></a><p>Marca, vestidos, imagens e endereço ilustrativos.<br />Uma demonstração criada pela <a href={contact.instagram} target="_blank" rel="noreferrer">Aldenn</a>.</p><a className="footer-top" href="#inicio">Voltar ao início<ArrowRight size={16} aria-hidden="true" /></a></footer>
    </MotionProvider>
  </>;
}
