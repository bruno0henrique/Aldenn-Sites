# Projetos de clientes: Aldenn Sites

Este repositório mantém projetos independentes. O aplicativo em `site/` pertence à Belleland Closet. O modelo Aldenn Noivas fica em `modelo-noivas/`, com contatos da Aldenn e dados ilustrativos.

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
