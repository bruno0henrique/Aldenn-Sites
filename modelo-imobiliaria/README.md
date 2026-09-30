# Aldenn Imóveis — 0.5.3

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

Quatro imóveis à venda e dois para aluguel, com oito fotografias ilustrativas por anúncio. `data/properties.ts` contém os dados conferidos; `data/sources.json` registra referência, URL, data da consulta, origem de cada foto e SHA-256 do original. `npm run media:import` importa novamente as fotos; o snapshot é intencionalmente estável e o comando não atualiza preços ou descrições automaticamente. Os arquivos temporários em `.source/` são ignorados.

Os formulários apenas validam e exibem confirmação. Não enviam mensagens, não abrem o WhatsApp real e não salvam informações pessoais. O financiamento usa tabela Price e taxa mensal equivalente à taxa anual efetiva, com entrada inicial de 30%, 420 meses e 10% ao ano. A hipótese favorável é ilustrativa; seguros, tarifas e correção não estão incluídos.

GSAP anima entradas e a navegação interna, sem alterar a rolagem nativa. `prefers-reduced-motion` remove esses movimentos. Galeria e contatos usam diálogo nativo, Escape e retorno do foco.

Requisitos e decisões: [documentação aprovada](../docs/imobiliaria/README.md).

Preparação da ferramenta e cadastro do vídeo 3D: [guia de integração](docs/VIDEO-3D.md). `npm run 3d:inputs` gera o manifesto local das fotografias, sem enviar arquivos.

## Imagens e busca (0.4.0)

Fotos atuais: Unsplash, galerias ilustrativas de diferentes projetos, sem marcas d'água. Créditos/licença em data/illustrative-images.json e na galeria ampliada. npm run media:import recupera e otimiza esses arquivos a partir do manifesto versionado. data/sources.json guarda apenas a origem histórica dos dados e valores.

Busca com sugestões e teclado. CEPs via ViaCEP e ruas nas duas cidades do catálogo; resultados por bairro/cidade. Dormitórios por limite máximo. Nenhum contato real é enviado ou salvo. O manifesto 3D não declara essas imagens adequadas a reconstrução fiel.

## Pesquisa completa e IA — 0.5.0 (30/09/2026)

Pedidos aprovados: pesquisa completa, melhor separação do texto e fotografia na entrada, retirar selos Imagem ilustrativa das fotos e WhatsApp pequeno no canto. A quarta opção Busca com IA interpreta texto livre, mostra um resumo público progressivo, sugestões do catálogo e Ver tudo com parâmetros na URL e navegação completa. Referências React anexadas foram usadas apenas como inspiração visual; não impõem bibliotecas nem apresentação de raciocínio interno.

Pesquisa manual combina finalidade, texto, cidade, bairro, condomínio, tipo, dormitórios, suítes, banheiros, vagas, diferencial, código, preços e áreas construída/terreno. Localizações dependentes são reiniciadas ao mudar cidade/bairro. Valores ausentes não satisfazem filtros numéricos. Campos de zona, permuta, mobiliado, financiamento e estágio da referência não foram inventados: não há esses dados no catálogo. Limites máximos existentes foram preservados; mínimos permitem reproduzir pedidos exatos da IA. Mais de um diferencial usa | e exige todos.

A exportação continua estática. POST /api/imobiliaria/busca é uma função do Next institucional, com OPENAI_API_KEY somente no servidor Vercel, confirmada por metadados em Production em 30/09/2026, sem leitura da chave. Modelo padrão gpt-4.1-mini, opcional OPENAI_REAL_ESTATE_MODEL. Responses API com saída JSON estruturada, stream:true, store:false, limite de saída, timeout e validação de filtros. Não são usados tools, busca externa, raciocínio interno ou URLs indicadas pela IA. Dados do catálogo determinam recomendações e preços.

Privacidade: o texto do pedido e catálogo público são enviados à OpenAI para interpretação; a interface informa isso e orienta não incluir dados pessoais. O app não salva o pedido nem envia formulários de contato. store:false não altera políticas de retenção do provedor. Limite de 600 caracteres/4KB, origem igual, limite por IP e global em memória por instância (melhor esforço; não substitui proteção distribuída). Nenhuma chave aparece no bundle. Falha, limite ou cancelamento preservam a pesquisa manual e não produzem resultados fictícios.

O script search:catalog gera data/search-catalog.json a partir do cadastro factual versionado, sem galerias. scripts/package-institution.mjs copia somente a exportação e os módulos necessários à API, sem modificar a home. A prévia estática local não oferece API real: testes de UI interceptam o endpoint e testes do handler usam upstream simulado. Validação real da IA ocorre na publicação institucional.

Avisos repetidos sobre fotos foram retirados a pedido do usuário. Caráter demonstrativo e fontes permanecem no rodapé e nos detalhes; as fotos Unsplash continuam sendo de projetos diferentes e não são adequadas à reconstrução 3D fiel. O botão flutuante usa a prévia de WhatsApp demonstrativa existente, sem enviar mensagens.

Fontes técnicas consultadas em 30/09/2026: https://developers.openai.com/api/docs/guides/streaming-responses e https://developers.openai.com/api/docs/guides/structured-outputs .
