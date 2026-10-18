# Validação · 0.1.0 · 18/10/2026

- Ambiente: Windows, Node.js, servidor local em 127.0.0.1:5187.
- Integridade: 77 arquivos de `dist/` comparados byte a byte com o checkout do Sites, todos idênticos.
- `npm run check`: sintaxe da landing page, demonstração e servidor aprovada.
- HTTP: página principal e `/demo/` retornaram 200; todos os 77 arquivos retornaram 200; caminho inexistente retornou 404.
- Busca por formatos comuns de chaves privadas/tokens nos arquivos importados: nenhuma ocorrência. Configuração e credencial do repositório Sites excluídas da importação.
- `git diff --check`: sem erros de whitespace.
- Visual e interações não passaram por teste automatizado em navegador nesta entrega; arquivos visuais preservados integralmente.
- Não houve publicação externa, alteração de acesso do Sites ou edição do portfólio institucional.
