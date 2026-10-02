# Ajustes futuros no cadastro de imóveis

Registrado em 02/10/2026, a pedido do usuário. O pedido inicial era somente registrar. Em 02/10/2026, o usuário autorizou executar tudo. **Implementado na versão 0.8.0**, com os critérios detalhados abaixo.

## Tela e rascunho

- Substituir o formulário de cadastro em pop-up por uma página dedicada, intuitiva e responsiva. O pop-up simples de perfil pode permanecer.
- Salvar o rascunho automaticamente em cache local, recuperando o preenchimento após F5. Considerar também as fotos e o estado da ajuda com IA para evitar perda do trabalho.
- Um imóvel novo começa sem fotografias: retirar a escolha de galerias de outros imóveis e as fotos preenchidas automaticamente. O usuário adiciona as fotos do próprio imóvel.

## Campos e apresentação

- Diferenciais: Enter ou vírgula confirma cada item e o mostra abaixo como tag individual. Corrigir a ortografia automaticamente, padronizar a escrita e exibir capitalização consistente. Variações de maiúsculas/minúsculas devem corresponder ao mesmo diferencial, evitando duplicatas. Cada diferencial continua independente.
- Cor / tom: acrescentar **Outros**, com campo para escrever a cor.
- Dormitórios e banheiros começam em **1**, permitindo ao vendedor reduzir ou aumentar. Não mudar automaticamente suítes ou vagas por extensão desse pedido.
- Valores monetários e áreas: mostrar **R$** e **m²** durante a digitação, com máscara apropriada e valor numérico separado para cálculos.
- Ampliar os tipos de imóvel além de Casa e Apartamento, incluindo Terreno, Kitnet e os demais tipos usuais. Definir a lista completa na implementação e manter cadastro, pesquisa e IA compatíveis.
- Finalidade: permitir Venda, Locação e a opção conjunta **Venda ou locação**, com os respectivos valores de venda e aluguel quando aplicáveis.
- Adicionar CEP e número. Consultar o CEP para preencher automaticamente os dados de endereço disponíveis; permitir revisão e correção manual. Número e condomínio não devem ser inventados pela consulta.

## Ajuda com IA

- Na página de cadastro, oferecer um botão **Ajuda com IA** que abre uma pequena janela de conversa.
- A janela solicita os dados necessários que ainda faltam e pede confirmação antes de preencher o formulário. Aproveitar os campos já preenchidos, sem exigir que o usuário repita tudo.
- Dados mencionados pelo usuário: CEP, número, condomínio, finalidade e valores de venda/aluguel. Condomínio somente quando aplicável.
- Objetivo principal: agilizar **título e descrição**, além de preencher dados factuais já fornecidos ou consultados. Não inventar características, endereço, valores ou benefícios.
- Proposta de logística para detalhar na execução: confirmar endereço obtido pelo CEP, tipo, finalidade e preço correspondente; solicitar área e características básicas relevantes se faltarem informações para um texto útil. Depois gerar título e descrição editáveis e preencher os fatos confirmados.
- Manter os valores de venda e aluguel separados na finalidade conjunta. Falha da IA ou da consulta de CEP não impede o cadastro manual.

## Decisões da implementação

- Tipos: Casa, Apartamento, Sobrado, Cobertura, Duplex, Triplex, Studio, Kitnet, Loft, Flat, Terreno, Lote, Chácara, Sítio, Fazenda, Sala comercial, Loja, Galpão, Prédio, Ponto comercial e Outros. Tags usam padronização local e revisão ortográfica com IA; termos desconhecidos são preservados.
- Terreno, Lote, Sítio e Fazenda exigem área do terreno. Campos de quartos/banheiros não são solicitados para esses tipos e tipos comerciais; os demais exigem área construída.
- Rascunhos ficam no IndexedDB, separados dos anúncios no localStorage, com fotos comprimidas e até seis imagens. F5 recupera campos, tags, fotos e sugestão da IA. Confirmar dados novamente ao retomar. Rascunho é limpo após salvar, ou por descarte explícito. Falha de armazenamento é informada.

As imagens anexadas ao pedido ilustram o formulário atual e os problemas descritos; não introduzem requisitos além da solicitação textual. Este registro atualiza a direção futura do cadastro de 30/09/2026, substituindo o formulário modal anterior pelo cadastro em página própria.
