# Arquitetura v0.10.0

## Fluxo

1. O botão Atualizar executa o scraper protegido e procura publicações ainda não registradas de `@bellelandcloset`.
2. As imagens são copiadas para o bucket público `product-media` com caminhos UUID.
3. A captura entra em `pending_review`; nada é publicado automaticamente.
4. A proprietária ou uma conta administradora escolhe capa e fotos, revisa os dados e informa o preço.
5. Uma peça também pode ser cadastrada manualmente com foto e entrar na mesma fila de aprovação.
6. `publish_capture` valida e publica produto e mídia em uma única transação.
7. O catálogo público consulta apenas registros com `status = 'published'`.
8. `update_published_product` mantém produto e captura de origem sincronizados ao editar dados ou promoção.
9. `remove_published_product` retira o produto e move a captura de origem para `ignored` em uma transação.

## Segurança

- RLS está ativa em todas as tabelas expostas.
- Visitantes só leem produtos publicados e suas mídias.
- A autorização administrativa vem de `staff_members`, nunca de metadados editáveis do usuário.
- A função hospedada recebe a sessão da administradora e respeita as políticas RLS. A service role continua exclusiva do script local opcional e não possui prefixo `NEXT_PUBLIC_`.
- O bucket é público por decisão aprovada. Caminhos têm UUID e listagem não é concedida, mas a URL exata de uma imagem capturada funciona antes da aprovação.
- O site não coleta pagamento.
- O cadastro cria apenas a identidade no Supabase Auth. O acesso administrativo continua dependente de liberação manual em `staff_members`.
- `customer_profiles` registra e-mail, nome, telefone e consentimento promocional, com RLS para a própria conta.
- Um índice único impede mais de uma conta com papel de proprietária.
- O modo demonstração usa somente dados locais em memória e não consulta ou altera o Supabase.
- Preços promocionais possuem restrição no banco e precisam ser positivos e menores que o preço normal.
- As operações administrativas de produtos exigem `owner` ou `admin` por RLS e por verificação nas funções transacionais.

## Operação inicial

1. Criar o projeto Supabase e aplicar `npx supabase db push` após vinculá-lo.
2. Ativar cadastro por e-mail e confirmação de e-mail no painel de Auth.
3. Cadastrar como URLs de redirecionamento o endereço local e os domínios publicados do site.
4. Criar a conta pela tela e inserir o UUID autorizado com papel `owner` ou `admin`. O banco rejeita uma segunda proprietária, mas permite administradores adicionais.
5. Copiar `.env.example` para `.env.local` e preencher as chaves.
6. O botão Atualizar executa o scraper Python hospedado e adiciona até 12 publicações novas por execução.
7. Como alternativa operacional, instalar `python -m pip install -r scripts/requirements.txt` e rodar `python scripts/sync_instagram.py`; antes de releases, usar `--full`.

O SMTP profissional da Hostinger será configurado em uma etapa futura. Até lá, os e-mails de autenticação usam a configuração disponível no Supabase.

## Publicação

- A aplicação usa Next.js com App Router e é publicada diretamente na Vercel.
- O domínio oficial atual é `https://aldenn-sites.vercel.app`.
- O Supabase usa esse mesmo domínio como URL principal e destino das confirmações de e-mail.

Se Instagram limitar ou bloquear a leitura, o script termina com erro e preserva banco e catálogo já publicados.
