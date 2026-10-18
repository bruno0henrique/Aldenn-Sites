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

## Atualização aprovada em 18/10/2026

- O titular autorizou publicação e inclusão no portfólio. Destino definido: `https://www.aldenn.com.br/nixo`, com demonstração em `/nixo/demo`.
- Hospedagem: Vercel já usada pelo institucional, sem novo serviço contratado, mudança de DNS, banco ou login.
- Integração em `bruno0henrique/aldenn`, branch `codex/nixo-portfolio`, versão 0.65.0: card na galeria, menu Apps, faixa demonstrativa, fontes locais e caminhos adaptados à subpasta. Documentação de implantação e rollback em `docs/NIXO.md` desse repositório.

## Fonte e exportação institucional

`dist/` permanece a importação original do Sites. A exportação adaptada para o domínio está em `public/nixo/` no repositório institucional, commit `3e37e5a`. Atualizações futuras devem preservar as bases `/nixo/` e `/nixo/demo/`, fontes locais, aviso de demonstração e a política de segurança. Sem banco ou executor. O Sites original e o aplicativo Nixo permanecem independentes.
