import Link from "next/link";
export default function NotFound() { return <main id="conteudo" className="container empty-state"><span className="eyebrow">ENDEREÇO NÃO ENCONTRADO</span><h1>Vamos voltar à seleção?</h1><p>Este imóvel não faz parte da demonstração.</p><Link className="button button-dark" href="/">Explorar os imóveis</Link></main>; }
