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
