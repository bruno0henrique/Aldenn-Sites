# Registro de decisões

## DEC-001: Contas públicas e proprietária única

- Data: 2026-09-01
- Estado: Aprovada
- Decidido por: Cliente
- Contexto: Qualquer visitante pode criar conta, enquanto apenas a dona da Belleland precisa acessar a curadoria.
- Decisão: Permitir cadastro por e-mail para visitantes, registrar consentimento promocional e limitar `staff_members` a uma única proprietária.
- Motivo: Separar relacionamento com clientes da autorização administrativa.
- Impactos: Contas comuns retornam ao catálogo após entrar. Somente a conta presente em `staff_members` acessa e publica no painel.
- Substitui: Requisito anterior que tratava contas de clientes como etapa futura.

## DEC-002: Envio profissional de e-mail em etapa futura

- Data: 2026-09-01
- Estado: Aprovada
- Decidido por: Cliente
- Contexto: O e-mail profissional da Hostinger ainda será criado.
- Decisão: Preparar o consentimento e o armazenamento agora, mantendo a configuração de envio do Supabase até a integração SMTP futura.
- Motivo: Permitir cadastro imediato sem inventar credenciais ou remetente.
- Impactos: O envio de campanhas promocionais ainda não faz parte desta entrega.
- Substitui: Não se aplica.
