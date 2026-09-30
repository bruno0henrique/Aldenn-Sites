export type PropertyImage = {
  path: string; thumbnail: string; width: number; height: number;
  sourceUrl: string; sha256: string; sourcePage?: string; author?: string; license?: string; illustrative?: boolean;
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
  colors?: string[]; // Tons visuais das fotografias demonstrativas, não da ficha original.
};

export type Filters = {
  purpose: string; location: string; type: string; bedrooms: string;
  minPrice: string; maxPrice: string; sort: string;
  city: string; neighborhood: string; development: string;
  bathrooms: string; suites: string; parking: string;
  minBedrooms: string; minBathrooms: string; minSuites: string; minParking: string;
  areaType: string; minArea: string; maxArea: string; reference: string; feature: string; color: string;
};

export const defaultFilters: Filters = {
  purpose: "", location: "", type: "", bedrooms: "", minPrice: "", maxPrice: "", sort: "selection",
  city: "", neighborhood: "", development: "", bathrooms: "", suites: "", parking: "",
  minBedrooms: "", minBathrooms: "", minSuites: "", minParking: "",
  areaType: "built", minArea: "", maxArea: "", reference: "", feature: "", color: "",
};

export function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

type SearchableProperty = Pick<Property, "purpose" | "type" | "price" | "city" | "neighborhood" | "development" | "bedrooms"> &
  Partial<Pick<Property, "bathrooms" | "suites" | "parking" | "builtArea" | "landArea" | "reference" | "features" | "amenities" | "colors">>;

export function filterProperties<T extends SearchableProperty>(properties: T[], filters: Filters): T[] {
  const location = normalize(filters.location.trim()).split(/[\s,]+/).filter(Boolean);
  const matchesNumber = (value: number | null | undefined, limit: string, minimum = false) =>
    !limit || (typeof value === "number" && Number.isFinite(Number(limit)) && Number(limit) >= 0 && (minimum ? value >= Number(limit) : value <= Number(limit)));
  const result = properties.filter((property) => {
    const area = filters.areaType === "land" ? property.landArea : property.builtArea;
    return (
    (!filters.purpose || property.purpose === filters.purpose) &&
    (!filters.type || property.type === filters.type) &&
    (!filters.city || property.city === filters.city) &&
    (!filters.neighborhood || property.neighborhood === filters.neighborhood) &&
    (!filters.development || property.development === filters.development) &&
    (!location.length || location.every((token) => normalize(`${property.city} ${property.neighborhood} ${property.development}`).includes(token))) &&
    matchesNumber(property.bedrooms, filters.bedrooms) &&
    matchesNumber(property.bathrooms, filters.bathrooms) &&
    matchesNumber(property.suites, filters.suites) &&
    matchesNumber(property.parking, filters.parking) &&
    matchesNumber(property.bedrooms, filters.minBedrooms, true) &&
    matchesNumber(property.bathrooms, filters.minBathrooms, true) &&
    matchesNumber(property.suites, filters.minSuites, true) &&
    matchesNumber(property.parking, filters.minParking, true) &&
    matchesNumber(area, filters.minArea, true) &&
    matchesNumber(area, filters.maxArea) &&
    matchesNumber(property.price, filters.minPrice, true) &&
    matchesNumber(property.price, filters.maxPrice) &&
    (!filters.color || (property.colors ?? []).includes(filters.color)) &&
    (!filters.reference || normalize(property.reference ?? "").includes(normalize(filters.reference.trim()))) &&
    (!filters.feature || filters.feature.split("|").every((term) => normalize([...(property.features ?? []), ...(property.amenities ?? [])].join(" ")).includes(normalize(term.trim()))))
    );
  });
  if (filters.sort === "lowest") result.sort((a, b) => a.price - b.price);
  if (filters.sort === "highest") result.sort((a, b) => b.price - a.price);
  return result;
}
