# Aldenn Imóveis — 0.11.0

Demonstração de imóveis de alto padrão em https://www.aldenn.com.br/demonstracao-imobiliaria. Next.js, React e TypeScript com exportação estática, catálogo local tipado e páginas previamente geradas. Há uma área local de cadastro para apresentação. Não há autenticação real, banco de dados, painel remoto ou integração bancária.

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

## Promoções demonstrativas

Menu Promover: 7 dias (R$ 49), 30 dias (R$ 149), até vender/alugar (R$ 299). Valores fictícios escolhidos para a demonstração; não há pagamento ou renovação. Campanhas em localStorage, apenas neste navegador; nenhum dado pessoal. Prazo começa na ativação, expiração automática e encerramento manual. Nova ativação do mesmo imóvel substitui a anterior.

Filtrar primeiro, promover depois: até três campanhas compatíveis lideram resultados e sugestões da IA. Mais de três elegíveis: as mais recentes primeiro, sem duplicar imóveis; restantes seguem a ordenação comum. Adaptação pela região pesquisada, sem GPS, IP ou segmentação real entre usuários. Cores são tons das fotografias de capa demonstrativas (arquitetura/decor), não fatos das fichas França.

## Perfil e cadastro local

Ícone de perfil no cabeçalho: login simulado ou Conhecer a área da equipe. Use credenciais fictícias; e-mail e senha são descartados, sem envio ou armazenamento. A sessão guarda apenas um marcador em sessionStorage; não protege dados ou funções de produção.

Até dez imóveis locais por navegador: cadastrar, editar e excluir. Até seis fotos JPG/PNG/WebP (5 MB por arquivo), comprimidas para no máximo 1024 px e gravadas junto do cadastro em localStorage; sem uploads. Galerias existentes podem iniciar o cadastro. Falta de espaço impede gravar e informa o erro. Dados armazenados são validados ao restaurar. Os seis imóveis originais são imutáveis nesta área.

Catálogo, filtros, sugestões locais e boosts incluem os cadastros. Detalhes usam rota estática /imovel/cadastrado/?ref=...; fora do navegador original mostram cadastro não encontrado. Busca com IA aplica seus critérios também aos cadastros locais no cliente, mas o servidor continua conhecendo somente o catálogo base: fotos e registros locais não são enviados à OpenAI. Não há sincronização entre dispositivos ou funcionários.


## Cadastro 0.8.0

No perfil, Cadastrar imóvel abre /equipe/cadastro. Fotos começam vazias. Rascunhos por imóvel ficam no IndexedDB e são retomados após F5; anúncio permanece no localStorage. Botão Descartar rascunho reinicia dados sem excluir anúncio já salvo. Fotos e rascunhos não são compartilhados nem enviados ao servidor.

Campos incluem tipos ampliados, CEP/rua/número/UF, cor livre, tags normalizadas, máscaras e finalidade Venda ou locação com preços separados. Terrenos e tipos comerciais dispensam dormitórios e banheiros. ViaCEP ajuda a preencher, com edição manual disponível.

Ajuda com IA pede o essencial e confirmação, oferece título/descrição editáveis. Nova API institucional /api/imobiliaria/cadastro usa a mesma variável de chave, no servidor; só fatos necessários para texto e tags para revisão vão à OpenAI. Fotos, CEP, número e credenciais ficam fora das requisições de IA. Sugestão é persistida no rascunho. A prévia estática não serve APIs; testes interceptam o endpoint e produção valida integração real. O script de empacotamento inclui editor-handler, editor-ai e editor para publicar a API.

## Bairros e prévia — 0.9.0

A seção Bairros agrupa o catálogo por cidade e bairro. Cada card abre /bairro/ com contagens e imóveis reais da seleção; as ações Comprar/Alugar aplicam cidade, bairro e finalidade. Nenhuma estatística externa é inventada. Os anúncios promovidos só lideram se pertencerem à região.

O cadastro inicia sem finalidade. Fotos, tags e dados alterados invalidam a confirmação de publicação. O perfil pode ser aberto diretamente na página dedicada. Campos e textos auxiliares receberam tamanho e contraste maiores.

Em npm run dev, a porta 5176 oferece um proxy restrito às duas APIs de IA institucionais, aceitando apenas origens locais na porta 5175 e POST de até 6 KB. A prévia usa a IA real publicada; a chave permanece no Vercel. npm run preview serve apenas a exportação estática e não inicia esse proxy.

## Busca mobile — 0.10.0

No celular, filtros básicos/completos só aparecem no modal, fechado por X, Escape ou Ver resultados. No desktop, filtros básicos permanecem no catálogo; pesquisa completa usa o mesmo modal. A IA tem linha própria centralizada e animação discreta, desativada para redução de movimento. Comprar, Alugar e Código aparecem claramente na abertura; referência do anúncio é filtro distinto do CEP.

Listas mostram até seis imóveis inicialmente, Ver mais acrescenta seis quando disponíveis e Ver todos remove os filtros para mostrar o catálogo completo. Não existe botão de mais resultados quando todos já estão visíveis.

Na primeira visita sem armazenamento de Boost, Vivant Urbanova, Alphaville II e Casablanca recebem campanhas de sete dias demonstrativas. Campanhas existentes não são sobrescritas e encerrar todos grava uma lista vazia, impedindo reativação. Continua local por navegador/origem, sem cobrança ou anúncios externos. Os três primeiros compatíveis têm contorno marrom; o convite para rolar não menciona promoção.

Sugestões vazias: até seis regiões do catálogo, priorizadas pela referência consultada no Google autocomplete em 02/10/2026 (pt-BR, BR). Fontes, consultas e respostas estão em data/location-google-reference.json. Autocomplete não mede volume nem comprova ranking; não usamos o rótulo mais buscados no produto. Digitação busca todos os locais cadastrados. Consulta de rua usa cidade/UF dos registros (SP como compatibilidade com o catálogo original sem UF).

Busca inteligente: nomenclatura unificada, prévia de até três imóveis e Ver todas com filtros persistidos. Janela simplificada com Busca/Código, transação, tipo, cidade/bairro, botões 1+/2+/3+/4+ e preços mínimo/máximo; critérios adicionais em Mais filtros.

Validação da entrega 0.10.0: 26 testes unitários e 33 cenários de navegador aprovados (incluindo repetição dos cinco cenários mobile após ajuste do rótulo acessível), lint, tipos e build.

Fundo da abertura 0.10.1: linhas e arcos arquitetônicos com textura local discreta, sem movimento ou requisições externas, adaptados ao mobile.

## Área da equipe — 0.11.0

Pedido aprovado em 02/10/2026: Conhecer a área da equipe abre /equipe diretamente, com acesso demonstrativo, seis imóveis existentes, busca por código/região/empreendimento, ficha e links de cadastro/edição. A sessão continua sem credenciais reais.

Ficha interna inclui situação, responsável, localização/identificação/cópias da chave e imobiliária que a mantém. Anotações possuem data/hora e remoção. Dados ficam em aldenn-imoveis-gestao-v1 no localStorage, com validação na restauração, até 30 empreendimentos e últimas 30 notas por imóvel. Situação é interna; não oculta automaticamente o anúncio. Esses campos não entram no anúncio nem nas APIs de IA.

Empreendimentos são registros internos editáveis, com nome, cidade, bairro, endereço, estágio e descrição. Sugestões por datalist no editor; vínculos por nome original/atual preservam contagem após renomear o registro. Alterar o nome do empreendimento não reescreve automaticamente as fichas dos imóveis: o campo é editável na ficha.

Imóveis da seleção original podem ser editados pelo formulário existente; edições são validadas por referência/slug e salvas em aldenn-imoveis-edicoes-v1, sem duplicação e sem modificar as fontes originais. Catálogo e detalhes públicos usam a versão local. Cadastros novos continuam no armazenamento anterior. Editor de imóveis originais começa com até seis fotos e conserva rascunho. Tudo permanece por navegador/origem, sem autenticação, sincronização compartilhada ou backend de gestão.

Validação: lint, tipos/build, 28 testes unitários e 36 cenários Chromium. Verificados F5, edição de imóvel original nos detalhes públicos e catálogo, anotações e chaves ausentes do anúncio, cadastro/edição de empreendimentos e sugestões no formulário, regressões 320–1920 px.
