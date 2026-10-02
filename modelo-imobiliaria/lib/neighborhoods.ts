import { normalize, type Property } from "./property";
export type Neighborhood = { city: string; name: string; properties: Property[]; sales: number; rentals: number };
export function neighborhoodGroups(properties: Property[]): Neighborhood[] {
  const groups = new Map<string, Neighborhood>();
  for (const property of properties) { const key = `${normalize(property.city.trim())}|${normalize(property.neighborhood.trim())}`; if (!property.neighborhood.trim()) continue; const group = groups.get(key) ?? { city: property.city, name: property.neighborhood, properties: [], sales: 0, rentals: 0 }; group.properties.push(property); if (property.purpose !== "locacao") group.sales++; if (property.purpose !== "venda") group.rentals++; groups.set(key, group); }
  return [...groups.values()].sort((a, b) => b.properties.length - a.properties.length || a.name.localeCompare(b.name, "pt-BR"));
}
export function neighborhoodHref(group: Pick<Neighborhood, "city" | "name">) { return `/bairro/?${new URLSearchParams({ city: group.city, neighborhood: group.name })}`; }
export function neighborhoodSearch(group: Pick<Neighborhood, "city" | "name">, purpose = "") { return `/?${new URLSearchParams({ city: group.city, neighborhood: group.name, ...(purpose ? { purpose } : {}) })}#imoveis`; }
