import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { asset } from "@/lib/format";
import { Contact } from "./contact";

export function Footer() {
  return <footer className="footer" id="contato"><div className="container footer-top"><div>
    <Link className="brand brand-light" href="/" aria-label="Aldenn Imóveis, início"><Image src={asset("/brand/aldenn-wordmark.svg")} alt="Aldenn" width={138} height={32} /><span>IMÓVEIS</span></Link>
    <p>Um novo olhar para o seu próximo endereço.</p>
  </div><div className="footer-links"><a href={asset("/?purpose=venda#imoveis")}>Imóveis à venda</a><a href={asset("/?purpose=locacao#imoveis")}>Imóveis para alugar</a><Contact variant="footer" /></div></div>
  <div className="container footer-bottom"><p>Projeto de portfólio, sem oferta comercial. Fotografias ilustrativas do Unsplash, de diferentes projetos. Características e valores servem apenas à demonstração.</p><a href="https://www.aldenn.com.br">Feito pela Aldenn <ArrowUpRight size={16} /></a></div></footer>;
}
