import type { Property } from "./property";
export const localPropertyKey = "aldenn-imoveis-cadastros-v1";
export const staffSessionKey = "aldenn-imoveis-equipe-v1";
export function validLocalProperty(value: unknown): value is Property {
  if (!value || typeof value !== "object") return false;
  const item = value as Property;
  const text = (value: unknown, max = 120) => typeof value === "string" && value.trim().length > 0 && value.length <= max;
  const quantity = (value: unknown) => typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 30;
  const amount = (value: unknown, max: number, optional = false) => (optional && value === null) || (typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= max);
  return /^LOCAL-[a-f0-9-]{36}$/.test(item.reference) && item.slug === "cadastrado" && text(item.title) && text(item.subtitle) && text(item.city) && text(item.neighborhood) && typeof item.development === "string" && item.development.length <= 120 && ["venda", "locacao"].includes(item.purpose) && ["Casa", "Apartamento"].includes(item.type) && amount(item.price, 1e9) && item.price > 0 && amount(item.builtArea, 1e6) && Number(item.builtArea) > 0 && amount(item.landArea, 1e6, true) && amount(item.condominium, 1e7, true) && amount(item.iptu, 1e7, true) && quantity(item.bedrooms) && quantity(item.suites) && item.suites <= item.bedrooms && quantity(item.parking) && (item.bathrooms === null || quantity(item.bathrooms)) && Array.isArray(item.description) && item.description.length > 0 && item.description.length <= 5 && item.description.every((value) => text(value, 2000)) && Array.isArray(item.features) && item.features.length <= 20 && item.features.every((value) => text(value)) && Array.isArray(item.amenities) && item.amenities.length <= 20 && item.amenities.every((value) => text(value)) && Array.isArray(item.images) && item.images.length >= 1 && item.images.length <= 6 && item.images.every((image) => typeof image.path === "string" && image.path.length <= 700000 && (/^\/media\/illustrative\/[0-9]+\/[0-9]+\.webp$/.test(image.path) || /^data:image\/(?:webp|jpeg|png);base64,[A-Za-z0-9+/=]+$/.test(image.path)) && image.thumbnail === image.path && amount(image.width, 10000) && amount(image.height, 10000)) && Array.isArray(item.colors) && item.colors.length <= 8 && item.colors.every((color) => ["branca", "bege", "cinza", "preta", "marrom", "azul", "verde", "vermelha"].includes(color)) && item.sourceUrl === "" && typeof item.consultedAt === "string" && Number.isFinite(Date.parse(item.consultedAt)) && !item.video3d;
}
export function restoreLocalProperties(value: unknown): Property[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value.slice(0, 10).filter((item) => { if (!validLocalProperty(item) || seen.has(item.reference)) return false; seen.add(item.reference); return true; });
}
export function propertyHref(property: Pick<Property, "slug" | "reference">) { return property.reference.startsWith("LOCAL-") ? `/imovel/cadastrado/?ref=${encodeURIComponent(property.reference)}` : `/imovel/${property.slug}/`; }
