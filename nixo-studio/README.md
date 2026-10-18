# Nixo Studio · 0.1.0

Site de apresentação e protótipo interativo do Nixo, preservado para publicação e inclusão no portfólio da Aldenn. Projeto independente do aplicativo operacional em `bruno0henrique/nixo`.

## Executar

Com Node.js instalado, execute nesta pasta:

```sh
npm run check
npm run dev
```

Abra http://127.0.0.1:5187/ e http://127.0.0.1:5187/demo/. Não é necessário instalar dependências ou executar build: `dist/` contém o próprio código-fonte HTML, CSS e JavaScript.

## Publicar

Publique o conteúdo de `dist/` em hospedagem estática. Entrada: `index.html`; demonstração: `demo/index.html`. Os caminhos relativos permitem hospedar em subpasta, preservando a barra final da URL. Destino e alteração do portfólio ainda precisam ser definidos; esta entrega faz a importação para o Git.

O Sites original permanece em https://nixo-studio-bruno.souza-bruno-souza07.chatgpt.site/ com seu acesso preservado. A publicação externa não recebe automaticamente a restrição de acesso do Sites.

## Limites e dependências

- Demonstração visual com dados ilustrativos; sem banco, login real, vendas ou integração operacional com marketplaces.
- Favoritos, preferências, fornecedores e rascunhos da demonstração são guardados no navegador. Esses dados não são migrados pelo Git.
- GSAP 3.13.0 incluído nos arquivos, com cabeçalho e referência de licença preservados: https://gsap.com/standard-license/.
- Fontes Nunito e DM Sans carregadas pelo Google Fonts; imagens e animações estão locais.
- Capturas do programa são imagens estáticas. Não conectar esta demonstração ao aplicativo real sem definir outro escopo.

Origem: Sites versão 21, projeto `appgprj_6acea6b236f4819191fe2364495e38d3`, commit `90a9d4c5c50414db4e9654ebf0fa9a40292f07c1`. Os 77 arquivos de `dist/` foram copiados integralmente; configurações e credenciais do Sites não foram incluídas.
