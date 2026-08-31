# Segurança e privacidade

## Classificação dos dados

| Dado | Finalidade | Base/autorização | Retenção | Acesso |
| --- | --- | --- | --- | --- |
| [dado] | [finalidade] | [fundamento] | [prazo] | [papéis] |

## Regras obrigatórias

- Segredos somente em variáveis de ambiente ou cofre apropriado.
- Nenhum segredo, senha ou dado pessoal real em Git, logs, URLs ou mensagens de erro.
- Validação de tipo, formato, tamanho e propriedades permitidas no servidor.
- Autenticação e autorização verificadas no backend.
- Toda consulta por identificador deve validar propriedade e permissão.
- Menor privilégio para contas, integrações e bancos.
- Queries parametrizadas ou camada segura de acesso a dados.
- Proteção de rotas, cookies e sessões conforme o risco.
- Limitação de frequência em endpoints sujeitos a abuso.
- Cabeçalhos de segurança e política de cache adequados.
- Dependências mínimas, atualizadas e revisadas.
- Backups e procedimento de restauração quando houver dados persistentes.

## Dados de clientes

- Coletar apenas o necessário.
- Definir retenção, exclusão e responsável.
- Não usar dados reais em desenvolvimento sem autorização e proteção equivalentes.
- Não enviar dados a terceiros sem necessidade registrada.
- Documentar provedores, localização e fluxo dos dados.

## Checklist antes da publicação

- [ ] Segredos ausentes do repositório e do bundle.
- [ ] Permissões testadas para cada perfil.
- [ ] Entradas inválidas e excessivas rejeitadas.
- [ ] Logs não expõem conteúdo sensível.
- [ ] TLS, cache e cabeçalhos verificados.
- [ ] Dependências auditadas.
- [ ] Backup e rollback definidos.
- [ ] Formulários possuem finalidade e aviso adequados.
- [ ] Ambiente de produção usa credenciais próprias.

## Incidentes

Em caso de suspeita: interromper a exposição quando seguro, preservar evidências, revogar credenciais afetadas, avaliar impacto, registrar decisões e comunicar os responsáveis definidos para o projeto.

