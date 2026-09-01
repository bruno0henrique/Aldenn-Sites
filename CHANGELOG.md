# Histórico de versões

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
