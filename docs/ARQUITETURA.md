# Arquitetura v0.5.0

## Fluxo

1. O script local lê `@bellelandcloset` e seleciona posts com `#bellelandproduto`.
2. As imagens são copiadas para o bucket público `product-media` com caminhos UUID.
3. A captura entra em `pending_review`; nada é publicado automaticamente.
4. A proprietária escolhe capa e fotos, revisa os dados e informa o preço.
5. `publish_capture` valida e publica produto e mídia em uma única transação.
6. O catálogo público consulta apenas registros com `status = 'published'`.

## Segurança

- RLS está ativa em todas as tabelas expostas.
- Visitantes só leem produtos publicados e suas mídias.
- A autorização de proprietária vem de `staff_members`, nunca de metadados editáveis do usuário.
- A service role é exclusiva do script local e não possui prefixo `NEXT_PUBLIC_`.
- O bucket é público por decisão aprovada. Caminhos têm UUID e listagem não é concedida, mas a URL exata de uma imagem capturada funciona antes da aprovação.
- O site não coleta pagamento.
- O cadastro cria apenas a identidade no Supabase Auth. O acesso de proprietária continua dependente de liberação manual em `staff_members`.
- `customer_profiles` registra o e-mail e o consentimento promocional por gatilho do Auth, com RLS para a própria conta e para a proprietária.
- Um índice único impede mais de uma conta com papel de proprietária.
- O modo demonstração usa somente dados locais em memória e não consulta ou altera o Supabase.

## Operação inicial

1. Criar o projeto Supabase e aplicar `npx supabase db push` após vinculá-lo.
2. Ativar cadastro por e-mail e confirmação de e-mail no painel de Auth.
3. Cadastrar como URLs de redirecionamento o endereço local e os domínios publicados do site.
4. Criar a conta pela tela e inserir o UUID autorizado: `insert into public.staff_members (user_id, role) values ('UUID', 'owner');`. O banco rejeita uma segunda proprietária.
5. Copiar `.env.example` para `.env.local` e preencher as chaves.
6. Instalar o sincronizador: `python -m pip install -r scripts/requirements.txt`.
7. Rodar `python scripts/sync_instagram.py`; antes de releases, usar `--full`.

O SMTP profissional da Hostinger será configurado em uma etapa futura. Até lá, os e-mails de autenticação usam a configuração disponível no Supabase.

Se Instagram limitar ou bloquear a leitura, o script termina com erro e preserva banco e catálogo já publicados.
