export function formatPrice(cents: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100);
}
export function digitsToCents(value: string) {
  return Number(value.replace(/\D/g, '') || 0);
}
