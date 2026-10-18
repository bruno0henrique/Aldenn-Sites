# Projetos de clientes: Aldenn Sites

**Versão vigente: 0.89.0**

Este repositório mantém projetos independentes. O aplicativo em `site/` pertence à Belleland Closet. O modelo Aldenn Noivas fica em `modelo-noivas/`, com contatos da Aldenn e dados ilustrativos.

## Nixo Studio

Site de apresentação e demonstração importado do Sites, preservando o código original. [Nixo Studio 0.1.0](nixo-studio/README.md): prévia local, origem e instruções de manutenção. Integrado à Aldenn 0.65.0 em [www.aldenn.com.br/nixo](https://www.aldenn.com.br/nixo), com card no portfólio e acesso pelo menu Apps.

## Belleland Closet

Catálogo mobile-first de roupas com reserva direcionada ao WhatsApp e painel de revisões integrado ao Supabase.

## Desenvolvimento

```bash
cd site
npm install
npm run dev
```

Use `site/.env.example` para configurar o Supabase. A implantação do banco e a criação da conta proprietária estão descritas em [docs/ARQUITETURA.md](docs/ARQUITETURA.md).

## Base documental

Antes de criar ou implementar funcionalidades, revise a [base de projeto para clientes](docs/base-projeto-cliente/README.md).

Os documentos dessa pasta são modelos de referência. Somente requisitos preenchidos, revisados e aprovados passam a orientar a implementação.

Os requisitos aprovados da Belleland estão em [docs/REQUISITOS-APROVADOS.md](docs/REQUISITOS-APROVADOS.md).

## Aldenn Noivas

Modelo demonstrativo para lojas e ateliês de noivas em `modelo-noivas/`. Publicação: https://www.aldenn.com.br/demonstracao-noiva/. Requisitos em `docs/modelo-noivas/README.md`.

## Aurora Noivas

Demonstração fictícia independente em `aurora-noivas/`, com paleta rosé e ameixa e doze modelos organizados em Noivas, Madrinhas, Debutantes e Gala. [Desenvolvimento e prévia local](aurora-noivas/README.md) · [Requisitos aprovados](docs/aurora-noivas/README.md). Destino público autorizado: https://www.aldenn.com.br/demonstracao-noiva-dois/.

## Novo catálogo FF Moda Festa

Projeto independente em `ff-catalogo/`, criado do zero para locação. Oito vestidos reais, fotografias oficiais, filtros, páginas individuais, WhatsApp e loja física. [Desenvolvimento](ff-catalogo/README.md) · [Requisitos e fontes](docs/ff-catalogo/README.md). Prévia local: http://127.0.0.1:5186/. Os modelos anteriores permanecem preservados.
