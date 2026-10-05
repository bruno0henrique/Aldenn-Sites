# Validação — Aurora Noivas 0.2.1

Data: 2026-10-05. Exportação estática Next.js; prévia em `/demonstracao-aurora-noivas/`.

- Lint, TypeScript, nove testes unitários e build de produção aprovados.
- Oito cenários de navegador: Chromium em 360, 390, 768 e 1440 px; WebKit em 390 e 1440 px; ambos com movimento normal em desktop e rolagem nativa.
- Conferidas as quatro abas, ordem, três vestidos por categoria, reinício ao trocar a categoria, avanço/retorno circular e navegação por teclado/toque.
- Fotos laterais clicáveis trazem o vestido ao centro. Foto central e botão principal aplicam a referência e a ocasião ao planejador. Conferidos remoção, data e mensagem direcionada ao WhatsApp da Aldenn.
- Sem contador visível; setas sobre a fotografia, cantos suaves e cartões laterais preservados. Corrigido o clique em superfícies com perspectiva e evitado deslocamento horizontal da galeria ao focar uma imagem lateral.
- Faixa da Aldenn e retorno ao site conferidos. Um único mapa entre a galeria e o planejador, com aviso de localização ilustrativa.
- Cena 3D e dependências Three.js retiradas. Testes confirmam ausência de canvas e fotografia estática de cetim carregada; texto e navegação atualizados.
- Rolagem nativa, sem translação do documento inteiro. Entradas pontuais e movimento reduzido preservados; desfoques removidos das fotos, controles e cabeçalho.
- Conferidos movimento reduzido, funcionamento do teclado após gesto de toque, ausência de rolagem horizontal e erros de execução. Capturas de galeria e fotografia editorial verificadas visualmente.

Capturas e relatórios ficam em `../../aurora-noivas/output/validation/`, disponíveis localmente e excluídos do Git. O mapa externo é substituído nos testes automatizados; nenhuma mensagem foi enviada. WebKit e emulação de toque não substituem testes em aparelhos físicos.

Permanecem oito alertas nas dependências da base (Next.js, ferramentas de lint e Sharp), registrados em `output/validation/audit.json`. A revisão dessas dependências deve acompanhar a preparação da publicação; esta entrega mantém o framework existente e utiliza exportação estática.

Nenhum deploy público realizado. Demais projetos e alterações anteriores preservados.

## Medição de desempenho

`scripts/performance-check.mjs` usa Chromium desktop, CPU limitada a quatro vezes o tempo normal, mapa substituído, fontes prontas e uma sequência fixa de rolagem seguida por troca das quatro categorias. PerformanceObserver registra tarefas superiores a 50 ms; requestAnimationFrame mede intervalos entre quadros.

Na amostra desta máquina:

| Rolagem | 0.2.0 antes da correção | 0.2.1 sem 3D |
| --- | --- | --- |
| Tarefas longas | 2 | 0 |
| Maior tarefa | 578 ms | 0 ms |
| Intervalo de quadros no percentil 95 | 33,4 ms | 16,8 ms |
| Quadros acima de 35 ms | 4 | 0 |

Relatórios locais: `performance-baseline.json` e `performance-current.json`. Na troca de categorias ainda houve picos de até 105 ms com CPU limitada e fotografias carregadas pela primeira vez; esta medição não demonstra melhora nesse cenário. A verificação de funcionamento passou, e os resultados não garantem a mesma taxa de quadros em todo aparelho. A melhoria mais clara foi na rolagem após retirar a inicialização do 3D e o deslocamento artificial da página.
