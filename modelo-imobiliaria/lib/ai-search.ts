import { defaultFilters, type Filters } from "./property";

const numericKeys = new Set(["bedrooms", "bathrooms", "suites", "parking", "minBedrooms", "minBathrooms", "minSuites", "minParking", "minPrice", "maxPrice", "minArea", "maxArea"]);
const enums: Record<string, string[]> = { purpose: ["", "venda", "locacao"], type: ["", "Casa", "Apartamento"], areaType: ["built", "land"], sort: ["selection", "lowest", "highest"] };
export const searchSchema = {
  type: "object", additionalProperties: false, required: ["message", "filters"], properties: {
    message: { type: "string" },
    filters: { type: "object", additionalProperties: false, required: Object.keys(defaultFilters), properties: Object.fromEntries(Object.keys(defaultFilters).map((key) => [key, enums[key] ? { type: "string", enum: enums[key] } : { type: "string" }])) },
  },
};

export function validateSearch(value: unknown): { message: string; filters: Filters } {
  if (!value || typeof value !== "object") throw new Error("Resposta inválida");
  const { message, filters } = value as { message: unknown; filters: unknown };
  if (typeof message !== "string" || !message.trim() || message.length > 1000 || !filters || typeof filters !== "object") throw new Error("Resposta inválida");
  const result = { ...defaultFilters };
  for (const key of Object.keys(defaultFilters) as (keyof Filters)[]) {
    const entry = (filters as Record<string, unknown>)[key];
    if (typeof entry !== "string" || entry.length > 120 || (enums[key] && !enums[key].includes(entry)) || (numericKeys.has(key) && entry !== "" && (!/^\d+(\.\d+)?$/.test(entry) || Number(entry) > 1e10))) throw new Error("Filtro inválido");
    result[key] = entry;
  }
  return { message, filters: result };
}

/** Only the public search summary is streamed; never model reasoning or raw JSON. */
export function partialMessage(json: string): string {
  const match = json.match(/"message"\s*:\s*"((?:[^"\\]|\\(?:["\\/bfnrt]|u[0-9a-fA-F]{4}))*)/);
  if (!match) return "";
  try { return JSON.parse(`"${match[1]}"`); } catch { return ""; }
}

export function searchHref(filters: Filters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => { if (value !== defaultFilters[key as keyof Filters]) params.set(key, value); });
  return `/demonstracao-imobiliaria/?${params}#imoveis`;
}

export type SearchEvent = { type: "delta"; text: string } | { type: "complete"; message: string; filters: Filters; count: number } | { type: "error"; message: string };
