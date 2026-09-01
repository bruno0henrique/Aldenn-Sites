# Histórico de versões

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
- Sincronizador manual do Instagram por `#bellelandproduto`.
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
