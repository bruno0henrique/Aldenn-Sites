# Validação · 0.1.0 · 18/10/2026

- Ambiente: Windows, Node.js, servidor local em 127.0.0.1:5187.
- Integridade: 77 arquivos de `dist/` comparados byte a byte com o checkout do Sites, todos idênticos.
- `npm run check`: sintaxe da landing page, demonstração e servidor aprovada.
- HTTP: página principal e `/demo/` retornaram 200; todos os 77 arquivos retornaram 200; caminho inexistente retornou 404.
- Busca por formatos comuns de chaves privadas/tokens nos arquivos importados: nenhuma ocorrência. Configuração e credencial do repositório Sites excluídas da importação.
- `git diff --check`: sem erros de whitespace.
- Visual e interações não passaram por teste automatizado em navegador nesta entrega; arquivos visuais preservados integralmente.
- Não houve publicação externa, alteração de acesso do Sites ou edição do portfólio institucional.

## Continuidade: publicação institucional em 18/10/2026

Após autorização do titular, a Aldenn 0.65.0 publicou a exportação adaptada em `https://www.aldenn.com.br/nixo` e `/nixo/demo`, com card no portfólio e menu Apps. Deploy Vercel `dpl_DwiTiYrcbk9cExpmJytp4hhAw98X`, commit institucional `3e37e5a`. Tipos, build e lint dos arquivos alterados aprovados; duas rotas e 95 arquivos confirmados com HTTP 200 em produção. Navegação pelo card e imagens conferidas no navegador; teste local em 390 e 1440 px. O acesso do Sites original foi preservado. O registro anterior descreve somente a importação inicial, antes desta publicação.
