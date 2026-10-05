# Validação — Aurora Noivas 0.1.0

Data: 2026-10-05. Aplicativo Next.js com exportação estática; prévia em `/demonstracao-aurora-noivas/`.

- Nove testes unitários: categorias/arquivos, destinatário e mensagem, referência válida/incompatível, escolhas incompletas, data opcional/inválida, navegação circular e infraestrutura de sequência preservada.
- Lint, TypeScript e build de produção aprovados.
- Oito cenários de navegador: Chromium em 360, 390, 768 e 1440 px; WebKit em 390 e 1440 px; Chromium e WebKit em desktop com movimento normal.
- Conferidas abas e sua ordem, três modelos por categoria, reinício ao trocar a categoria, avanço/retorno circular, seleção/remoção da referência, data e destinatário do WhatsApp.
- Conferidos teclado, foco, movimento reduzido, gesto de toque por eventos de ponteiro e ausência de rolagem horizontal.
- Inspeção visual dos doze ensaios, da abertura e dos cartões. Fotografias finais somam aproximadamente 1,56 MB.
- Canais da Aldenn identificados, localização explicitamente ilustrativa, sem dados comerciais herdados.

Capturas e relatório detalhado estão em `../../aurora-noivas/output/validation/`, disponíveis localmente e excluídos do Git. Não foram enviadas mensagens no WhatsApp. O mapa externo foi substituído nos testes automatizados. Testes em WebKit e emulação de toque não substituem uma avaliação em aparelho físico.

Nenhum deploy público realizado. A base e os demais projetos não foram restaurados nem alterados por esta entrega.
