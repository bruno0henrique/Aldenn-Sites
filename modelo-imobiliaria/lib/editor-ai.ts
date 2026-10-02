import { propertyTypes, landTypes } from "./property";
export type CopyFacts = { type: string; purpose: string; city: string; neighborhood: string; development: string; price: number; rentPrice: number | null; area: number; bedrooms: number; bathrooms: number; features: string[] };
export function validateCopyFacts(value: unknown): CopyFacts {
  if (!value || typeof value !== "object") throw new Error("Confirme os dados do imóvel.");
  const item = value as CopyFacts;
  if (!propertyTypes.includes(item.type as typeof propertyTypes[number]) || !["venda", "locacao", "ambos"].includes(item.purpose)) throw new Error("Escolha tipo e finalidade.");
  for (const key of ["city", "neighborhood", "development"] as const) if (typeof item[key] !== "string" || item[key].length > 120 || (key !== "development" && !item[key].trim())) throw new Error("Preencha cidade e bairro.");
  if (![item.price, item.area].every((entry) => typeof entry === "number" && Number.isFinite(entry) && entry > 0 && entry <= 1e9) || (item.purpose === "ambos" && !(typeof item.rentPrice === "number" && Number.isFinite(item.rentPrice) && item.rentPrice > 0 && item.rentPrice <= 1e9))) throw new Error("Preencha valores e área.");
  if (![item.bedrooms, item.bathrooms].every((entry) => Number.isInteger(entry) && entry >= 0 && entry <= 30)) throw new Error("Revise quartos e banheiros.");
  if (!Array.isArray(item.features) || item.features.length > 20 || !item.features.every((tag) => typeof tag === "string" && tag.length <= 120 && tag.trim())) throw new Error("Revise os diferenciais.");
  // Whitelist: address number, CEP, photos, descriptions and unrelated fields never go to OpenAI.
  return { type: item.type, purpose: item.purpose, city: item.city.trim(), neighborhood: item.neighborhood.trim(), development: item.development.trim(), price: item.price, rentPrice: item.purpose === "ambos" ? item.rentPrice : null, area: item.area, bedrooms: landTypes.includes(item.type) ? 0 : item.bedrooms, bathrooms: landTypes.includes(item.type) ? 0 : item.bathrooms, features: item.features };
}
export const copySchema = { type: "object", additionalProperties: false, required: ["title", "description"], properties: { title: { type: "string" }, description: { type: "string" } } };
export function validateCopy(value: unknown): { title: string; description: string } {
  const item = value as { title?: unknown; description?: unknown };
  if (!item || typeof item.title !== "string" || !item.title.trim() || item.title.length > 120 || typeof item.description !== "string" || !item.description.trim() || item.description.length > 2000) throw new Error("Texto inválido.");
  return { title: item.title.trim(), description: item.description.trim() };
}
