# Aurora Noivas

Versão **0.1.0**. Demonstração fictícia independente, com paleta rosé e ameixa, vestidos ilustrativos e contato da Aldenn.

## Desenvolvimento e prévia

Requer Node.js 22.13 ou superior.

```bash
npm ci
npm run dev
```

Acesse `http://127.0.0.1:5184/demonstracao-aurora-noivas/`.
Para verificar exatamente o produto exportado:

```bash
npm run build
npm run preview
```

A prévia usa a mesma URL e porta do desenvolvimento; execute apenas um servidor por vez. O servidor escuta exclusivamente em `127.0.0.1`. Para outra porta, defina `AURORA_PREVIEW_PORT`. O build estático fica em `out/`.

## Estrutura

- `components/ui/carousel.tsx`: componente reutilizável adaptado da referência enviada. `components.json` configura os aliases shadcn; `lib/utils.ts` fornece `cn`.
- `app/globals.css`: Tailwind 4 e estilos da identidade; TypeScript e React já estão configurados. Não é necessário executar um novo scaffold.
- `lib/catalog.ts`: categorias e doze modelos ilustrativos; marca e canais ficam em `lib/brand.ts`.
- `lib/planner.ts`: valida escolhas e prepara a mensagem do WhatsApp. Não há banco, coleta persistente ou envio automático.

## Validação

```bash
npm test
npm run lint
npm run typecheck
npm run build
npx playwright install chromium webkit
npm run preview
# Em outro terminal:
npm run test:browser
```

Os testes de navegador usam Chromium em 360, 390, 768 e 1440 px e WebKit em 390 e 1440 px; também verificam rolagem animada em desktop. `AURORA_TEST_URL` permite testar outra prévia. Capturas e relatórios locais ficam em `output/validation/`, ignorado pelo Git. O mapa externo é substituído por um conteúdo neutro nos testes.

## Conteúdo demonstrativo

Marca, vestidos, fotografias e endereço são ilustrativos. Os canais de contato pertencem à Aldenn. Não há preços, estoque, avaliações ou histórico comercial. A ordem das abas é Noivas, Madrinhas, Debutantes e Gala. Cada aba reinicia no primeiro modelo quando a categoria muda.

As doze fotografias foram geradas com a ferramenta integrada `image_gen`; os prompts e os nomes dos arquivos originais estão em `output/imagegen/manifest.json`. Os arquivos finais estão em `public/media/`. A abertura e o cartão do processo reutilizam fotografias desse conjunto. Detalhes neutros de renda foram reaproveitados da base editorial histórica.

`scripts/prepare-media.mjs` otimiza originais com Sharp e gera a imagem de compartilhamento. Para repetir o processamento, forneça um JSON local com objetos `{ "id": "noiva-jasmim", "path": "caminho absoluto do original" }`. Os originais locais não são necessários para rodar o site; todas as imagens finais estão versionadas.

A infraestrutura de sequência e seus testes foram preservados da base, mas não são usados pela página. Nenhuma sequência é carregada pela visitante.

## Histórico e publicação

Fontes iniciais recuperados do commit `d9450af5d4952e4b7d29b213a9fd70f2f6979f8d`, sem restaurar arquivos removidos de outros projetos. A entrega atual é uma prévia local. Não foi realizado deploy público. Requisitos e decisões estão em `../docs/aurora-noivas/README.md`.
