# Histórico

## 0.13.0 — 2026-10-04

- Catálogo com dez casas demonstrativas adicionais (16 anúncios), usando fotografias ilustrativas locais com procedência preservada.
- Área Cadastros no header e páginas próprias para imóveis, proprietários e inquilinos. Fichas de pessoas em etapas, rascunho, revisão, vínculos e edição/exclusão locais.
- Cadastro de imóvel com construção, documentação, negociação, pessoas e operação; complementos opcionais, revisão antes de publicar e persistência após F5. Dados internos separados do anúncio e da IA.
- Banner discreto de financiamento entre imóveis e bairros abre simulação editável, sem promessa de aprovação.

## 0.12.0 — 2026-10-04

- Ficha da equipe reorganizada por localização, características, valores e apresentação, com rótulos/valores alinhados e seções contínuas sem caixas repetidas. Resumo numérico somente na lista.
- Equipe acessível diretamente no header inclusive no celular; perfil reduzido à conta/entrada/saída. Edição e exclusão de cadastros locais ficam no painel dedicado.
- Removido o texto Seu próximo endereço da busca principal.

## 0.11.0 — 2026-10-03

- Página dedicada da equipe: acesso direto pelo perfil, seis imóveis iniciais, busca por código/região, ficha, edição e cadastro.
- Informações internas de situação/responsável, imobiliária/localização/identificação da chave e anotações com data persistem localmente e ficam fora dos anúncios.
- Cadastro/edição de empreendimentos e sugestões no editor de imóveis; alterações dos imóveis originais são validadas e aplicadas ao catálogo/detalhes sem duplicação.

## 0.10.1 — 2026-10-02

- Fundo da abertura imobiliária com textura discreta, linhas verticais e arcos arquitetônicos em dourado suave; decoração estática, adaptada ao celular e sem bloquear controles.

## 0.10.0 — 2026-10-02

- Busca mobile com IA centralizada abaixo das opções, brilho discreto e redução de movimento respeitada; filtros em janela com X, Escape e retorno à lista sem espaço vazio.
- Comprar, Alugar e Código separados na busca principal; códigos não passam pela consulta de CEP. Convite para rolar com círculo/seta mais visíveis.
- Sugestões locais limitadas a seis, com referência documentada do Google autocomplete, sem afirmar ranking de volume ou enviar buscas de visitantes ao Google. Regiões cadastradas continuam pesquisáveis.
- Três Boosts demonstrativos na primeira visita, elegíveis após todos os filtros, persistência de encerramentos e contorno marrom. Ver todos ao fim das listas e Ver mais somente quando há anúncios adicionais.
- Busca inteligente: nomenclatura unificada, prévia de até três imóveis e Ver todas com filtros persistidos. Janela simplificada com Busca/Código, transação, tipo, cidade/bairro, botões 1+/2+/3+/4+ e preços mínimo/máximo; critérios adicionais em Mais filtros.

## 0.9.0 — 2026-10-02

- Exploração por bairros com cards, páginas regionais, quantidades e buscas filtradas, preservando a prioridade de Boost elegível.
- Cadastro mais legível, sem atalhos numerados; finalidade vazia inicialmente e confirmação obrigatória, invalidada ao editar o anúncio.
- Acesso ao perfil na tela de cadastro e conexão da prévia local à API publicada de IA, sem chave local. Atualização em tempo real habilitada no navegador lateral.
- Validados lint, tipos, build, 25 testes unitários e 28 testes de navegador, incluindo recarga e layouts de 320 a 1440 px.


## 0.8.1 — 2026-10-02

- Tipagem explícita da resposta do provedor para compatibilidade com o build institucional e normalização de finais de linha do perfil.


## 0.8.0 — 2026-10-02

- Cadastro em página dedicada, com recuperação automática de rascunho e fotos após F5, etapas e descarte explícito.
- Fotos próprias, tags de diferenciais com revisão de escrita, cor personalizada, tipos ampliados e máscaras de valores/áreas; quartos e banheiros começam em um.
- CEP preenche endereço revisável; venda e locação simultâneas têm valores separados e participação nas duas buscas.
- Ajuda com IA pede dados mínimos e confirmação, gera título/descrição revisáveis e preserva sugestão no rascunho. Nova API protegida por origem, limites e validação, sem fotos, CEP ou número enviados ao provedor.


## 0.7.0 — 2026-09-30

- Perfil no cabeçalho com login em pop-up e acesso rápido à área da equipe; credenciais não são enviadas ou armazenadas.
- Cadastro local de até dez imóveis, edição e exclusão, galeria inicial ou fotos JPG/PNG/WebP comprimidas no navegador.
- Imóveis cadastrados aparecem no catálogo, filtros, sugestões de localização e promoção; detalhes em /imovel/cadastrado/?ref=... com galeria, contato e financiamento.
- Sessão de apresentação na aba e dados locais no navegador, sem autenticação real, painel remoto ou banco.


## 0.6.2 — 2026-09-30

- Removido link Referência dos dados e valores dos detalhes.
- Selo Melhor opção transferido para Até vender/Até alugar; retirado Mais tempo de 30 dias.


## 0.6.1 — 2026-09-30

- Contraste do botão Promover corrigido no cabeçalho escuro, inclusive no menu mobile.


## 0.6.0 — 2026-09-30

- Busca com IA reconhece cor e aceita Enter para enviar (Shift+Enter mantém quebra de linha); filtro de cor persiste em Ver tudo e na pesquisa completa.
- Promover no menu abre planos simulados, seleção de imóvel, confirmação e encerramento. Boosts locais com validade, contorno marrom e até três prioridades, sempre após todos os filtros.


## 0.5.3 — 2026-09-30

- Busca com IA destacada com fundo bege, borda dourada suave e brilho discreto do ícone em GSAP, sem movimento quando reduzido.
- Ver tudo aplica o conjunto completo de filtros e abre a listagem mesmo quando o destino é a URL atual; critérios antigos são substituídos e a recarga mantém a busca.

## 0.5.2 — 2026-09-30

- Filtros abertos por Ver tudo exibem também o diferencial recebido da IA, incluindo variações de escrita e combinações.

## 0.5.1 — 2026-09-30

- Painel da IA exibe somente seu pedido e sugestões. Ver tudo abre a pesquisa manual com filtros aplicados; busca anterior não confunde os resultados atuais.
## 0.5.0 — 2026-09-30

- Pesquisa completa com cidade, bairro e condomínio dependentes; características, preço, áreas e código.
- Busca com IA como quarta opção, resposta em streaming, três sugestões e Ver tudo com filtros na URL. Servidor institucional usa Responses API, sem expor chave.
- Limites mínimo, máximo e quantidade exata preservados na busca natural. Filtros de dados desconhecidos não inventam valores.
- Entrada sem foto sob o título; selos repetidos removidos e contato WhatsApp flutuante simulado.
## 0.4.1 — 2026-09-29

- Filtros em coluna até 540 px, com texto completo e campos de 50 px.
- Ordenação separada da contagem de resultados, com fonte de 16 px e campo largo.
- Prazo e juros separados em 320 px; título do contato mais compacto e placeholder curto.
- Galeria com quebra de legenda e setas de 44 px. Teste de encaixe de todas as opções entre 320 e 700 px.

## 0.4.0 — 2026-09-29

- Busca acessível com sugestões locais e consulta de CEP e ruas via ViaCEP, seleção por teclado, cancelamento de consultas e estados de erro.
- Painel integrado, sem recorte em degrau ou foco sobreposto, e remoção da indicação de cidades no rodapé da entrada.
- Dormitórios por limite máximo: até 1, 2, 3, 4 ou 5.
- 48 imagens ilustrativas do Unsplash substituem todas as fotografias com marca d'água. Créditos, licença e caráter ilustrativo preservados.
- Manifesto 3D passa a sinalizar que as galerias de inspiração não são capturas consistentes de um mesmo imóvel.


## 0.3.0 — 2026-09-29

- Entrada editorial com cabeçalho escuro, fotografia local do Alphaville II em moldura e detalhes em dourado fosco.
- Abertura decorativa de 1,45 segundo com a logo oficial, sem bloqueio de interação, armazenamento ou espera por downloads. Desativada com movimento reduzido e navegação por filtros/âncoras.
- Composição mobile com título e busca antes da fotografia, controles de toque e campos de 16 px.
- Oito testes de navegador, incluindo busca mobile e leitura sem JavaScript.


## 0.2.0 — 2026-09-29

- Resumo financeiro com hierarquia de valores, prazo e juros mais legíveis e total das parcelas separado.
- WhatsApp como primeira ação dourada, solicitação de contato secundária.
- Espaço de vídeo 3D nas seis páginas, cadastro opcional tipado, player nativo e manifesto de fotos para a futura ferramenta de geração.

## 0.1.0 — 2026-09-29

- Catálogo demonstrativo com seis imóveis, filtros combinados e ordenação por preço.
- Páginas individuais, oito fotos por imóvel, galerias acessíveis e contatos simulados.
- Financiamento Price editável, custos de locação separados e fontes registradas.
- Identidade em preto, bege, branco e dourado, fontes locais e movimento GSAP com redução de animações.
- Exportação estática para a rota institucional, testes de cálculo, catálogo e navegador entre 320 e 1440 px.
