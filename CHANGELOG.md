# Histórico de versões

## [0.45.0] - 2026-09-12

### Alterado

- Vitrine de ocasiões transformada em carrossel com setas, indicador e navegação por toque.
- Fotografias de noivas, debutantes e madrinhas refeitas com modelos e ambientes distintos; duas cenas ganharam sorrisos naturais.
- Seção sobre o processo recebeu uma paleta clara em bege mineral para uma apresentação mais leve e sofisticada.

## [0.44.0] - 2026-09-11

### Adicionado

- Vitrine editorial de noivas, debutantes e madrinhas, com seleção automática da ocasião no formulário.
- Seção sobre conversa, provas, ajustes e entrega para explicar o trabalho sob medida.

### Alterado

- Área de visita redesenhada com mapa amplo, endereço sobreposto e cartão independente para o Instagram.
- Navegação atualizada para representar opções, processo e localização.

## [0.43.0] - 2026-09-11

### Alterado

- Cena quadro a quadro da Taeko substituída por fotografia editorial estática para eliminar flickers.
- Imagens exclusivas para desktop e celular destacam renda, bordado e acabamento do vestido.
- Entrada da cena reduzida a uma transição GSAP curta, sem pinagem ou progresso ligado à rolagem.

### Performance

- A página deixou de solicitar os 240 quadros durante a navegação.

## [0.42.0] - 2026-09-11

### Alterado

- Sequência da noiva reprocessada a partir dos PNGs originais em WebP de qualidade 95.
- Cena desktop limitada a 65% da largura e aos 1280 × 720 px originais, sem zoom adicional.
- Canvas deixou de criar uma superfície maior que o quadro disponível.
- Bordas da mídia e passagem para o atendimento receberam transições suaves.

### Adicionado

- Script reproduzível para processar e validar os 240 quadros da noiva.

## [0.41.0] - 2026-09-10

### Alterado

- Botão do Instagram passou a usar a paleta neutra do site no estado inicial.
- Gradiente do Instagram agora sobe apenas no hover, foco ou toque.

## [0.40.0] - 2026-09-10

### Alterado

- Conteúdo da coluna de redes sociais centralizado em todas as telas.
- Link simples substituído por botão animado com ícone e gradiente do Instagram.

## [0.39.0] - 2026-09-10

### Alterado

- Área de visita passou a exibir o mapa interativo diretamente na coluna de endereço.
- Coluna direita ficou dedicada às redes sociais, com acesso destacado ao Instagram.
- No celular, mapa, endereço e redes sociais são apresentados em sequência vertical.

## [0.38.0] - 2026-09-10

### Alterado

- Cabeçalho simplificado para inspirações, visita à loja e ação principal de contato, eliminando destinos redundantes.
- Regra que ocultava isoladamente um item de navegação em tablets foi removida.
- Bloco final passou a orientar uma visita, com rota e Instagram em vez de repetir o atendimento por WhatsApp.

## [0.37.0] - 2026-09-10

### Alterado

- Modelo deslocada mais à esquerda durante a sequência para manter o texto livre.
- Celulares passaram a exibir o quadro 120 como composição estática, sem carregar ou reproduzir a sequência.
- Enquadramento da abertura no celular foi reposicionado discretamente para revelar melhor o rosto da modelo.

## [0.36.0] - 2026-09-10

### Alterado

- Sequência da noiva passou a responder desde a primeira entrada na tela até quase sua saída, com percurso mais longo e suavização mais delicada.
- Planejador ganhou a etapa da escolha e uma direção visual adicional, incluindo os novos dados na mensagem pronta do WhatsApp.

## [0.35.0] - 2026-09-10

### Alterado

- Sequência reconstruída com os 240 quadros originais em WebP de qualidade elevada, sem descarte de quadros intermediários.
- Carregador passou a antecipar a transferência da sequência e manter uma janela maior de quadros decodificados para eliminar pausas e saltos durante a rolagem.
- Degradê da cena ficou contínuo, partindo do fundo claro e chegando ao bege da identidade sem divisões visíveis.
- Abertura ganhou uma apresentação curta sobre os 40 anos e a confecção sob medida da Taeko em Jacareí.

## [0.34.0] - 2026-09-10

### Alterado

- Sequência do vestido removida do card e ampliada para uma cena horizontal com percurso prolongado.
- GSAP mantém a cena visível, desloca o vídeo para a esquerda e revela gradualmente um texto sobre ajustes.
- Degradê rosé surge durante a transição para preservar a leitura sem esconder o movimento do vestido.

## [0.33.0] - 2026-09-10

### Adicionado

- Primeira inspiração transformada em uma sequência de 120 quadros controlada pela rolagem com GSAP ScrollTrigger.
- Quadros convertidos para WebP e carregados progressivamente, com aproximadamente 1,1 MB no conjunto completo.
- Imagem estática preservada como alternativa para redução de movimento, economia de dados ou falha de mídia.

## [0.32.0] - 2026-09-10

### Alterado

- Área de atendimento ganhou fundo rosé próprio e maior separação visual das demais seções.
- Formulário passou a ocupar um painel claro com bordas arredondadas, sombra suave e espaçamento revisado.

## [0.31.0] - 2026-09-10

### Alterado

- Botões receberam formato arredondado, relevo e preenchimento animado baseado na referência enviada.
- Cores do efeito adaptadas para a paleta rosé e vinho da Taeko.
- Estados selecionados do formulário ganharam destaque preenchido em desktop e celular.

## [0.30.0] - 2026-09-10

### Alterado

- Identificação da abertura alterada para “Vestidos sob medida · Jacareí”.
- Traço decorativo removido da abertura.

## [0.29.0] - 2026-09-10

### Alterado

- A ação “Entrar em contato” foi movida para o cabeçalho e passa a levar ao formulário interno.
- Formulário recebeu composição mais discreta, campos lineares e textos mais naturais.
- Cards de inspiração ficaram sem links ou setas e receberam descrições mais objetivas.

## [0.28.0] - 2026-09-10

### Alterado

- Demonstração da Taeko reduzida aos blocos essenciais: abertura, inspirações, atendimento e contato.
- Abertura simplificada para uma única ação, sem setas ou chamadas concorrentes.
- Planejador reduzido para duas escolhas antes de preparar a mensagem de WhatsApp.

## [0.27.0] - 2026-09-10

### Alterado

- Galeria editorial reorganizada em uma grade alinhada, sem numeração decorativa e com caminhos úteis para o atendimento.
- Landing page ampliada com explicação do atendimento, planejador de preferências, mensagem pronta para WhatsApp e contatos completos.
- Navegação, tipografia e comportamento responsivo revisados para desktop e celular.

## [0.26.0] - 2026-09-09

### Adicionado

- Site independente da Taeko Noivas com direção editorial, contatos fornecidos, GSAP e rolagem suave em telas adequadas.
- Estrutura de fundo preparada para receber uma sequência quadro a quadro controlada pela rolagem, com poster e comportamento alternativo.
- Imagens editoriais ilustrativas identificadas na interface, aguardando os arquivos oficiais da Taeko.

### Publicado

- Demonstração em `https://aldenn.com.br/demonstracao-taeko` por meio do repositório institucional da Aldenn.

## [0.25.1] - 2026-09-09

### Corrigido

- Produtos aprovados voltam a aparecer para visitantes sem login.
- Uma falha na configuração opcional de Novidades não esvazia mais o catálogo público.

## [0.25.0] - 2026-09-05

### Adicionado

- Carrossel de chegada circular com o destaque central e prévias laterais do item anterior e seguinte.
- Setas, navegação por toque e degradês laterais fortes para conduzir visualmente a passagem entre os slides.

### Alterado

- O First Drop permanece como slide fixo mesmo quando existem destaques cadastrados na Vitrine.
- Fotografias de destaque priorizam o topo da imagem para preservar o rosto e o painel recomenda o formato horizontal de 1600 × 900 px sem restringir outros tamanhos.

## [0.24.1] - 2026-09-05

### Alterado

- O destino dos botões do carrossel de chegada passou a usar seleção guiada por coleção ou por categoria e peça.
- Links já cadastrados são reconhecidos ao editar e links personalizados continuam disponíveis para casos especiais.

## [0.24.0] - 2026-09-04

### Adicionado

- Carrossel de chegada preparado para receber peças publicadas ou artes livres de promoções, campanhas e modelos.
- Gestão manual do carrossel de Novidades, com seleção, ordem, visibilidade e remoção de produtos.

### Alterado

- A área Vitrine centraliza os dois carrosséis e as opções de produtos exibidas no menu lateral.
- Slides da chegada aceitam chamada, título, texto e botão editáveis.
- Sem seleção manual em Novidades, o site continua usando automaticamente os produtos mais recentes.

## [0.23.2] - 2026-09-04

### Alterado

- Página Sobre simplificada para duas áreas de texto, sem caixas auxiliares.
- A proposta da Belleland ganhou uma explicação mais natural e direta.

## [0.23.1] - 2026-09-04

### Corrigido

- Rodapé redesenhado com rosa suave, melhor proporção tipográfica e organização mais leve.
- Páginas curtas agora mantêm o rodapé no final da tela, sem faixa vazia abaixo.

## [0.23.0] - 2026-09-04

### Adicionado

- Página Sobre dedicada, com apresentação da Belleland e explicação do processo de consulta e reserva.

### Alterado

- Rodapé reduzido para uma faixa compacta na cor rosa da marca.
- Sobre, Contato, Ajuda e conta foram reorganizados com contraste e ícones menores.
- O ícone de conta passou para a direita do texto.

## [0.22.0] - 2026-09-04

### Adicionado

- Pesquisa dedicada por nome, categoria e descrição, acessível pelo cabeçalho e pelo menu.
- Rodapé amplo com áreas de Sobre, Contato e Ajuda acompanhadas por ícones.

### Alterado

- Hero First Drop e Novidades ficam ocultos também durante a pesquisa.
- O estado sem resultados informa a busca realizada e sugere uma nova consulta.

## [0.21.0] - 2026-09-03

### Alterado

- Hero First Drop e Novidades agora são exclusivos da tela principal.
- Filtros e categorias do menu abrem diretamente a coleção, sem repetir os destaques da chegada.
- O carrossel de Novidades passou a funcionar em loop e embaralhar os produtos a cada carregamento.

## [0.20.3] - 2026-09-03

### Corrigido

- Ajustado o espaçamento entre o valor inteiro e a parte decimal do preço em Novidades.

## [0.20.2] - 2026-09-03

### Alterado

- A imagem de cada novidade ganhou mais largura e presença logo na entrada do catálogo.
- A parte inteira do preço ficou maior e mais compacta.
- Os centavos agora aparecem abaixo e mais próximos do valor principal.
- A seção administrativa Curadoria passou a se chamar Revisões.

## [0.20.1] - 2026-09-03

### Corrigido

- O carrossel de Novidades agora exibe somente a fotografia e o preço sobre o terço inferior da imagem.
- Borda, fundo, nome da peça e preço anterior foram removidos para preservar o foco visual.
- O degradê passa de forte na base a transparente, com arredondamento discreto e preço de traço fino.

## [0.20.0] - 2026-09-03

### Alterado

- Os cards do carrossel de Novidades agora priorizam a fotografia em formato editorial.
- Nome e preço aparecem em branco sobre uma vinheta escura na base da imagem.
- A parte inteira do preço ganhou destaque e os centavos passaram a ser exibidos em tamanho menor.

## [0.19.0] - 2026-09-03

### Alterado

- O carrossel de novidades agora aparece antes do filtro de produtos.
- O filtro controla uma única grade de coleção logo abaixo do seletor.
- A vitrine móvel passa a mostrar duas peças por linha, com imagens e cards mais compactos.
- O atalho Novidades do menu leva diretamente ao carrossel correspondente.

## [0.18.0] - 2026-09-03

### Alterado

- A análise por imagem agora classifica o produto antes de sugerir os dados.
- Somente peças de roupa claramente identificáveis são aceitas no preenchimento automático.
- Nome, preço, tamanho, cor e descrição seguem regras mais estritas de evidência visual.

### Segurança

- Itens fora do catálogo e imagens incertas são recusados sem alterar os campos do formulário.
- Textos de interface, comentários e possíveis instruções dentro da imagem são tratados apenas como conteúdo visual.

## [0.17.0] - 2026-09-03

### Alterado

- Preenchimento automático por imagem migrou do Gemini para a Responses API da OpenAI.
- `gpt-5-nano` definido como modelo visual padrão para priorizar o menor custo.
- O modelo pode ser trocado por `OPENAI_VISION_MODEL` sem alteração no código.

### Segurança

- `OPENAI_API_KEY` permanece exclusiva do servidor e as respostas não são armazenadas pela API.

## [0.16.0] - 2026-09-02

### Adicionado

- Cadastro manual com até 6 fotos por produto.
- Escolha da foto principal, prévias e remoção antes do envio para aprovação.

### Alterado

- O preenchimento automático usa a foto marcada como principal.
- Fotos adicionais seguem como secundárias para a revisão e a galeria publicada.

## [0.15.1] - 2026-09-02

### Alterado

- A seção Produtos do menu lateral agora inicia recolhida.
- Abertura e recolhimento das categorias receberam uma transição sutil e acessível.

## [0.15.0] - 2026-09-02

### Alterado

- Cadastro assistido reorganizado em seis caixas alinhadas para nome, categoria, preço, promoção, imagem e descrição.
- Envio da imagem ganhou uma área visual com prévia e acesso direto ao preenchimento automático.

## [0.14.1] - 2026-09-02

### Corrigido

- Invalidação do arquivo de estilos da produção para carregar corretamente o menu lateral e a área Vitrine.
- Isolamento visual do painel lateral para manter largura, espaçamento e alinhamento em tablets.

## [0.14.0] - 2026-09-02

### Adicionado

- Menu lateral completo com produtos, categorias, conta, áreas administrativas e canais de contato.
- Carrosséis horizontais para novidades e categorias, com navegação mobile e desktop.
- Banners rotativos vinculados somente a produtos publicados e suas fotos reais.
- Área Vitrine no painel para organizar categorias e banners da página inicial.
- Categorias administráveis com ativação, renomeação e ordenação.
- Migração Supabase com RLS, auditoria, índices e importação das categorias existentes.

### Alterado

- Blocos de categorias do meio da página substituídos por um filtro compacto.
- Cadastro, revisão, produtos publicados e Gemini passam a usar somente categorias ativas.
- Gemini retorna uma categoria válida da vitrine ou deixa o campo vazio para revisão.

### Segurança

- Visitantes leem somente categorias e banners ativos ligados a produtos publicados.
- Somente proprietária e administradores podem alterar a organização da vitrine.

## [0.13.0] - 2026-09-02

### Adicionado

- Bloco compacto de contato na página inicial com Instagram e WhatsApp da Belleland.
- A estrutura visual permite incluir o e-mail profissional quando o endereço for definido.

## [0.12.4] - 2026-09-02

### Alterado

- Bloco “Made with love” removido da página inicial para reduzir informação visual.

## [0.12.3] - 2026-09-02

### Alterado

- A prévia da imagem permanece em destaque e o botão de preenchimento automático fica ao lado dela em telas amplas.
- Textos do cadastro assistido simplificados para apresentar a sugestão automática sem citar o provedor técnico.

## [0.12.2] - 2026-09-02

### Alterado

- Campos de uma linha no cadastro assistido ficaram mais compactos, incluindo o seletor de foto.

## [0.12.1] - 2026-09-02

### Alterado

- Logo principal substituída pelo novo SVG fornecido pela cliente.
- Prancheta do SVG ajustada para manter a marca legível nos cabeçalhos mobile e desktop.

## [0.12.0] - 2026-09-02

### Alterado

- Análise visual migrada da OpenAI para o Google Gemini 2.5 Flash.
- Botão, avisos e variáveis de ambiente atualizados para o novo provedor.
- Raciocínio adicional do Gemini desativado nessa extração para reduzir custo e latência.

### Segurança

- `GEMINI_API_KEY` permanece exclusiva do servidor.
- Resposta estruturada continua validada antes de preencher o formulário.
- Uso de dados do plano gratuito documentado para evitar envio de conteúdo pessoal desnecessário.

## [0.11.0] - 2026-09-02

### Adicionado

- Análise visual sob demanda no cadastro por imagem com OpenAI Responses API.
- Sugestões estruturadas de nome, categoria, cor, tamanho, preço e descrição.
- Prévia compacta da imagem e retorno de confiança ou alertas antes da revisão.

### Segurança

- Rota exclusiva para proprietária e administradores com validação da sessão no servidor.
- Chave OpenAI restrita ao servidor, imagens limitadas por formato e tamanho, cache desativado e armazenamento da resposta desabilitado.

### Alterado

- Cadastro manual apresentado como cadastro assistido por imagem, mantendo edição total e publicação separada.

## [0.10.1] - 2026-09-01

### Corrigido

- Revisão e produtos publicados agora começam por uma grade de miniaturas proporcionais.
- Editor completo abre somente após a escolha da peça e permite voltar à lista.
- Logo usa o rosa oficial diretamente no SVG, sem filtro de cor variável no mobile.

## [0.10.0] - 2026-09-01

### Adicionado

- Botão Atualizar conectado ao scraper hospedado e protegido pela sessão administrativa.
- Novas publicações do Instagram entram na fila e todos os cards pendentes aparecem para revisão.
- Retorno visual de busca, sucesso, ausência de novidades e bloqueio temporário do Instagram.

### Alterado

- Captura do Instagram não exige mais hashtag nas publicações.
- Sincronização processa até 12 novos posts por execução para respeitar o tempo da função hospedada.

### Segurança

- O scraper valida a sessão Supabase e o papel administrativo antes de ler ou gravar dados.
- A função hospedada usa RLS e não recebe service role nem credencial da Meta.

## [0.9.0] - 2026-09-01

### Adicionado

- Preço promocional opcional no cadastro, na revisão e em produtos publicados.
- Cards de administração para editar nome, categoria, descrição e preços após a publicação.
- Exclusão definitiva de capturas em revisão e retirada recuperável de produtos publicados.
- Exibição de preço normal e promocional no catálogo e na página da peça.

### Segurança

- Migração com validação de preço promocional e funções administrativas protegidas por `is_staff()`.
- Políticas RLS de produtos e mídias separadas por operação e sem sobreposições de leitura.

## [0.8.0] - 2026-09-01

### Adicionado

- Categorias da página inicial agora filtram a coleção publicada.
- Categorias vazias exibem uma mensagem contextual sobre próximas novidades.
- Favicon, ícone para dispositivos Apple e imagem oficial de compartilhamento.
- Metadados Open Graph e Twitter Card para prévias de links e WhatsApp.

### Alterado

- Arte abstrata removida do hero em telas mobile.
- Categoria selecionada recebe destaque visual e pode ser desmarcada com um novo clique.

## [0.7.0] - 2026-09-01

### Alterado

- Hero de tablet e desktop centralizado em um painel maior, arredondado e responsivo.
- Arte abstrata passou a ocupar todo o fundo com tratamento de cor integrado ao painel principal.
- Título, texto e ações ganharam maior presença visual em telas amplas.

## [0.6.2] - 2026-09-01

### Alterado

- Espaçamentos verticais entre hero, categorias, coleção e blocos finais ficaram mais compactos no mobile.
- Grade de produtos recebeu menor distância entre os cards em telas pequenas.

## [0.6.1] - 2026-09-01

### Alterado

- Faixa abstrata entre a abertura e as categorias ficou mais compacta no mobile.
- Todos os itens do menu principal agora possuem ícones consistentes.

## [0.6.0] - 2026-09-01

### Adicionado

- Área de conta com nome, telefone, preferência promocional e encerramento de sessão.
- Papel de administrador com acesso às aprovações, mantendo uma única proprietária.
- Cadastro manual de peça com foto e envio para a fila de revisão.
- Item `Aprovações` no menu para contas autorizadas.

### Corrigido

- Confirmação de e-mail direcionada ao domínio ativo do site.
- Sessão autenticada refletida no menu e no rodapé.
- Aviso de conta conectada convertido em notificação temporária com fechamento manual.
- Abertura e fechamento do menu receberam animação GSAP com redução de movimento.
- Aplicação migrada para execução direta na Vercel, removendo o redirecionamento para o ambiente privado.
- URL principal do Supabase alterada para o domínio estável da Vercel.

## [0.5.1] - 2026-09-01

### Corrigido

- Endereços antigos da Vercel agora redirecionam para o domínio ativo da Belleland.

## [0.5.0] - 2026-09-01

### Adicionado

- Conexão do site com o projeto Supabase da Belleland.
- Cadastro e login para contas comuns, com redirecionamento separado da proprietária.
- Consentimento promocional e perfil persistido automaticamente no banco.
- Sessões em cookies com `@supabase/ssr` e atualização no proxy.

### Segurança

- RLS aplicada aos perfis de clientes.
- Banco limitado a uma única conta proprietária.
- Permissões públicas removidas da função interna de ativação automática de RLS.

## [0.4.0] - 2026-09-01

### Adicionado

- Fluxo funcional de demonstração com captura local editável, publicação, descarte e restauração.
- Criação de conta por e-mail e senha via Supabase Auth.

### Segurança

- Novas contas permanecem sem acesso de proprietária até a liberação manual em `staff_members`.
- O modo demonstração continua isolado do Supabase e não altera dados reais.

## [0.3.2] - 2026-09-01

### Alterado

- Removido o caractere de travessão de todo o conteúdo versionado do projeto.

## [0.3.1] - 2026-09-01

### Alterado

- Substituída a arte do hero pela nova composição abstrata rosa enviada pela cliente.
- Removidos filtros e brilhos sobrepostos para preservar a imagem original.

## [0.3.0] - 2026-09-01

### Adicionado

- Mockup funcional e responsivo da Belleland Closet, fiel à identidade aprovada.
- Catálogo público, página individual de produto e reserva pelo WhatsApp.
- Login Supabase por e-mail e senha para a proprietária.
- Painel de curadoria com revisão de imagens, edição, preço, publicação otimista e restauração.
- Modo demonstração sem login e sem acesso aos dados reais, disponível no site privado para avaliação do painel.
- Migração PostgreSQL com RLS, Storage, auditoria e publicação transacional.
- Sincronizador manual inicial do Instagram por marcação nas legendas.
- Animações GSAP acessíveis e microinterações inspiradas no Uiverse.

### Segurança

- Service role isolada do navegador e autorização da proprietária por tabela protegida.
- Catálogo público limitado a produtos publicados.

## [0.2.0] - 2026-08-31

### Adicionado

- Base documental para projetos de clientes em `docs/base-projeto-cliente/`.
- Orientação para revisar a base antes de novas criações e implementações.

## [0.1.0] - 2026-08-31

### Adicionado

- Inicialização do repositório.
