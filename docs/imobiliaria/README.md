# Aldenn Imóveis: requisitos e decisões aprovados

## Ajuste aprovado em 29/09/2026

- Melhorar a apresentação da parcela, com valor destacado, prazo/juros legíveis e resumo separado; conservar o cálculo Price.
- Inverter as ações: WhatsApp primeiro e dourado; solicitar contato como ação secundária.
- Preparar vídeos 3D por imóvel para futura ferramenta que gera visualizações a partir das imagens. Sem geração ou integração externa nesta etapa. Cadastro opcional tipado, player sem autoplay e manifesto local das fotos. Ver `modelo-imobiliaria/docs/VIDEO-3D.md`.

## Escopo confirmado em 29/09/2026

Site demonstrativo para o portfólio em `/demonstracao-imobiliaria`, com catálogo local, quatro vendas e duas locações, detalhes em `/imovel/[slug]`, fotografias próprias dos anúncios, filtros por finalidade/localização/tipo/dormitórios/preço e ordenação por preço. Marca Aldenn Imóveis com o SVG oficial, preto suave, bege, branco e dourado fosco. Cormorant Garamond nos títulos e Manrope no texto, hospedadas localmente.

Contato por formulário e prévia de WhatsApp inteiramente simulados, sem envio ou persistência de dados. Financiamento Price nas vendas: entrada de 30%, 420 meses, juros efetivos anuais de 10%, todos editáveis; conversão equivalente mensal, juros zero, entrada integral e entradas inválidas tratados. Custos de aluguel, condomínio e IPTU separados. GSAP solicitado pelo usuário, com movimento contido e preferência por redução respeitada.

Next.js, React e TypeScript, exportação estática e basePath. Sem painel, autenticação, banco ou integração bancária. Versão inicial 0.1.0. Publicação no repositório `aldenn` a partir de master atualizado, preservando a home e demonstrações existentes.

## Fontes e conferência

Referências de navegação: França Imobiliária, Chaves na Mão e Viva Real, indicadas pelo usuário. Conteúdo inicial da França Imobiliária consultado em 29/09/2026. Referências finais: 27236, 13027, 24477, 24060, 21457 e 26556. URLs, datas e fotografias estão em `modelo-imobiliaria/data/sources.json`. Os textos foram reescritos e não afirmam disponibilidade atual. A página identifica o caráter demonstrativo e a origem; os imóveis não são apresentados como carteira real da Aldenn. Marcas d’água permanecem nas fotografias.

- **Substituição aprovada:** anúncio 27740 retirado e fotos indisponíveis; usuário aprovou Casablanca 26556 (Jardim Aquarius), aluguel de R$ 8.000, 153 m², quatro dormitórios e duas suítes.
- **27236:** descrição diferencia 390 m² construídos e 452 m² de terreno. A ficha repetia 390 como terreno; adotados os valores explicitamente diferenciados no texto.
- **13027:** terreno não informado; removidas previsões antigas de obra de 2021/2022.
- **24477:** três suítes na descrição e apenas dois banheiros na ficha; total de banheiros não informado para evitar afirmar a contagem contraditória.
- **24060:** venda confirmada pela finalidade e preço do anúncio; trecho antigo sobre aluguel não utilizado. Total de banheiros não informado pela divergência com a descrição.
- **21457:** total de banheiros não informado pela divergência entre ficha e três suítes mais ambientes de apoio.
- Valores ausentes ficam como “não informado”; áreas construídas e terreno são separados. Não são inventados corretores, CRECI, endereços exatos ou provas sociais.

## Critérios de entrega

Lint, tipos, build, testes de cálculo e filtros, navegação real, estado vazio, galeria, validação de contatos e ausência de envio ou armazenamento. Verificar 320, 390, 768, 1024 e 1440 px, redução de movimento, páginas diretas, recarga, imagens e fontes locais. Copiar somente a exportação para o repositório institucional, registrar versões e publicar commits e tags.

## Entrada refinada, versão 0.3.0

Solicitação confirmada em 29/09/2026: entrada mais sofisticada, logo em abertura breve e responsividade mobile. Referências de estudo: [BARNES](https://www.barnes-international.com/en/) e [The Modern House](https://themodernhouse.com/), consultadas em 29/09/2026. Aproveitados destaque fotográfico, hierarquia editorial e navegação simples; preservados identidade, textos e fotografias locais da demonstração.

Foto de entrada: próprio anúncio Alphaville II, referência 24477. Moldura curva e linhas douradas discretas. Abertura GSAP de 1,45 segundo usa o SVG oficial, é decorativa, não bloqueia cliques nem salva dados e possui ocultação de segurança após três segundos. Sem JavaScript, movimento reduzido ou acesso com filtros/âncoras, o conteúdo aparece diretamente. No mobile, busca precede a fotografia. Formulários usam fonte mínima de 16 px.


## Busca e imagens, versão 0.4.0

Solicitação de 29/09/2026 substitui a regra de usar fotos dos próprios anúncios: todas as imagens exibidas agora são exemplos sem marca d'água obtidos no Unsplash. O usuário pediu fotos da internet, portanto não houve geração por IA nem remoção de marca de fotografias alheias. 48 imagens distintas em seis galerias locais, verificadas visualmente; manifesto com autor, página, licença, URL, hash e consulta em data/illustrative-images.json. Dados/valores e rotas de referência anteriores foram conservados para continuidade, mas as fotos não representam esses imóveis. Avisos no hero, cards, galeria e rodapé explicitam o caráter ilustrativo. data/sources.json permanece como registro histórico dos dados de referência; arquivos de fotos antigos foram removidos da publicação.

Busca: painel unificado; foco por sublinhado sem sobreposição; sugestões locais de cidade, bairro e condomínio. ViaCEP (https://viacep.com.br/, consultado em 29/09/2026) resolve CEPs de oito dígitos de todo o Brasil e pesquisa ruas nas cidades da seleção, São José dos Campos e Jacareí/SP. A seleção de uma rua/CEP filtra pelo bairro e cidade, pois não há endereços exatos dos imóveis. Sem correspondência, mostra estado vazio. Requisições GET debounced e canceláveis, timeout de 6,5 segundos, sem cookies/referrer; somente o termo de localização é consultado. Dados de formulário de contato não são enviados nem armazenados. Falhas do serviço preservam a busca por nomes locais.

Dormitórios agora têm limite máximo inclusivo (até 1–5). Substitui a semântica anterior de mínimo. Rodapé da entrada com a lista de cidades retirado. Preparação 3D preservada, mas o manifesto sinaliza imagens de projetos distintos, inadequadas a reconstrução espacial fiel; para esse fim, serão necessárias fotos consistentes do mesmo imóvel.


## Revisão mobile, versão 0.4.1

Solicitação de 29/09/2026: corrigir controles estranhos no celular, incluindo o texto cortado de dormitórios. Filtros em coluna até 540 px, campos com altura de 50 px e fonte de 16 px; ordenação em linha própria, abaixo da contagem. Em 320 px, prazo e juros ficam separados, o título do contato é menor e o placeholder do nome é curto. Galeria mantém contador sem encolhimento, legenda quebrável e setas de 44 px. Sem alteração da regra de máximo de dormitórios ou das simulações.

Validação: lint, tipos, build, dez testes unitários e doze testes de navegador. Verificação de encaixe das opções entre 320 e 700 px, ausência de rolagem horizontal até 1920 px, galerias, formulário, filtros e cálculos.
Os placeholders da busca e do nome foram encurtados para evitar texto cortado em 320 px.

## Pesquisa completa e IA — 0.5.0 (30/09/2026)

Pedidos aprovados: pesquisa completa, melhor separação do texto e fotografia na entrada, retirar selos Imagem ilustrativa das fotos e WhatsApp pequeno no canto. A quarta opção Busca com IA interpreta texto livre, mostra um resumo público progressivo, sugestões do catálogo e Ver tudo com parâmetros na URL e navegação completa. Referências React anexadas foram usadas apenas como inspiração visual; não impõem bibliotecas nem apresentação de raciocínio interno.

Pesquisa manual combina finalidade, texto, cidade, bairro, condomínio, tipo, dormitórios, suítes, banheiros, vagas, diferencial, código, preços e áreas construída/terreno. Localizações dependentes são reiniciadas ao mudar cidade/bairro. Valores ausentes não satisfazem filtros numéricos. Campos de zona, permuta, mobiliado, financiamento e estágio da referência não foram inventados: não há esses dados no catálogo. Limites máximos existentes foram preservados; mínimos permitem reproduzir pedidos exatos da IA. Mais de um diferencial usa | e exige todos.

A exportação continua estática. POST /api/imobiliaria/busca é uma função do Next institucional, com OPENAI_API_KEY somente no servidor Vercel, confirmada por metadados em Production em 30/09/2026, sem leitura da chave. Modelo padrão gpt-4.1-mini, opcional OPENAI_REAL_ESTATE_MODEL. Responses API com saída JSON estruturada, stream:true, store:false, limite de saída, timeout e validação de filtros. Não são usados tools, busca externa, raciocínio interno ou URLs indicadas pela IA. Dados do catálogo determinam recomendações e preços.

Privacidade: o texto do pedido e catálogo público são enviados à OpenAI para interpretação; a interface informa isso e orienta não incluir dados pessoais. O app não salva o pedido nem envia formulários de contato. store:false não altera políticas de retenção do provedor. Limite de 600 caracteres/4KB, origem igual, limite por IP e global em memória por instância (melhor esforço; não substitui proteção distribuída). Nenhuma chave aparece no bundle. Falha, limite ou cancelamento preservam a pesquisa manual e não produzem resultados fictícios.

O script search:catalog gera data/search-catalog.json a partir do cadastro factual versionado, sem galerias. scripts/package-institution.mjs copia somente a exportação e os módulos necessários à API, sem modificar a home. A prévia estática local não oferece API real: testes de UI interceptam o endpoint e testes do handler usam upstream simulado. Validação real da IA ocorre na publicação institucional.

Avisos repetidos sobre fotos foram retirados a pedido do usuário. Caráter demonstrativo e fontes permanecem no rodapé e nos detalhes; as fotos Unsplash continuam sendo de projetos diferentes e não são adequadas à reconstrução 3D fiel. O botão flutuante usa a prévia de WhatsApp demonstrativa existente, sem enviar mensagens.

Fontes técnicas consultadas em 30/09/2026: https://developers.openai.com/api/docs/guides/streaming-responses e https://developers.openai.com/api/docs/guides/structured-outputs .

Validação da versão 0.5.0: lint, tipos, build estático, 15 testes unitários e 16 testes Chromium passaram. Conferência de controles e ausência de rolagem horizontal de 320 a 1920 px, filtros dependentes, recarga, acesso direto, galerias, simulação financeira e contatos sem envio real. Testes da IA verificam streaming fragmentado, filtros exatos/mínimos/máximos, erro, chave ausente, origem, tamanho e limite de requisições.

Validação publicada em 30/09/2026: produção Vercel Ready, busca real OpenAI por apartamento para locação no Jardim Aquarius com mínimo de duas suítes e teto de R$ 9.000 retornou Casablanca por R$ 8.000. Ver tudo aplicou finalidade, localização, tipo, preço e minSuites=2; recarga preservou um resultado. Lint, tipos e build Next institucionais passaram; quatro warnings preexistentes nas bases visuais, sem erros. A entrega preserva todas as mudanças da home até v0.49.6.

Refinamento 0.5.1: ao selecionar Busca com IA, filtros e listagem manuais são ocultados até escolher outro modo ou Ver tudo. Isso evita exibir critérios anteriores contraditórios abaixo das sugestões. Estado manual é preservado ao fechar a IA. Validação real adicional: comprar apartamento até três dormitórios e R$ 1,5 milhão retornou Splendor Garden por R$ 1.250.000, com URL bedrooms=3/maxPrice=1500000.

Refinamento 0.5.2: seletores de diferencial mostram critérios vindos da IA mesmo com variação de escrita ou combinação, sem esconder o filtro ativo. Terceira consulta real: casa à venda em Urbanova com piscina até R$ 3 milhões retornou Vivant Urbanova por R$ 2.950.000. Quatro testes adicionais passaram na publicação, incluindo seis acessos diretos, recarga, filtros e mobile.

## Destaque da IA e Ver tudo — 0.5.3 (30/09/2026)

Pedido confirmado: destacar a quarta opção discretamente e corrigir Ver tudo. O defeito foi reproduzido em teste de navegador: se o href já corresponde à URL atual (ex.: purpose=venda), o navegador pode realizar apenas navegação no mesmo documento; o painel IA não era desmontado e escondia a listagem. O clique comum agora chama o catálogo para substituir todos os filtros, atualizar URL, sair da IA, alinhar localização/finalidade e focar a contagem de resultados, com rolagem respeitando movimento reduzido. O href continua válido para nova aba, cliques com modificadores e acesso direto.

Destaque visual: botão em cápsula bege com borda dourada e leve variação de cor/escala do ícone via GSAP (1,1 s de efeito e 6 s de intervalo). prefers-reduced-motion desativa animação e transição. Não houve alteração na API nem na chave. Teste regressivo falhou antes da correção e passou depois, cobrindo destino idêntico, filtros vazios, troca de locação para venda e recarga.

Validação 0.5.3: lint, build com verificação de tipos e 18 testes Chromium passaram, incluindo URL idêntica, remoção de critérios antigos, recarga e layouts de 320 a 1920 px.
