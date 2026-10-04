import type { Property } from "./property";
export const teamKey = "aldenn-imoveis-gestao-v1";
export const propertyStatuses = ["Disponível", "Reservado", "Vendido", "Alugado", "Em revisão"];
export const keyStatuses = ["Não informada", "Na imobiliária", "Com o proprietário", "Retirada para visita", "Sem chave"];
export type TeamNote = { id: string; text: string; at: string };
export type PropertyRecord = { status: string; responsible: string; keyLocation: string; keyAgency: string; keyStatus: string; keyCount: string; notes: TeamNote[] };
export type Development = { id: string; name: string; matchName: string; city: string; neighborhood: string; address: string; stage: string; description: string };
export type TeamData = { records: Record<string, PropertyRecord>; developments: Development[] };
export function emptyRecord(): PropertyRecord { return { status: "Disponível", responsible: "", keyLocation: "", keyAgency: "", keyStatus: "Não informada", keyCount: "", notes: [] }; }
export function seedTeam(properties: Property[]): TeamData {
  const names = [...new Set(properties.map((item) => item.development).filter(Boolean))];
  return { records: {}, developments: names.map((name, index) => {
    const property = properties.find((item) => item.development === name)!;
    return { id: `development-${index}`, name, matchName: name, city: property.city, neighborhood: property.neighborhood, address: "", stage: "Não informado", description: "" };
  }) };
}
export function restoreTeam(value: unknown, fallback: TeamData): TeamData {
  if (!value || typeof value !== "object") return fallback;
  const data = value as TeamData;
  const text = (value: unknown, max = 120): value is string => typeof value === "string" && value.length <= max;
  const records: TeamData["records"] = {};
  if (data.records && typeof data.records === "object" && !Array.isArray(data.records)) {
    for (const [reference, item] of Object.entries(data.records).slice(0, 50)) {
      if (!/^(?:[0-9]{1,20}|DEMO-[0-9]{1,20}|LOCAL-[a-f0-9-]{36})$/.test(reference) || !item || typeof item !== "object") continue;
      if (!propertyStatuses.includes(item.status) || !keyStatuses.includes(item.keyStatus) || ![item.responsible, item.keyAgency, item.keyLocation, item.keyCount].every((value) => text(value))) continue;
      const notes = Array.isArray(item.notes) ? item.notes.filter((note) => note && text(note.id) && text(note.text, 2000) && text(note.at) && Number.isFinite(Date.parse(note.at))).slice(-30) : [];
      records[reference] = { ...emptyRecord(), status: item.status, responsible: item.responsible, keyAgency: item.keyAgency, keyLocation: item.keyLocation, keyCount: item.keyCount, keyStatus: item.keyStatus, notes };
    }
  }
  const developments = Array.isArray(data.developments) ? data.developments.filter((item) => item && [item.id, item.name, item.matchName, item.city, item.neighborhood, item.address, item.stage].every((value) => text(value)) && item.name.trim() && item.city.trim() && text(item.description, 2000)).slice(0, 30) : fallback.developments;
  return { records, developments };
}
