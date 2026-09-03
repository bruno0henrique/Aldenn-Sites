# Requisitos aprovados: Belleland Closet

Versão: 0.14.1

- Site mobile-first de catálogo de roupas, sem checkout ou venda no site.
- Visual claro, criativo e fiel às referências da Belleland.
- A marca principal usa o SVG enviado pela cliente em 2026-09-02, preservado como vetor e com a prancheta ajustada para os cabeçalhos.
- Paleta principal: `#F8E8A6`, `#E73F8C`, `#7B4F3F`, `#F7F1EA`.
- Fontes: Playfair Display para títulos e Instrument Sans para interface e textos.
- Produtos abrem em página própria e são reservados pelo WhatsApp `(12) 98107-3663`.
- A página inicial apresenta um bloco compacto com Instagram `@bellelandcloset` e WhatsApp `(12) 98107-3663`; o e-mail será incluído após a definição do endereço profissional.
- O menu principal ocupa a lateral e apresenta início, First Drop, produtos por categoria, conta, áreas administrativas autorizadas, Instagram e WhatsApp.
- A página inicial usa um filtro compacto e carrosséis horizontais para novidades e categorias com produtos publicados.
- Banners da abertura são vinculados a produtos publicados e usam uma foto real da peça; sem banners ativos, a abertura padrão permanece.
- A área Vitrine permite criar, renomear, ordenar, ativar e ocultar categorias, além de organizar banners.
- `Novidades` é uma seleção automática dos produtos mais recentes e não é uma categoria editável.
- A mensagem de reserva inclui nome, preço e link público da peça. O WhatsApp usa a prévia do link; não há anexo automático.
- Instagram `@bellelandcloset` é fonte de captura sob demanda. Ao clicar em Atualizar, publicações ainda não registradas entram na fila, sem exigir hashtag.
- Um post representa um produto; imagens de carrossel representam fotos da mesma peça.
- Não usar produtos fictícios. Sem itens publicados, exibir “Em breve, novos produtos”.
- Proprietária e administradores entram com e-mail e senha via Supabase e revisam capturas antes de publicar.
- Enquanto o site estiver em avaliação privada, o painel oferece modo demonstração sem login e sem acesso aos dados reais.
- O modo demonstração permite testar revisão, edição, descarte, restauração e publicação com dados locais descartáveis.
- A tela permite criar conta por e-mail no Supabase. Novas contas não recebem permissão de proprietária automaticamente.
- Qualquer visitante pode criar conta e entrar. Somente uma conta pode ser proprietária, mas outras contas podem receber o papel de administradora em `staff_members`.
- Contas autenticadas possuem área própria para nome, telefone e preferência de comunicações promocionais.
- O menu exibe `Aprovações` apenas para proprietária e administradores.
- A área de aprovações permite revisar capturas, editar seus dados e cadastrar uma peça manualmente com foto.
- No cadastro por imagem, a administradora pode solicitar ao Gemini sugestões de nome, categoria, cor, tamanho, preço e descrição.
- A sugestão de categoria do Gemini deve corresponder exatamente a uma categoria ativa ou permanecer vazia para revisão.
- A análise por Gemini acontece somente após ação explícita, não publica automaticamente e mantém todos os campos editáveis.
- A revisão e a gestão de publicados começam por miniaturas proporcionais; o formulário completo abre somente após escolher uma peça.
- Capturas em revisão podem ser editadas, precificadas, colocadas em promoção, ignoradas ou excluídas.
- Produtos publicados podem ser editados, receber ou perder promoção e ser retirados do site.
- Ao retirar um produto publicado, sua captura original vai para Ignorados e pode ser restaurada.
- O cadastro promocional exige consentimento explícito para receber novidades, promoções e lançamentos por e-mail.
- A publicação exige nome, preço maior que zero e exatamente uma foto principal. Quando houver promoção, o preço promocional deve ser menor que o normal.
- Publicação é otimista e transacional; falha devolve a peça para revisão.
- Login Google fica para uma etapa futura.
- GSAP apenas em detalhes visuais e com respeito a `prefers-reduced-motion`.

Os formulários originais contêm dados pessoais e não são versionados. Este documento registra somente requisitos necessários ao produto.
