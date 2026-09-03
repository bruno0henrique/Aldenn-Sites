# Componentes de terceiros

- GSAP 3.13.0: animações sutis de entrada e elementos decorativos.
- Uiverse: inspiração visual para o brilho e microinterações dos botões; padrão reimplementado no tema Belleland. Licença MIT.
- Instaloader 4.15.3: leitura sob demanda e não oficial de posts públicos do Instagram. Licença MIT.
- Supabase: autenticação, PostgreSQL, RLS e Storage.
- `@supabase/ssr`: sessão Supabase em cookies para navegador, servidor e proxy do Next.js.
- Next.js 16: aplicação com App Router e rotas de autenticação no servidor.
- Vercel: ambiente oficial de build, publicação e execução da função Python do scraper.
- OpenAI Responses API: análise visual sob demanda para sugerir dados de produtos. A chave fica somente no servidor e o modelo padrão é `gpt-5-nano`.

A operação envia somente a imagem principal após ação explícita, desativa o armazenamento da resposta na API e deve usar apenas artes de produtos autorizadas e sem dados pessoais desnecessários.

O sincronizador do Instagram depende de uma interface não oficial e pode sofrer limitação, autenticação adicional ou mudanças externas.
