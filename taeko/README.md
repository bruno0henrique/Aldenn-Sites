# Taeko Noivas

Landing page editorial independente para a Taeko Noivas, em Jacareí.

## Desenvolvimento

```bash
npm install
npm run dev
```

A aplicação usa o caminho base `/demonstracao-taeko`. A versão de produção é gerada em `out/` por `npm run build` e publicada dentro do projeto institucional da Aldenn.

## Mídia da abertura

Configure `lib/hero-media.ts` para alternar entre o poster atual e a futura sequência de quadros. No modo `sequence`, informe o padrão com `{frame}`, a quantidade de quadros e o ponto focal. A reprodução usa carregamento progressivo, cache limitado e fallback para poster.

As imagens atuais são editoriais ilustrativas. Elas devem ser substituídas por materiais autorizados da Taeko quando forem recebidos.

## Validação

```bash
npm test
npm run lint
npm run build
```
