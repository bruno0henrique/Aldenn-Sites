# Requisitos aprovados: Belleland Closet

Versão: 0.4.0

- Site mobile-first de catálogo de roupas, sem checkout ou venda no site.
- Visual claro, criativo e fiel às referências da Belleland.
- Paleta principal: `#F8E8A6`, `#E73F8C`, `#7B4F3F`, `#F7F1EA`.
- Fontes: Playfair Display para títulos e Instrument Sans para interface e textos.
- Produtos abrem em página própria e são reservados pelo WhatsApp `(12) 98107-3663`.
- A mensagem de reserva inclui nome, preço e link público da peça. O WhatsApp usa a prévia do link; não há anexo automático.
- Instagram `@bellelandcloset` é fonte de captura manual. Apenas posts com `#bellelandproduto` entram na fila.
- Um post representa um produto; imagens de carrossel representam fotos da mesma peça.
- Não usar produtos fictícios. Sem itens publicados, exibir “Em breve, novos produtos”.
- Proprietária entra com e-mail e senha via Supabase e revisa capturas antes de publicar.
- Enquanto o site estiver em avaliação privada, o painel oferece modo demonstração sem login e sem acesso aos dados reais.
- O modo demonstração permite testar revisão, edição, descarte, restauração e publicação com dados locais descartáveis.
- A tela permite criar conta por e-mail no Supabase. Novas contas não recebem permissão de proprietária automaticamente.
- A publicação exige nome, preço maior que zero e exatamente uma foto principal.
- Publicação é otimista e transacional; falha devolve a peça para revisão.
- Login Google e contas de clientes ficam para uma etapa futura.
- GSAP apenas em detalhes visuais e com respeito a `prefers-reduced-motion`.

Os formulários originais contêm dados pessoais e não são versionados. Este documento registra somente requisitos necessários ao produto.
