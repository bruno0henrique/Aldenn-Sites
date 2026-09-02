# Histórico de versões

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
