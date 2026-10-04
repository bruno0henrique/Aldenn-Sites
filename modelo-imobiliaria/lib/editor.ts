import { normalize, type Property } from "./property";
export const draftPrefix = "aldenn-imoveis-rascunho-v1:";
export const colors = ["branca", "bege", "cinza", "preta", "marrom", "azul", "verde", "vermelha"];
export const canonicalFeatures = ["Piscina", "Varanda", "Varanda gourmet", "Espaço gourmet", "Churrasqueira", "Escritório", "Academia", "Closet", "Elevador", "Ar-condicionado", "Sacada", "Lavabo", "Jardim", "Quintal", "Portaria 24 horas", "Área de serviço", "Mobiliado", "Energia solar", "Aquecimento solar", "Garagem coberta", "Cozinha planejada"];
export function capitalize(text: string) { const value = text.trim().replace(/\s+/g, " ").toLocaleLowerCase("pt-BR"); return value ? value[0].toLocaleUpperCase("pt-BR") + value.slice(1) : ""; }
function distance(a: string, b: string) { const row = Array.from({ length: b.length + 1 }, (_, i) => i); for (let i = 1; i <= a.length; i++) { let previous = row[0]; row[0] = i; for (let j = 1; j <= b.length; j++) { const old = row[j]; row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1)); previous = old; } } return row[b.length]; }
export function featureTags(values: string[]): string[] {
  const unique = new Map<string, string>();
  for (const value of values) { let tag = capitalize(value.slice(0, 120)); if (!tag) continue; const key = normalize(tag); const exact = canonicalFeatures.find((item) => normalize(item) === key); const matches = key.length >= 5 ? canonicalFeatures.filter((item) => distance(normalize(item), key) <= 1) : []; tag = exact ?? (matches.length === 1 ? matches[0] : tag); unique.set(normalize(tag), tag); }
  return [...unique.values()].slice(0, 20);
}
export type EditorDraft = {
  values: Record<string, string>; photos: Property["images"]; tags: string[]; tagInput: string;
  aiOpen: boolean; aiConfirmed: boolean; aiProposal: { title: string; description: string } | null; savedAt: string;
};
export function initialDraft(property?: Property, extraValues: Record<string, string> = {}): EditorDraft {
  const values: Record<string, string> = { title: "", subtitle: "", description: "", purpose: "", type: "Casa", city: "", neighborhood: "", development: "", cep: "", street: "", addressNumber: "", state: "", price: "", rentPrice: "", condominium: "", iptu: "", builtArea: "", landArea: "", bedrooms: "1", bathrooms: "1", suites: "0", parking: "0", color: "", otherColor: "" };
  if (property) { for (const key of Object.keys(values)) { const value = property[key as keyof Property]; if (typeof value === "string" || typeof value === "number") values[key] = String(value); } values.description = property.description.join("\n\n"); const color = property.colors?.[0] ?? ""; values.color = colors.includes(normalize(color)) ? normalize(color) : color ? "other" : ""; values.otherColor = values.color === "other" ? color : ""; }
  Object.assign(values, extraValues);

  return { values, photos: property?.images.slice(0, 6).map((image) => ({ ...image, thumbnail: image.path })) ?? [], tags: featureTags(property?.features ?? []), tagInput: "", aiOpen: false, aiConfirmed: false, aiProposal: null, savedAt: "" };
}
export function restoreDraft(value: unknown, fallback: EditorDraft): EditorDraft {
  if (!value || typeof value !== "object") return fallback;
  const item = value as EditorDraft;
  if (!item.values || typeof item.values !== "object" || !Array.isArray(item.photos) || item.photos.length > 6 || !item.photos.every((photo) => photo && typeof photo.path === "string" && photo.path.length <= 700000 && (/^data:image\/(webp|jpeg|png);base64,[A-Za-z0-9+/=]+$/.test(photo.path) || /^\/media\/illustrative\/[0-9]+\/[0-9]+\.webp$/.test(photo.path)))) return fallback;
  const values = { ...fallback.values }; for (const key of Object.keys(values)) if (typeof item.values[key] === "string" && item.values[key].length <= 2000) values[key] = item.values[key];
  const proposal = item.aiProposal && typeof item.aiProposal.title === "string" && item.aiProposal.title.length <= 120 && typeof item.aiProposal.description === "string" && item.aiProposal.description.length <= 2000 ? item.aiProposal : null;
  return { values, photos: item.photos, tags: featureTags(Array.isArray(item.tags) ? item.tags.filter((tag) => typeof tag === "string") : []), tagInput: typeof item.tagInput === "string" ? item.tagInput.slice(0, 120) : "", aiOpen: Boolean(item.aiOpen), aiConfirmed: false, aiProposal: proposal, savedAt: typeof item.savedAt === "string" ? item.savedAt : "" };
}
