# Aldenn Imóveis — 0.4.0

Demonstração de imóveis de alto padrão em https://www.aldenn.com.br/demonstracao-imobiliaria. Next.js, React e TypeScript com exportação estática, catálogo local tipado e páginas previamente geradas. Não há painel, autenticação, banco de dados ou integração bancária.

## Desenvolvimento e validação

```sh
npm ci
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
npx playwright install chromium
npm run test:browser
```

O servidor de desenvolvimento e a prévia usam a porta 5175. Acesse `/demonstracao-imobiliaria/`. `npm run preview` serve a exportação de `out/`. Para validar outro destino, configure `DEMO_TEST_URL` antes de executar os testes de navegador.

## Publicação

Copiar o conteúdo de `out/` para `public/demonstracao-imobiliaria/` do repositório institucional `aldenn`. As regras de entrada e detalhes estão no `next.config.ts` institucional. Nunca publicar este repositório sobre a raiz institucional. Fontes Cormorant Garamond e Manrope são distribuídas localmente por Fontsource; fotografias WebP e miniaturas também são locais.

## Conteúdo e simulações

Quatro imóveis à venda e dois para aluguel, com oito fotografias próprias por anúncio. `data/properties.ts` contém os dados conferidos; `data/sources.json` registra referência, URL, data da consulta, origem de cada foto e SHA-256 do original. `npm run media:import` importa novamente as fotos; o snapshot é intencionalmente estável e o comando não atualiza preços ou descrições automaticamente. Os arquivos temporários em `.source/` são ignorados.

Os formulários apenas validam e exibem confirmação. Não enviam mensagens, não abrem o WhatsApp real e não salvam informações pessoais. O financiamento usa tabela Price e taxa mensal equivalente à taxa anual efetiva, com entrada inicial de 30%, 420 meses e 10% ao ano. A hipótese favorável é ilustrativa; seguros, tarifas e correção não estão incluídos.

GSAP anima entradas e a navegação interna, sem alterar a rolagem nativa. `prefers-reduced-motion` remove esses movimentos. Galeria e contatos usam diálogo nativo, Escape e retorno do foco.

Requisitos e decisões: [documentação aprovada](../docs/imobiliaria/README.md).

Preparação da ferramenta e cadastro do vídeo 3D: [guia de integração](docs/VIDEO-3D.md). `npm run 3d:inputs` gera o manifesto local das fotografias, sem enviar arquivos.

## Imagens e busca (0.4.0)

Fotos atuais: Unsplash, galerias ilustrativas de diferentes projetos, sem marcas d'água. Créditos/licença em data/illustrative-images.json e na galeria ampliada. npm run media:import recupera e otimiza esses arquivos a partir do manifesto versionado. data/sources.json guarda apenas a origem histórica dos dados e valores.

Busca com sugestões e teclado. CEPs via ViaCEP e ruas nas duas cidades do catálogo; resultados por bairro/cidade. Dormitórios por limite máximo. Nenhum contato real é enviado ou salvo. O manifesto 3D não declara essas imagens adequadas a reconstrução fiel.
