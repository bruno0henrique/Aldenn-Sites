# Preparação para vídeo 3D

O espaço de vídeo está preparado nas seis páginas, para casas e apartamentos. Enquanto não existe um arquivo cadastrado, exibe “Vídeo 3D em preparação”, uma imagem ilustrativa e um aviso de indisponibilidade, sem botão de reprodução fictício.

## Entrada para a ferramenta de geração

Execute `npm run 3d:inputs`. O arquivo local `.source/3d-inputs.json` reúne os seis anúncios e suas 48 fotos: referência, título, caminho relativo de cada imagem em `public/`, URL pública, dimensões, origem e hash do arquivo original. É um manifesto para adaptar à ferramenta que será escolhida; nenhuma imagem é enviada e não há API, chave ou fornecedor configurado.

Desde 0.4.0, as galerias usam imagens ilustrativas de ambientes de diferentes projetos do Unsplash. O manifesto marca suitableForSpatialReconstruction=false. Elas não formam uma captura coerente de um único imóvel: antes de gerar um tour 3D fiel, substituir por imagens consistentes da mesma propriedade. O site não afirma que a reconstrução representa medidas ou geometria reais. O vídeo publicado identifica a visualização como ilustrativa.

## Cadastrar o resultado

1. Salve o MP4 ou WebM em `public/media/REFERENCIA/tour-3d.mp4`.
2. Cadastre a referência em `data/videos.ts`:

```ts
export const propertyVideos: Partial<Record<string, PropertyVideo3D>> = {
  "24060": {
    src: "/media/24060/tour-3d.mp4",
    poster: "/media/illustrative/24060/01.webp",
    captions: "/media/24060/tour-3d.vtt",
  },
};
```

`poster` e `captions` são opcionais; se não houver legendas, omita o campo. A primeira imagem da galeria é usado como poster padrão. Os caminhos são locais, começam com `/` e não incluem `/demonstracao-imobiliaria`. Para uma futura ferramenta externa, importar o resultado para os arquivos locais preserva a política de segurança e a independência do site.

3. Valide os arquivos, execute lint, tipos, testes e build e publique novamente a exportação.

O player aparece automaticamente após o cadastro, com controles nativos, reprodução inline no celular, carregamento apenas sob demanda (`preload="none"`) e sem autoplay. Não há download, geração nem cobrança durante a navegação. Esta entrega prepara o ponto de integração; o vídeo e a ferramenta ainda precisam ser fornecidos.
