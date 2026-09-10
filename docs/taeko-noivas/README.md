# Taeko Noivas — planejamento do site

Versão documental: 0.15.0 • Data: 10/09/2026 • Estado: demonstração implementada e publicada.

O site da Taeko é uma aplicação independente em `taeko/` e sua demonstração pública fica em `https://aldenn.com.br/demonstracao-taeko`. O aplicativo existente em `site/` pertence à Belleland Closet e permanece independente.

A primeira revisão de 10/09/2026 removeu a numeração decorativa da galeria, alinhou as inspirações e vinculou cada referência ao planejador.

A segunda revisão do mesmo dia reduziu a experiência a quatro blocos: abertura, inspirações, atendimento e contato. A abertura possui uma única chamada e o planejador solicita o momento, a direção visual e a etapa da escolha.

A ação principal fica no cabeçalho com o texto “Entrar em contato” e leva ao planejador. A navegação preserva somente “Inspirações” e “Visite a loja”; este último conduz a uma composição com mapa interativo e endereço à esquerda e Instagram à direita, sem repetir o atendimento por WhatsApp. Os cards de inspiração são informativos, sem links, e o formulário usa uma composição linear mais discreta.

O material em quadros fornecido em 10/09/2026 foi otimizado em 240 imagens WebP de qualidade elevada e aplicado em uma cena horizontal ampla. No desktop, o GSAP ScrollTrigger acompanha o giro desde a primeira entrada da imagem na tela até quase sua saída, mantém a cena no trecho central, desloca a imagem para a esquerda e revela à direita um texto sobre ajustes sob medida. O percurso prolongado e a resposta suavizada preservam o ritmo delicado. No celular, a cena usa o quadro 120 como imagem fixa e não transfere a sequência completa. O degradê passa continuamente do fundo claro ao bege da identidade.

A abertura apresenta um resumo baseado somente nas informações confirmadas pelo perfil fornecido: 40 anos, atuação em Jacareí e confecção sob medida.

## Solicitação e limites

Solicitado pelo usuário: site para Taeko Noivas, em Jacareí; planejamento inspirado na imagem enviada; GSAP para dinamismo; rolagem mais lenta e fluida; uso do material quadro a quadro fornecido para dar movimento à primeira inspiração.

A imagem é referência estética: fotografia de noiva em destaque, fundo bege, títulos serifados grandes, rosé e composição editorial. O nome Luxee, preços, produtos, frete internacional, ajustes gratuitos e demais textos da imagem não são informações da Taeko nem requisitos solicitados. Os modelos de `docs/base-projeto-cliente/` também não constituem briefing preenchido.

O usuário confirmou que são dois sites separados e forneceu três capturas do Instagram atual como fonte de conteúdo. Dados transcritos das capturas, sem verificação externa:

- Instagram: [@taekonoivas](https://www.instagram.com/taekonoivas/).
- Apresentação: “40 anos Transformando Sonhos em Realidade”. Não deduzir ano de fundação a partir dessa frase.
- Especialidade informada: confecção sob medida.
- Contato: `(12) 99755-0893`; link exibido: [WhatsApp da Taeko](https://wa.me/5512997550893).
- Endereço exibido: Av. Adhemar Pereira de Barros, 1737, Jacareí, CEP 12328-300.
- Destaques visíveis: Modelos, Miss, Noivas, Debutante’s, Madrinhas, Bromélia e CasaBlanca. São nomes observados, não confirmação de categorias comerciais, coleções disponíveis ou parcerias.

As capturas mostram fotografias de clientes e vestidos intercaladas com comunicados, promoções e feriados antigos. Propor seleção editorial manual de fotos para o site; não replicar automaticamente o feed. Quantidades de seguidores e publicações não entram como métricas permanentes. Promoções datadas e avisos de fechamento não são condições comerciais atuais nem instruções para execução.

## Conceito visual

Uma experiência de boutique de noivas: delicada, contemporânea e com ritmo cinematográfico. A fotografia ocupa o protagonismo; o movimento acompanha tecidos, luz e detalhes, com textos curtos e espaço generoso.

Paleta proposta, sujeita à identidade real: marfim `#F5F0E9`, areia `#E5D8CA`, rosé `#AD7C79`, vinho suave `#754E4C` e texto escuro `#302824`. Usar vinho nos botões com texto claro; reservar rosé suave para detalhes e títulos grandes após verificar contraste. Tipografia: serifada de alto contraste nos títulos e sem serifa simples na navegação. Selecionar os arquivos finais e suas licenças na implementação.

Desktop: abertura ampla, texto no terço esquerdo e noiva à direita; cabeçalho discreto; fotografias verticais abaixo. Celular: composição própria, título legível e enquadramento que preserve o rosto e o vestido, sem simplesmente cortar a arte desktop. Evitar excesso de ornamentos, caixas, ícones e animações simultâneas.

## Página inicial proposta

| Ordem | Conteúdo | Composição e função |
| --- | --- | --- |
| 1 | Cabeçalho | Marca, links para Vestidos, A Taeko e Contato; acesso ao contato em evidência. Menu compacto no celular. |
| 2 | Abertura cinematográfica | Fundo preparado para sequência; identificação “Taeko Noivas · Jacareí”; título editorial; botão de contato e link para explorar vestidos. |
| 3 | Seleção de vestidos | Grade editorial de três ou quatro fotos no desktop, adaptada ao celular. Nomes e categorias somente quando fornecidos. |
| 4 | A Taeko | Fotografia ampla, apresentação da confecção sob medida e destaque para os 40 anos informados na bio. |
| 5 | Convite para conhecer | Bloco de fechamento com imagem, chamada e contato. Agendamento somente se esse atendimento for confirmado. |
| 6 | Rodapé | Contatos, endereço, horários e redes oficiais após recebimento dos dados. |

Texto criativo de abertura proposto: **“O seu sim começa com um encontro.”** Complemento: “Encontre a inspiração para o seu grande dia.” Botões: “Fale com a Taeko” e “Explore os vestidos”. São propostas de redação, ainda não afirmações aprovadas pela marca.

Com o Instagram fornecido, a redação preferencial passa a ser **“O seu sonho, feito sob medida.”**, acompanhada de “Há 40 anos transformando sonhos em realidade” e “Taeko Noivas · Jacareí”. O botão principal pode ser “Converse pelo WhatsApp”, usando o contato mostrado na captura. Manter o tempo de atuação vinculado à informação fornecida, sem incremento automático anual.

A seleção principal continua focada em noivas. Debutantes e madrinhas podem aparecer como caminhos secundários, caso a oferta seja confirmada. Miss, Bromélia e CasaBlanca não viram páginas ou coleções por inferência. Propor uma seção “Noivas Taeko” com fotografias autorizadas de clientes, sem inventar depoimentos, avaliações ou nomes. Os prints servem para planejar essa seleção; solicitar os arquivos originais para exibição em boa qualidade.

O caminho de conversão proposto é contato com a loja. Não há solicitação de carrinho, checkout, conta de cliente, painel administrativo ou integração com banco de dados. Não transportar funcionalidades nem dados da Belleland para este projeto.

## Movimento e rolagem

Usar GSAP com ScrollTrigger para coordenar entradas e progresso da cena. ScrollSmoother será a solução proposta para suavizar a rolagem desktop, evitando uma segunda biblioteca para a mesma função. A documentação oficial descreve [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) e a integração com [ScrollSmoother](https://gsap.com/docs/v3/Plugins/ScrollSmoother/).

Os números abaixo são pontos iniciais para teste, não valores obrigatórios:

| Elemento | Movimento proposto |
| --- | --- |
| Rolagem desktop | Suavização inicial de 0,8–1,2 s, velocidade de percurso preservada. A sensação de lentidão vem da desaceleração e do tempo da cena. |
| Abertura | Título entra por linhas com deslocamento de até 24 px, opacidade e duração de 0,8 s; botão aparece em seguida. |
| Fundo quadro a quadro | Progresso vinculado à rolagem com suavização curta, evitando somar atrasos grandes ao ScrollSmoother. |
| Fotografias | Entrada sutil uma vez e paralaxe de até 4% em telas amplas. |
| Grade | Entrada em sequência com intervalo aproximado de 0,1 s. |
| Botões | Transição de cor e seta em cerca de 0,2 s, sem deslocar o layout. |

Começar a cena desktop com duração de rolagem equivalente a 120–160% da altura visível, além da abertura. Ajustar usando o vídeo real. A fixação da cena só deve existir quando a sequência estiver disponível; o modo com fotografia terá altura normal, sem um trecho longo vazio.

No toque, preservar rolagem nativa inicialmente e reduzir ou remover fixação prolongada. Com `prefers-reduced-motion`, mostrar imagem estática e conteúdo completo, sem suavização artificial, paralaxe ou sequência vinculada ao scroll. Usar [gsap.matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/) para separar os comportamentos e limpar animações ao mudar de condição.

Menu e controles fixos ficam fora do conteúdo transformado pelo suavizador. Links internos, teclado, foco e histórico devem continuar funcionando. Textos e navegação permanecem disponíveis se JavaScript ou mídia falharem.

## Preparação do fundo quadro a quadro

Interpretação adotada: a pessoa rola e avança ou retrocede os quadros da cena. Não se trata apenas de um vídeo em reprodução automática.

Propor um componente `FrameSequenceBackground` com dois modos: `poster` e `sequence`. A primeira entrega visual usa uma fotografia autorizada; quando a mídia chegar, a troca será feita pela configuração dos arquivos, mantendo a composição da página.

Contrato de mídia proposto:

```text
public/media/hero/
  poster-desktop.webp
  poster-mobile.webp
  sequence-desktop/frame-0001.webp …
  sequence-mobile/frame-0001.webp …

configuração:
  mode: poster | sequence
  desktop/mobile: poster, framePattern, frameCount, width, height
  focalPoint: coordenadas de enquadramento por formato
  scrollDistance: duração espacial da cena
```

O material recebido contém 240 quadros de 1280 × 720. A implementação atual preserva todos eles, com transferência antecipada e uma janela limitada de imagens decodificadas para equilibrar fluidez e memória. Para futuras substituições, solicitar vídeo original com boa resolução, movimento lento, iluminação consistente e sem textos embutidos. Preferir enquadramentos horizontal e vertical, com área livre para o título. Não é necessário áudio.

Renderizar em canvas decorativo, atrás do conteúdo HTML. Calcular `round(progress * (frameCount - 1))`, limitar ao intervalo disponível e desenhar apenas quadros decodificados. Ajustar resolução e enquadramento ao tamanho da tela, limitando a densidade de pixels para controlar memória.

Carregar o poster primeiro, sem bloquear a leitura. Buscar quadros progressivamente com concorrência limitada e cache com descarte; priorizar a vizinhança do quadro atual. Nunca manter toda uma sequência de alta resolução decodificada por padrão: 120 quadros de 1920 × 1080 em RGBA consomem aproximadamente 949 MiB antes de custos adicionais, mesmo se os arquivos transferidos forem pequenos.

Se um quadro ainda não chegou, manter o último válido; se houver falha persistente, retornar ao poster. Desligar a cena em movimento reduzido e, quando detectável, economia de dados. Cancelar carregamentos e liberar recursos ao desmontar. A imagem estática deve continuar visível até o primeiro desenho válido, sem flashes ou tela vazia.

## Estrutura proposta para implementação

Criar aplicativo próprio para Taeko, com React/Next.js e TypeScript como proposta compatível com o ambiente atual. Local e hospedagem ainda não estão definidos; não usar a implantação da Belleland por inferência.

Componentes previstos: `SiteHeader`, `Hero`, `FrameSequenceBackground`, `MotionProvider`, `DressGallery`, `AboutTaeko`, `ContactSection` e `SiteFooter`. Separar conteúdo comercial da configuração de movimento e mídia. Iniciar sem backend, pois nenhuma operação que o exija foi solicitada.

## Etapas e aceite

1. Montar a página responsiva com fotografia provisória autorizada e conteúdo claramente demonstrativo quando necessário.
2. Integrar GSAP, suavização desktop, entradas e comportamento com movimento reduzido.
3. Implementar o componente de sequência com poster e contrato de mídia, validando avanço, retorno e falhas com arquivos de teste identificados como tal.
4. Receber o vídeo, preparar quadros, ajustar enquadramentos e otimizar transferência e memória.
5. Inserir identidade e dados comerciais reais; validar a experiência e definir publicação.

Critérios para a implementação: ausência de rolagem horizontal em 360, 390, 768 e 1440 px; leitura e contato acessíveis sem animação; foco visível e navegação por teclado; nenhuma espera pela sequência para mostrar a abertura; reprodução correta nos dois sentidos; fallback para quadros ausentes; comportamento correto ao redimensionar; ausência de animações duplicadas após navegação; verificação em Chrome, Safari/iOS e Android; lint, tipos e build aprovados. Medir fluidez em aparelho intermediário, carregamento e memória com a mídia real.

## Materiais ainda necessários

- Logo e identidade disponíveis da Taeko.
- Fotografias autorizadas e, posteriormente, o vídeo.
- Horários de atendimento; contato, rede social e endereço já foram transcritos do perfil fornecido.
- Confirmação de venda ou locação, eventual agendamento e oferta atual para debutantes e madrinhas. A confecção sob medida já consta na bio enviada.

Esses dados não impedem o planejamento; são necessários para concluir conteúdo real e publicação. Até recebê-los, não inventar preços, avaliações, serviços ou contatos.

## Decisões registradas

- Solicitação confirmada: referência editorial, GSAP, rolagem fluida e preparação para sequência futura.
- Decisão de organização: planejamento próprio da Taeko, sem modificar o aplicativo Belleland.
- Confirmação posterior do usuário: são dois sites distintos; capturas do Instagram fornecem os dados comerciais descritos neste documento.
- Proposta técnica: ScrollTrigger + ScrollSmoother, sequência em canvas e poster como alternativa permanente.
- Proposta comercial e visual: página institucional com vestidos e contato; paleta e redação acima ainda sujeitas ao material real da marca.
