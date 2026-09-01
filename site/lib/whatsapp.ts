const PHONE = '5512981073663';

export function whatsappUrl(product?: {
  name: string;
  price: string;
  url: string;
}) {
  const message = product
    ? `Oi, Belleland! Tudo bem? Tenho interesse na peça “${product.name}” por ${product.price}. Link: ${product.url}`
    : 'Oi, Belleland! Tudo bem? Quero conhecer as peças disponíveis.';
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
}
