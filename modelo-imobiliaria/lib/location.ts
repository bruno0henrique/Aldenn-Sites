import { normalize } from "./property.ts";

export type LocationSuggestion = { id: string; label: string; detail: string; location: string; kind: "Cidade" | "Bairro" | "Condomínio" | "Endereço" };
type LocationProperty = { city: string; neighborhood: string; development: string };
export function localSuggestions(properties: LocationProperty[], query: string): LocationSuggestion[] {
  const entries = new Map<string, LocationSuggestion>();
  for (const property of properties) {
    for (const [kind, label] of [["Cidade", property.city], ["Bairro", property.neighborhood], ["Condomínio", property.development]] as const) {
      const id = `${kind}:${label}`;
      if (!entries.has(id)) entries.set(id, { id, kind, label, detail: kind === "Cidade" ? "São Paulo" : property.city, location: kind === "Cidade" ? label : `${label} ${property.city}` });
    }
  }
  const tokens = normalize(query.trim()).split(/\s+/).filter(Boolean);
  return [...entries.values()].filter((entry) => tokens.every((token) => normalize(`${entry.label} ${entry.detail}`).includes(token))).slice(0, 6);
}
export type PostalAddress = { cep?: string; logradouro?: string; bairro?: string; localidade?: string; uf?: string; erro?: boolean | string };
export function addressSuggestion(address: PostalAddress): LocationSuggestion | null {
  if (address.erro || !address.localidade) return null;
  const label = address.logradouro || address.bairro || address.localidade;
  return { id: `cep:${address.cep}:${label}`, label, detail: [address.bairro, `${address.localidade}, ${address.uf || "SP"}`, address.cep].filter(Boolean).join(" · "), location: [address.bairro, address.localidade].filter(Boolean).join(" "), kind: "Endereço" };
}
export function postalDigits(query: string): string | null {
  return /^\d{5}-?\d{3}$/.test(query.trim()) ? query.replace(/\D/g, "") : null;
}
