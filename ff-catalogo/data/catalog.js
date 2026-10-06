/**
 * Dados comerciais independentes da apresentação. Nunca converter estoque de venda
 * da origem Wix em disponibilidade de locação para uma data.
 * sizes vazios significam não informado, nunca "todos os tamanhos".
 */
export const brand = {
  name: 'F&F Moda Festa', phone: '5511950243377', phoneLabel: '(11) 95024-3377',
  address: 'Estrada de Itapecerica, 2976, Sobre Loja 2', city: 'São Paulo/SP · CEP 05835-004',
  email: 'ffmodafesta@gmail.com', instagram: 'https://www.instagram.com/ffmodafesta/',
  facebook: 'https://www.facebook.com/ffmodafesta', youtube: 'https://www.youtube.com/@ffmodafesta',
  hours: ['Segunda a sexta, das 10h às 20h', 'Sábado, das 10h às 18h'],
  reviews: [], // Preparado, sem avaliação fictícia.
};
const records = [
  [17, 'sereia-verde-menta', 'Vestido sereia verde menta', 'Verde', 'Verde menta', '', 'Sereia', 'Corset, fenda e alça com laço.', ['Madrinhas', 'Convidadas'], [1,0]],
  [8, 'zibeline-rosa-flor', 'Vestido em zibeline rosa com flor', 'Rosa', 'Rosa bebê', 'Zibeline', 'Tomara que caia', 'Decote com flor e saia longa com fenda.', ['Madrinhas', 'Formatura'], [0]],
  [7, 'zibeline-champanhe', 'Vestido em zibeline champanhe', 'Champanhe', 'Champanhe', 'Zibeline', 'Tomara que caia', 'Modelagem longa, decote reto e fenda.', ['Convidadas', 'Formatura'], [0]],
  [18, 'sereia-azul-marinho', 'Vestido sereia azul marinho', 'Azul', 'Azul marinho', '', 'Sereia', 'Corset, fenda e alça com laço.', ['Formatura', 'Convidadas'], [0,1]],
  [1, 'zibeline-azul-serenity', 'Vestido em zibeline azul serenity', 'Azul', 'Azul serenity', 'Zibeline', 'Tomara que caia', 'Saia longa e aplicação de flor no decote.', ['Madrinhas', 'Formatura'], [0]],
  [6, 'fluido-terracota', 'Vestido fluido terracota', 'Terracota', 'Terracota', '', 'Um ombro só', 'Babado, caimento fluido e fenda.', ['Madrinhas', 'Convidadas'], [0]],
  [11, 'plus-size-marrom-capa', 'Vestido plus size marrom com capa', 'Marrom', 'Marrom', '', 'Capa', 'Capa com flor e modelagem longa.', ['Convidadas', 'Formatura'], [0]],
  [15, 'musseline-azul-capa', 'Vestido em musseline azul marinho', 'Azul', 'Azul marinho', 'Musseline', 'Capa', 'Decote em V, capa e fenda.', ['Madrinhas', 'Convidadas'], [0]],
];
export const products = records.map(([sourceIndex, slug, name, color, colorName, fabric, model, description, occasion, indexes], index) => ({
  id: `ff-${sourceIndex}`, sourceIndex, slug, name, description, fabric: fabric || null, model,
  colors: [color], colorName, sizes: [], length: 'Longo', category: sourceIndex === 11 ? 'Plus Size' : 'Vestidos longos',
  occasion, occasionBasis: 'Curadoria editorial; confirmar adequação e disponibilidade na loja',
  rentalEnabled: true, saleEnabled: false, rentalAvailability: 'consultar', salePrice: null,
  saleStock: null, featured: index >= 4, newArrival: false,
  images: indexes.map(i => ({src: `/media/ff-${sourceIndex}-${i}.webp`, small: `/media/ff-${sourceIndex}-${i}-small.webp`})),
}));
export const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
export function filterProducts(list, filters = {}) {
  return list.filter(p => {
    const haystack = normalize([p.name,p.description,p.colorName,p.fabric,p.model,p.category,...p.occasion,...p.sizes].join(' '));
    return (!filters.q || normalize(filters.q).split(/\s+/).every(word => haystack.includes(word)))
      && (!filters.color || p.colors.includes(filters.color))
      && (!filters.occasion || p.occasion.includes(filters.occasion))
      && (!filters.category || p.category === filters.category)
      && (!filters.fabric || p.fabric === filters.fabric)
      && (!filters.model || p.model === filters.model)
      && (!filters.length || p.length === filters.length)
      // Sem grade confirmada, mostrar como candidato a consultar, nunca afirmar disponibilidade.
      && (!filters.size || p.sizes.length === 0 || p.sizes.includes(filters.size));
  });
}
export function whatsappUrl(product, context = {}) {
  let text = product ? `Olá! Gostaria de verificar a disponibilidade deste vestido para minha data: ${product.name} (${product.id}).` : 'Olá! Gostaria de conhecer os vestidos para locação da F&F Moda Festa e combinar minha prova na loja.';
  if(context.date && /^\d{4}-\d{2}-\d{2}$/.test(context.date)) text += ` Data do evento: ${context.date.split('-').reverse().join('/')}.`;
  if(context.size) text += ` Meu tamanho desejado é ${context.size}. Poderiam confirmar a numeração?`;
  if(context.occasion) text += ` Ocasião: ${context.occasion}.`;
  if(context.url && /^https?:\/\//.test(context.url)) text += ` Referência: ${context.url}`;
  return `https://wa.me/${brand.phone}?text=${encodeURIComponent(text)}`;
}
/** A ativação de vendas exige preço validado e estoque, reutilizando cards/galerias. */
export function commerceMode(product) {
  if(product.saleEnabled && Number.isFinite(product.salePrice) && product.salePrice > 0 && Number.isInteger(product.saleStock) && product.saleStock >= 0) return 'sale';
  return product.rentalEnabled ? 'rental' : 'unavailable';
}
