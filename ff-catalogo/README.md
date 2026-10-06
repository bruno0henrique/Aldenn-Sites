# F&F Moda Festa — novo catálogo

Versão 0.1.1. Projeto independente criado do zero. Não altera Belleland, Aldenn Noivas ou Aurora Noivas.

## Rodar e validar

Requer Node.js 22 ou superior. Não há dependências de execução externas.

```powershell
cd ff-catalogo
npm run dev
```

Prévia: http://127.0.0.1:5186/. `FF_PREVIEW_PORT` permite escolher outra porta. Após editar, execute `npm run build` e recarregue o navegador. O servidor permanece aberto durante o build.

```powershell
npm run check
npm test
npm run build
```

Saída estática em `dist/`: home, oito rotas `/vestidos/<slug>/`, fotos, fontes e página 404. Sem backend, login, cookies próprios ou formulários que guardem dados. O mapa Google é externo. Os botões preparam conversas no WhatsApp; nenhum envio ocorre automaticamente.

## Conteúdo e curadoria

Oito vestidos e dez fotografias distintas da FF, com versões menores responsivas. `data/sources.json` registra URL da página e da mídia, identificador original e resolução. A logo também veio do site oficial. Sem fotos geradas, nomes de modelos fictícios, preços, estoque de locação inferido, avaliações ou números comerciais.

Nenhuma grade de tamanho está publicada nas peças selecionadas. A escolha de tamanho é uma intenção para o atendimento; peças sem grade continuam como sugestões a confirmar, com aviso explícito. Se a grade for cadastrada futuramente, os filtros passam a excluir tamanhos incompatíveis. Ocasiões são curadoria editorial, não atributos publicados pelo fornecedor.

Como não existe evidência de novidade ou ranking, as seções se chamam **Seleção FF** e **Em destaque**, sem alegação de lançamento ou mais vendido.

## Venda futura

`data/catalog.js` separa o catálogo da interface e inclui `rentalEnabled`, `saleEnabled`, `rentalAvailability`, `salePrice`, `saleStock`, `sizes`, `colors`, `category`, `occasion`, `featured` e `newArrival`.

Hoje `saleEnabled = false` para todos. `commerceMode()` exige preço e estoque válidos para ativar a apresentação de venda no mesmo card; fotos, busca, filtros e galerias são reutilizáveis. Checkout, cobrança e gestão de estoque exigirão integração própria, fora deste modelo de locação. A avaliação social fica vazia até haver material aprovado.

## Publicação

Entrega em prévia local, com `noindex`. Nenhum domínio ou projeto anterior foi substituído. Antes da publicação definitiva, definir destino, URL pública, retirar `noindex` e revisar dados com a cliente. O build usa caminhos absolutos a partir da raiz; publicar em subpasta exige configurar esses caminhos.

Fontes Cormorant Garamond e Manrope, SIL Open Font License; licenças em `public/fonts/`. Animações leves nativas respeitam redução de movimento; GSAP não é necessário nesta implementação.

Requisitos, fontes e decisões: [documentação](../docs/ff-catalogo/README.md).
