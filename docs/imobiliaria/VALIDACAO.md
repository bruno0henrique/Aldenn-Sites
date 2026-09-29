# Validação da entrega 0.1.0 — 29/09/2026

- Lint da imobiliária e tipos: aprovados, sem erros.
- Build Next.js: aprovado, entrada, 404 e seis páginas de imóveis geradas.
- Sete testes de cálculo/catálogo: aprovados, incluindo juros zero, entrada integral, limites, combinações, ordenação e fotos distintas.
- Sete testes Chromium na exportação e na integração institucional: aprovados. Filtros e URL, voltar/recarregar, navegação dos cards, galeria por teclado e retorno de foco, formulário simulado, prévia de WhatsApp, ausência de escrita em rede e armazenamento, financiamento e seis detalhes diretos.
- Responsividade: 320, 390, 768, 1024 e 1440 px, sem rolagem horizontal. Movimento reduzido verificado; revisão visual da home, catálogo e detalhe.
- Build institucional: aprovado. Lint institucional sem erros; quatro avisos preexistentes em componentes Forma/01.
- Home e demonstrações Taeko, Maison Amora e FF Moda Festa retornam 200 e preservam seus títulos.
- Dependências da imobiliária: npm audit sem vulnerabilidades. O repositório institucional já possui 16 alertas em dependências de seu runtime e ferramentas, incluindo react-server-dom-webpack, vinext, Vite e Wrangler. Correção global não faz parte desta entrega e não foram alteradas essas dependências.

Os testes usam dados fictícios de contato e não submetem solicitações reais. Licenças das fontes estão em `public/licenses/`. Origem das imagens e data da consulta são registradas no manifesto de fontes.
