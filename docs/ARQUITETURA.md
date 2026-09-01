# Arquitetura v0.3.0

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
- O site não coleta pagamento e não cria conta pública nesta versão.

## Operação inicial

1. Criar o projeto Supabase e aplicar `npx supabase db push` após vinculá-lo.
2. Desativar cadastro público no painel de Auth e criar manualmente a usuária proprietária.
3. Inserir o UUID dela: `insert into public.staff_members (user_id, role) values ('UUID', 'owner');`.
4. Copiar `.env.example` para `.env.local` e preencher as chaves.
5. Instalar o sincronizador: `python -m pip install -r scripts/requirements.txt`.
6. Rodar `python scripts/sync_instagram.py`; antes de releases, usar `--full`.

Se Instagram limitar ou bloquear a leitura, o script termina com erro e preserva banco e catálogo já publicados.
