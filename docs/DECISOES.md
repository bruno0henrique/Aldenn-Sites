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

## DEC-003: Proprietária única e administradores adicionais

- Data: 2026-09-01
- Estado: Aprovada
- Decidido por: Cliente
- Contexto: A operação terá mais de uma pessoa revisando e publicando peças, mas somente uma conta representa a proprietária.
- Decisão: Manter uma única conta com papel `owner` e permitir múltiplas contas com papel `admin`. Os dois papéis acessam as aprovações.
- Motivo: Permitir colaboração administrativa sem duplicar a identidade da proprietária.
- Impactos: O menu mostra `Aprovações` somente para esses papéis. Contas comuns continuam limitadas à área pessoal.
- Substitui: Complementa a DEC-001.

## DEC-004: Vercel como ambiente oficial

- Data: 2026-09-01
- Estado: Aprovada
- Decidido por: Cliente
- Contexto: O domínio privado de avaliação exigia autenticação externa e não deve receber visitantes ou links do Supabase.
- Decisão: Publicar o aplicativo diretamente na Vercel e usar seu domínio estável como URL principal de autenticação.
- Motivo: Manter o mesmo padrão de hospedagem dos demais projetos e evitar a barreira de acesso privada.
- Impactos: Links de confirmação, área de conta e painel retornam ao domínio da Vercel.
- Substitui: O uso do domínio privado como endereço principal.
