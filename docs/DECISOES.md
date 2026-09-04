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
- Estado: Substituída pela DEC-011
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

## DEC-011: OpenAI com modelo econômico no cadastro assistido

- Data: 2026-09-03
- Estado: Aprovada
- Decidido por: Cliente
- Contexto: O Gemini não será mais usado e a análise visual voltará para a API da OpenAI.
- Decisão: Usar a Responses API com `gpt-5-nano` por padrão, mantendo `OPENAI_VISION_MODEL` para troca posterior caso a qualidade não seja suficiente.
- Motivo: Começar pelo menor custo e preservar a possibilidade de elevar a qualidade sem alterar o código.
- Impactos: Somente a foto principal é enviada sob demanda. A chave permanece no servidor e nenhum resultado é publicado automaticamente.
- Substitui: DEC-008.

## DEC-012: Validação estrita das imagens do catálogo

- Data: 2026-09-03
- Estado: Aprovada
- Decidido por: Cliente
- Contexto: O preenchimento automático aceitou um cosmético como produto, apesar de o catálogo ser exclusivo de roupas.
- Decisão: Classificar a imagem antes da extração e aceitar somente quando uma peça de roupa for claramente o produto principal. Imagens inválidas ou incertas não preenchem nenhum campo.
- Motivo: Impedir sugestões fora do escopo e reduzir informações inventadas no cadastro.
- Impactos: Cosméticos, acessórios, objetos e cenas ambíguas são recusados. Preço, tamanho, nome e descrição seguem regras de evidência visual e continuam sujeitos à revisão humana.
- Substitui: Complementa a DEC-011.

## DEC-013: Novidades antes do filtro e coleção em grade

- Data: 2026-09-03
- Estado: Aprovada
- Decidido por: Cliente
- Contexto: A sequência anterior colocava o filtro antes de Novidades e mostrava cards grandes demais no celular.
- Decisão: Manter Novidades como carrossel acima do filtro e mostrar abaixo apenas a coleção apontada pelo filtro, em grade com duas peças por linha no celular.
- Motivo: Priorizar lançamentos e aumentar a quantidade de produtos visíveis sem repetir todas as categorias na mesma página.
- Impactos: O filtro deixa de listar Novidades, que possui acesso próprio no menu, e passa a controlar exclusivamente a grade da coleção.
- Substitui: Complementa a DEC-009.

## DEC-014: Imagem editorial com preço em Novidades

- Data: 2026-09-03
- Estado: Aprovada
- Decidido por: Cliente
- Contexto: O card convencional e a primeira versão da vinheta acrescentaram informação e contorno visual demais, reduzindo o destaque da roupa.
- Decisão: Em Novidades, exibir somente a fotografia e o preço em branco. A imagem recebe arredondamento discreto, maior presença horizontal e um degradê forte na base que desaparece ao atingir um terço da altura. A parte inteira do preço usa tamanho maior, peso fino e espaçamento compacto; os centavos ficam menores, alinhados abaixo e com um respiro sutil após o valor inteiro.
- Motivo: Priorizar a peça ou a modelo usando a roupa e criar uma apresentação mais editorial.
- Impactos: Nome, borda, fundo e preço anterior não aparecem no carrossel de Novidades. O estilo é exclusivo dessa seção e a grade filtrada mantém os cards compactos em duas colunas.
- Substitui: Complementa a DEC-013.

## DEC-015: Tela principal separada do catálogo filtrado

- Data: 2026-09-03
- Estado: Aprovada
- Decidido por: Cliente
- Contexto: Hero e novidades continuavam visíveis acima da coleção após escolher uma categoria, repetindo conteúdo exclusivo da chegada ao site.
- Decisão: Manter hero First Drop e Novidades apenas na tela principal. Ao escolher Todos ou uma categoria pelo filtro ou menu, iniciar diretamente na coleção. Em Novidades, embaralhar os produtos a cada carregamento e permitir navegação circular.
- Motivo: Dar identidade própria à chegada e tornar a navegação por categoria mais direta.
- Impactos: A URL com o parâmetro `categoria` identifica a visualização filtrada. O carrossel muda a ordem após recarregar a página e retorna ao início sem interrupção.
- Substitui: Complementa as decisões DEC-009 e DEC-013.
