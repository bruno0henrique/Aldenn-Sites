import { validLocalProperty } from "./local-properties";
import type { Property } from "./property";
export const stockOverrideKey = "aldenn-imoveis-edicoes-v1";
export function validStockOverride(value: unknown, originals: Property[]): value is Property {
  if (!value || typeof value !== "object") return false;
  const item = value as Property;
  const original = originals.find((entry) => entry.reference === item.reference && entry.slug === item.slug);
  if (!original) return false;
  return validLocalProperty({ ...item, reference: "LOCAL-00000000-0000-4000-8000-000000000000", slug: "cadastrado", sourceUrl: "", video3d: undefined });
}
export function restoreStockOverrides(value: unknown, originals: Property[]): Property[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value.slice(0, originals.length).filter((item) => {
    if (!validStockOverride(item, originals) || seen.has(item.reference)) return false;
    seen.add(item.reference); return true;
  });
}
