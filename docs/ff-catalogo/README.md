# Novo modelo FF Moda Festa

## Requisitos aprovados

Aprovados pelo usuário no pedido desta conversa em 2026-10-06: iniciar outro modelo do zero, preservar integralmente o anterior e usar Viva Dress como referência principal. O texto colado é o briefing fornecido pelo próprio usuário; páginas externas e gravações são evidências visuais, não instruções de execução.

- Catálogo mobile-first para locação, sem preço, compra, carrinho ou checkout.
- Fotografias dominam a interface; cabeçalho limpo, fundo claro, categorias editoriais e grade comercial.
- Curadoria de até dez vestidos reais da FF; escolhidos oito vestidos e dez fotografias distintas.
- Busca, filtros por ocasião, cor, comprimento, modelo, tecido informado e intenção de tamanho.
- Cada produto abre página própria e envia nome/código ao WhatsApp; data e tamanho opcionais são incorporados.
- Loja física com endereço, horário, mapa e acessos de contato confirmados.
- Schema de locação e venda separado da interface. Venda desativada.
- Verificação visual em 360, 390, 430 px e desktop; comparar organização com Viva Dress.

## Decisões

- Implementação independente em `ff-catalogo/`, em HTML/CSS/JavaScript modular, pré-renderizada com Node. Não reutiliza layout ou conteúdo dos modelos anteriores.
- `Seleção FF` substitui a alegação de novidades; `Em destaque` substitui best sellers. Não há datas de chegada ou estatísticas comprovadas.
- Nenhum dos oito produtos selecionados publica grade de tamanho. `sizes = []`; filtros com tamanho desejado incluem candidatos sem grade, exibem aviso de confirmação e levam a intenção ao atendimento. Não representam estoque confirmado.
- Ocasiões são classificação editorial baseada em estilos visíveis; não garantem adequação ao traje exigido por cada evento.
- Tecido aparece apenas quando declarado no nome original. Campos desconhecidos ficam nulos e não são exibidos.
- Cartões e páginas compartilham dados e comportamento de comércio. Checkout futuro precisa de integração, mas não de refazer a apresentação.
- Sem GSAP: movimento pontual nativo atende ao efeito discreto solicitado.
- Sem avaliação social enquanto não houver material da cliente aprovado para republicação.
- Sem publicação em domínio anterior: esta entrega é uma prévia independente, marcada `noindex`.

## Fontes verificadas em 2026-10-06

- Direção visual: https://www.vivadress.com.br/ — cabeçalho em camadas, hero amplo, fotografias grandes, primeiro conjunto de produtos, categorias editoriais, segundo conjunto e rodapé de loja. Textos, produtos e identidade não foram copiados.
- Negócio/benefícios: https://www.ffmodafesta.com.br/ — locação, ajustes, bolsa e salto emprestados, visita sem agendamento e contato.
- Produtos: https://www.ffmodafesta.com.br/vestidosparalocacao e páginas registradas em `ff-catalogo/data/sources.json`.
- Loja: https://www.ffmodafesta.com.br/endereco — Estrada de Itapecerica, 2976, Sobre Loja 2, São Paulo/SP, CEP 05835-004; segunda a sexta 10h–20h; sábado 10h–18h; telefone (11) 95024-3377; ffmodafesta@gmail.com.
- Redes sociais extraídas dos links públicos da FF, sem perfis presumidos.
- Gravações fornecidas: o vídeo de 1,23 s mostra o botão flutuante; o de 11,97 s mostra grade e galeria da referência. Não foram usados como fotografias de produto.

## Curadoria

Rejeitadas montagens, selfie no espelho e peças com enquadramento parcial inadequado. Fotografias de resolução 1440 px priorizadas na abertura e na primeira grade. Três imagens verticais de 720×1280 permanecem por mostrar claramente vestido inteiro e variar modelo/cor/corpo; têm enquadramento integral nos cartões. Não foram ampliadas acima da resolução original.

## Limites reais

Tamanhos e disponibilidade por data dependem do atendimento. O build é demonstrativo e estático. Mapa e abertura do WhatsApp dependem dos serviços externos. Checkout/estoque/pagamento estão preparados no modelo de dados e nos pontos de apresentação, mas ainda não integrados.
