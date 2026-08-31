# Manual de trabalho com o Codex

Este documento descreve o fluxo operacional do projeto. As instruções automáticas ficam em `AGENTS.md`.

## Fluxo padrão

```text
Formulário
→ entrada original
→ briefing estruturado
→ aprovação
→ escopo
→ plano da entrega
→ implementação
→ validação
→ revisão
→ versão
→ entrega
```

## Conversas

Use uma conversa por resultado coerente, por exemplo:

- estruturar briefing;
- definir arquitetura;
- implementar página inicial;
- implementar formulário;
- revisar segurança;
- preparar publicação.

Continue na mesma conversa enquanto o objetivo for o mesmo. Abra outra quando surgir uma entrega independente.

## Antes de implementar

O Codex deve:

1. ler as instruções e documentos do projeto;
2. inspecionar o estado atual do repositório;
3. identificar ambiguidades, conflitos e riscos;
4. confirmar o resultado esperado e os critérios de aceite;
5. propor um plano curto para trabalhos complexos.

## Durante a implementação

- Trabalhar em mudanças pequenas e revisáveis.
- Preservar alterações existentes que não pertençam à tarefa.
- Não instalar tecnologia sem necessidade comprovada.
- Manter regras de negócio fora da interface quando aplicável.
- Usar dados reais autorizados ou indicar claramente conteúdo demonstrativo.
- Atualizar testes e documentação afetados.

## Conclusão

Toda entrega deve informar:

```text
IMPLEMENTADO
VALIDADO
PENDENTE
RISCOS
VERSÃO
PRÓXIMA ETAPA
```

## Versionamento

- Branches: `codex/<entrega>`.
- Commits: pequenos, objetivos e relacionados a uma única mudança.
- Versões: SemVer (`v0.1.0`, `v0.2.0`, `v1.0.0`).
- `main`: somente estados aprovados e verificáveis.
- Toda publicação deve apontar para um commit ou versão identificável.

