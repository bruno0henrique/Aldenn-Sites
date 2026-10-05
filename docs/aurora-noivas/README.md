# Aurora Noivas — requisitos aprovados

Versão **0.2.1** · 2026-10-05 · Plano aprovado pelo usuário e implementado.

## Identidade e escopo

- Projeto independente em `aurora-noivas/`, rota `/demonstracao-aurora-noivas/` e marca integralmente fictícia Aurora Noivas.
- Paleta aprovada: rosé e ameixa, com base marfim. Sem identidade ou dados de lojas reais.
- Destaque inicial e maioria das modelos com pele mais escura e cabelo cacheado, preservando diversidade no conjunto.
- Página atual com abertura, vestidos de amostra, localização, planejador, fotografia editorial e contato. A ordem inicial com detalhes editoriais/processo foi substituída pela revisão aprovada em 0.2.0.
- Abas na ordem Noivas, Madrinhas, Debutantes e Gala, com três modelos ilustrativos em cada categoria e um único carrossel.
- Referência escolhida preenche a ocasião do planejador e entra na mensagem. Ao mudar a ocasião, a referência anterior é removida; clicar novamente na mesma ocasião a preserva.
- Nenhum preço, disponibilidade, avaliação ou tempo de atuação fictício apresentado como fato.

## Contatos e dados

WhatsApp Aldenn: `+55 12 99143-2188`. Instagram Aldenn: `@aldenn.com.br`. O texto da mensagem identifica a demonstração e solicita informações sobre um site para a loja do interessado.

Endereço ilustrativo: Rua Galvão Bueno, 100, Liberdade, São Paulo. O mapa mostra o bairro, sem marcador de uma suposta loja. O aviso de endereço fictício fica junto à localização.

As escolhas ficam somente na memória da página. Nenhum dado é enviado até a pessoa abrir o WhatsApp e enviar a mensagem por conta própria. O mapa externo é carregado sob demanda pelo navegador; fontes e fotografias são locais.

## Decisões aprovadas

- Usar apenas identidade fictícia e contatos da Aldenn.
- Organizar as amostras em abas, com Noivas selecionada inicialmente. Gala é a categoria de vestidos para festas sofisticadas.
- Adaptar o carrossel fornecido, manter o destaque central e a perspectiva, acrescentar teclado/toque e respeitar movimento reduzido.
- Preservar os projetos e alterações anteriores. Fontes recuperados do histórico, sem reverter exclusões preexistentes.
- Entrega local com commit, tag e push. Publicação pública não faz parte desta entrega.

## Materiais e validação

Prompts e procedência das imagens: `../../aurora-noivas/output/imagegen/manifest.json`. Verificações: [VALIDACAO.md](VALIDACAO.md). Histórico: `../../aurora-noivas/CHANGELOG.md`.

## Revisão aprovada — 0.2.0

Solicitação direta de 2026-10-05, com seis capturas de referência:

- Vestidos laterais clicáveis para ir ao centro; foto central também aplica a referência ao planejador. O botão preenchido “Usar como referência” é a ação principal.
- Setas suaves nos cantos inferiores da foto, sem numeração, com partes das fotografias vizinhas visíveis.
- Abas próximas, seleção ampliada, transição sequencial dos modelos e divisor simples entre categorias e amostras.
- Molduras sem arco, usando retângulos de cantos discretamente arredondados.
- Faixa superior “Feito pela Aldenn” e retorno ao site da Aldenn nas cores da demonstração.
- Mapa no lugar de “É nos detalhes”; removida a repetição do mapa no contato.
- Estudo de vestido 3D no lugar da antiga foto do processo e textos longos. Cena procedural sob demanda, sem rotação automática, com controles de giro e alternativa SVG.
- Texto lateral reduzido ao título, instrução curta e ação de retorno às referências.

Essas decisões substituem o bloco editorial e o processo textual da versão 0.1.0; identidade, categorias, canais e comportamento do planejador permanecem aprovados.

## Correção de desempenho — 0.2.1

Em 2026-10-05, o usuário relatou travadas e depois solicitou explicitamente a retirada temporária do modelo 3D. Essa solicitação substitui a decisão de usar a cena 3D em 0.2.0.

- Fotografia de cetim no lugar da cena, sem moldura em arco e sem ampliar o texto lateral.
- Navegação “Inspire-se” no lugar de “Explore em 3D”.
- Rolagem nativa, sem transladar a página inteira; animações pontuais de entrada preservadas.
- Sem desfoque animado das fotos ou filtros sobre o conteúdo em movimento.
- Identidade, categorias e seleção de referência/planejador preservados.
- Cena anterior disponível no histórico; sem Three.js ou canvas na versão atual.
