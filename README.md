# Projetos de clientes: Aldenn Sites

Este repositório mantém projetos independentes. O aplicativo em `site/` pertence à Belleland Closet. A demonstração da Taeko Noivas fica em `taeko/`. O modelo fictício Maison Amora fica em `modelo-noivas/` e reaproveita somente a base visual e técnica da demonstração.

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

## Taeko Noivas

A demonstração editorial está em `taeko/`. O planejamento e o contrato para a futura sequência de quadros estão em [docs/taeko-noivas/README.md](docs/taeko-noivas/README.md).

## Modelo para lojas de noivas

O projeto independente em `modelo-noivas/` apresenta a marca fictícia Maison Amora, sem dados ou vínculos com a Taeko. Seu registro de escopo está em [docs/modelo-noivas/README.md](docs/modelo-noivas/README.md).
