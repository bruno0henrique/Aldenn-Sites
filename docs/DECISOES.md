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

## DEC-005: Gestão e promoção de produtos publicados

- Data: 2026-09-01
- Estado: Aprovada
- Decidido por: Cliente
- Contexto: A operação precisa corrigir dados, ajustar preços, criar promoções e retirar peças mesmo depois da publicação.
- Decisão: Permitir edição e promoção antes e depois da publicação. A retirada de um produto publicado remove sua exposição e move a captura para Ignorados.
- Motivo: Evitar republicação manual e preservar uma rota de recuperação para exclusões acidentais.
- Impactos: Preços promocionais são validados no banco. Produtos e capturas de origem permanecem sincronizados.
- Substitui: Não se aplica.

## DEC-006: Seleção antes da edição administrativa

- Data: 2026-09-01
- Estado: Aprovada
- Decidido por: Cliente
- Contexto: Abrir editores completos imediatamente deixou fotos grandes e dificultou escolher qual peça alterar.
- Decisão: Mostrar uma grade compacta de miniaturas em Revisar e Publicados. Abrir somente o editor da peça escolhida e oferecer retorno à lista.
- Motivo: Dar visão geral do catálogo e evitar imagens desproporcionais no primeiro acesso ao painel.
- Impactos: A seleção passa a ser uma etapa anterior à edição, sem alterar dados ou permissões.
- Substitui: Não se aplica.

## DEC-007: GPT como assistente do cadastro por imagem

- Data: 2026-09-02
- Estado: Substituída pela DEC-008
- Decidido por: Cliente
- Contexto: As artes das publicações já contêm nome, tamanho, preço e características visuais úteis ao cadastro.
- Decisão: Usar análise visual da OpenAI sob demanda para sugerir os campos do formulário administrativo, sempre com revisão humana antes da publicação.
- Motivo: Reduzir digitação sem depender da API da Meta ou de automação de acesso ao Instagram.
- Impactos: A imagem é enviada a um terceiro somente após ação explícita. A chave fica no servidor, há custo por uso e nenhum resultado é publicado automaticamente.
- Substitui: Não se aplica.

## DEC-008: Gemini 2.5 Flash como assistente do cadastro

- Data: 2026-09-02
- Estado: Aprovada
- Decidido por: Cliente
- Contexto: A configuração de pagamento da OpenAI impediu a ativação da análise visual.
- Decisão: Substituir a OpenAI pelo Google Gemini 2.5 Flash, mantendo o envio sob demanda, a saída estruturada e a revisão humana.
- Motivo: Usar a faixa gratuita disponível e reduzir o custo inicial sem alterar o fluxo administrativo.
- Impactos: A chave passa a ser `GEMINI_API_KEY`. No plano gratuito, as artes enviadas podem ser usadas pelo Google para melhorar seus produtos.
- Substitui: DEC-007.

## DEC-009: Navegação e Vitrine organizadas por produtos

- Data: 2026-09-02
- Estado: Aprovada
- Decidido por: Cliente
- Contexto: A referência aprovada usa menu lateral com tópicos, banners e carrosséis próximos, sem blocos soltos ou grandes espaços.
- Decisão: Usar menu lateral completo, filtro compacto, carrosséis por categoria e banners vinculados a produtos publicados. Categorias e banners são organizados na área Vitrine do painel.
- Motivo: Aproximar a navegação da referência mantendo a estética Belleland e a reserva pelo WhatsApp.
- Impactos: `Novidades` é automática. Categorias podem ser ocultadas sem remover produtos. Banners nunca usam uploads independentes.
- Substitui: Os quatro blocos fixos de categoria da página inicial.

## DEC-010: Galeria no cadastro manual

- Data: 2026-09-02
- Estado: Aprovada
- Decidido por: Cliente
- Contexto: Um produto pode ter fotos de modelos e ângulos diferentes além da capa principal.
- Decisão: Aceitar até 6 fotos no cadastro manual, permitindo escolher uma principal e manter as demais como secundárias.
- Motivo: Apresentar melhor cada peça sem criar cadastros duplicados.
- Impactos: O preenchimento automático analisa somente a foto principal. Todas as fotos seguem para revisão e publicação.
- Substitui: O cadastro manual limitado a uma única foto.
