# Validação — Aurora Noivas 0.2.0

Data: 2026-10-05. Exportação estática Next.js; prévia em `/demonstracao-aurora-noivas/`.

- Lint, TypeScript, nove testes unitários e build de produção aprovados.
- Nove cenários de navegador: Chromium em 360, 390, 768 e 1440 px; WebKit em 390 e 1440 px; ambos com movimento normal em desktop; Chromium com WebGL bloqueado para verificar a alternativa ilustrativa.
- Conferidas as quatro abas, ordem, três vestidos por categoria, reinício ao trocar a categoria, avanço/retorno circular e navegação por teclado/toque.
- Fotos laterais clicáveis trazem o vestido ao centro. Foto central e botão principal aplicam a referência e a ocasião ao planejador. Conferidos remoção, data e mensagem direcionada ao WhatsApp da Aldenn.
- Sem contador visível; setas sobre a fotografia, cantos suaves e cartões laterais preservados. Corrigido o clique em superfícies com perspectiva e evitado deslocamento horizontal da galeria ao focar uma imagem lateral.
- Faixa da Aldenn e retorno ao site conferidos. Um único mapa entre a galeria e o planejador, com aviso de localização ilustrativa.
- Cena 3D carregada ao aproximar-se da tela; teste de rede confirma que o módulo de renderização não entra no carregamento inicial. Giro por botão, teclado e arraste verificado; sem rotação automática ou animação contínua.
- WebGL bloqueado mantém o vestido SVG e a navegação. A malha usa aproximadamente 8,2 mil triângulos, sem texturas ou modelo remoto. Módulo separado: 546.890 bytes de JavaScript; 134.295 bytes na medição gzip (aproximadamente 131 KiB). A prévia local não comprime as respostas; a medição gzip representa o tamanho com compressão no servidor.
- Conferidos movimento reduzido, funcionamento do teclado após gesto de toque, ausência de rolagem horizontal e erros de execução. Capturas de galeria e cena 3D verificadas visualmente.

Capturas e relatórios ficam em `../../aurora-noivas/output/validation/`, disponíveis localmente e excluídos do Git. O mapa externo é substituído nos testes automatizados; nenhuma mensagem foi enviada. WebKit e emulação de toque não substituem testes em aparelhos físicos.

A instalação de Three.js não acrescentou alertas na auditoria npm. Permanecem oito alertas nas dependências da base (Next.js, ferramentas de lint e Sharp), registrados em `output/validation/audit.json`. A revisão dessas dependências deve acompanhar a preparação da publicação; esta entrega mantém o framework existente e utiliza exportação estática.

Nenhum deploy público realizado. Demais projetos e alterações anteriores preservados.
