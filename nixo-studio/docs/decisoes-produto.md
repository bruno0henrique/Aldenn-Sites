# Decisões do Nixo Studio

## Aprovado em 18/10/2026

- Pedido do titular: levar o site existente ao Git para permitir publicação e inclusão no portfólio da Aldenn.
- Preservar a referência visual e as interações do Sites versão 21. Não reconstruir o aplicativo Nixo.
- Importar em `nixo-studio/`, projeto independente no repositório Aldenn-Sites.

## Implementado

- Site estático e demonstração com arquivos locais, sem servidor de aplicação, banco, automações ou arquivos enviados por usuários.
- Visitante explora conteúdo e demonstração. Não há papéis administrativos neste código; acesso do Sites é controle da hospedagem original.
- Prévia depende de Node.js; site publicado requer apenas hospedagem estática. Fontes externas dependem do Google Fonts.
- Sem credenciais incluídas. Estado da demonstração permanece no navegador de cada visitante; não usar dados sensíveis.

## Pendente de definição antes da publicação

- Domínio/rota de destino e projeto institucional que receberá o item de portfólio.
- Hospedagem e orçamento: nenhum novo serviço contratado nesta entrega.
- Publicação externa torna os arquivos acessíveis conforme as regras da hospedagem escolhida; revisar as capturas antes de expor publicamente.

## Proposta para a etapa seguinte

Reaproveitar `dist/` em hospedagem estática existente, mantendo a demonstração em `demo/`. Não exige banco nem executor e reduz manutenção. Validar rotas, navegação, imagens e celular no destino; manter o commit anterior para reversão. Inclusão no portfólio depende do código institucional correto e do endereço final aprovado.
