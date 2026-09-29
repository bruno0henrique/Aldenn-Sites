export type PropertyImage = {
  path: string; thumbnail: string; width: number; height: number;
  sourceUrl: string; sha256: string;
};

/** Arquivos locais em public/, sem basePath. Preenchido após gerar o vídeo. */
export type PropertyVideo3D = {
  src: string;
  poster?: string;
  captions?: string;
};

export type Property = {
  reference: string; slug: string; title: string; subtitle: string;
  purpose: "venda" | "locacao"; type: "Casa" | "Apartamento";
  city: string; neighborhood: string; development: string;
  price: number; condominium: number | null; iptu: number | null;
  builtArea: number | null; landArea: number | null;
  bedrooms: number; suites: number; bathrooms: number | null; parking: number;
  description: string[]; features: string[]; amenities: string[];
  sourceUrl: string; consultedAt: string; images: PropertyImage[];
  video3d?: PropertyVideo3D;
};

export type Filters = {
  purpose: string; location: string; type: string; bedrooms: string;
  minPrice: string; maxPrice: string; sort: string;
};

export const defaultFilters: Filters = { purpose: "", location: "", type: "", bedrooms: "", minPrice: "", maxPrice: "", sort: "selection" };

export function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function filterProperties<T extends Pick<Property, "purpose" | "type" | "price" | "city" | "neighborhood" | "development" | "bedrooms">>(properties: T[], filters: Filters): T[] {
  const location = normalize(filters.location.trim());
  const result = properties.filter((property) =>
    (!filters.purpose || property.purpose === filters.purpose) &&
    (!filters.type || property.type === filters.type) &&
    (!location || normalize(`${property.city} ${property.neighborhood} ${property.development}`).includes(location)) &&
    (!filters.bedrooms || property.bedrooms >= Number(filters.bedrooms)) &&
    (!filters.minPrice || property.price >= Number(filters.minPrice)) &&
    (!filters.maxPrice || property.price <= Number(filters.maxPrice)));
  if (filters.sort === "lowest") result.sort((a, b) => a.price - b.price);
  if (filters.sort === "highest") result.sort((a, b) => b.price - a.price);
  return result;
}
