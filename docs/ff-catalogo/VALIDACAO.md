# Validação da versão 0.1.0

Data: 2026-10-06. Build estático servido em `http://127.0.0.1:5186/`.

- `npm run check`: sintaxe dos módulos aprovada.
- `npm test`: cinco testes aprovados (fontes/limites, filtros, WhatsApp, conteúdo sem preços e ativação futura de venda).
- `npm run build`: home e oito páginas individuais geradas.
- Navegador: 360, 390 e 430 px, oito cards, sem vazamento horizontal ou preço residual. Desktop verificado em 1280 px.
- Filtro Madrinhas + Verde + G: uma sugestão, aviso de grade não confirmada, tamanho transmitido ao atendimento e preservado ao abrir a peça.
- Busca global por azul: três vestidos. Busca sem resultado: estado vazio; limpar restaura os oito produtos.
- Oito páginas individuais abertas; imagem carregada, nome correto e CTA presentes em todas, sem preço ou vazamento horizontal.
- Data 20/12/2026 e tamanho G conferidos na mensagem; nenhum envio executado. URLs locais são omitidas das mensagens, enquanto domínio publicado pode incluir o link da peça.
- Menu compacto, fechamento de diálogos, alternância de galeria e fotografia ampliada verificados no mobile.
- Mapa carregou com marcador F&F Moda Festa; endereço, horários e link Como chegar conferidos.
- Dez imagens revisadas em prancha, com fonte e resolução registradas. Não há arquivos de fotografia não selecionados no diretório público.
- CTAs dos cards possuem altura mínima de 44 px. Fotografias carregadas sem falhas observadas.
- Comparação visual com Viva Dress: cabeçalho em camadas, abertura fotográfica ampla, grid de quatro peças no desktop/duas no mobile, editoriais por ocasião e outro conjunto de peças antes do catálogo. Identidade e conteúdo próprios da FF.

Capturas, prancha e relatório de navegador ficam em `ff-catalogo/output/validation/`, localmente e fora do Git. Não houve publicação nem alteração dos projetos anteriores.

Limites: o navegador validou a preparação dos links de WhatsApp, sem enviar mensagem. Estoque por data e numeração dependem da loja. Checkout de venda permanece fora do escopo atual.

## Revisão 0.1.1

Check, cinco testes e build aprovados. Navegador revisado em 360, 390, 430, 768, 1024 e 1280 px, sem rolagem horizontal. Hambúrguer somente abaixo de 768 px. Faixa Aldenn presente na home e no produto, SVG WhatsApp visível com pulso. Categorias sem imagens: link Madrinhas filtrou cinco vestidos. Menu mobile abriu e fechou corretamente; consulta individual manteve nome e código do vestido. Capturas em output/validation/ajustes-*.png. Sem publicação.

## Revisão 0.2.0

Check, cinco testes e build aprovados. Banners revisados em 360, 390, 430, 1280 e 1920 px; imagens mobile/desktop corretas, uma arte visível por vez, sem rolagem horizontal. Carregamento do segundo banner em 360 px confirmado após a imagem lazy carregar. Setas, indicadores e teclado alternam os dois banners; gesto lateral implementado, sem simulação de toque real neste navegador. Cards de ocasiões revisados em 360, 390, 430 e 1280 px: imagens carregadas, texto sem transbordamento, Madrinhas filtra cinco vestidos. CTAs levam ao catálogo, destaques e WhatsApp oficial contextual. Capturas v020-*.png em output/validation. Artes ilustrativas identificadas, sem promoção ou novidades não comprovadas. Sem publicação.
