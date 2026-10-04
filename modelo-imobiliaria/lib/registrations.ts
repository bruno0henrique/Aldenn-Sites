export type PersonKind = "proprietarios" | "inquilinos";
export type RegistrationField = { key: string; label: string; type?: string; options?: string[]; required?: boolean };
export type RegistrationSection = { title: string; fields: RegistrationField[] };
const f = (key: string, label: string, type = "text", required = false): RegistrationField => ({ key, label, type, required });
const select = (key: string, label: string, options: string[]): RegistrationField => ({ key, label, options });
export const commonPersonSections: RegistrationSection[] = [
  { title: "Identificação", fields: [f("name", "Nome completo / razão social", "text", true), select("entity", "Pessoa", ["Física", "Jurídica"]), f("document", "CPF / CNPJ"), f("identity", "RG / inscrição estadual"), f("birth", "Nascimento / abertura", "date"), select("marital", "Estado civil", ["Solteiro(a)", "Casado(a)", "União estável", "Divorciado(a)", "Viúvo(a)"]), f("nationality", "Nacionalidade"), f("profession", "Profissão / atividade"), f("representative", "Representante legal"), f("spouse", "Cônjuge / sócio responsável")] },
  { title: "Contato e endereço", fields: [f("email", "E-mail", "email"), f("phone", "Telefone", "tel"), f("whatsapp", "WhatsApp", "tel"), select("preferred", "Contato preferido", ["WhatsApp", "Telefone", "E-mail"]), f("cep", "CEP"), f("street", "Rua"), f("number", "Número / S/N"), f("complement", "Complemento"), f("neighborhood", "Bairro"), f("city", "Cidade"), f("state", "UF"), f("emergency", "Contato alternativo")] },
];
export function personSections(kind: PersonKind): RegistrationSection[] {
  return [...commonPersonSections, kind === "proprietarios" ? { title: "Propriedade e atendimento", fields: [f("ownership", "Participação na propriedade (%)", "number"), f("authorization", "Autorização para anunciar"), f("availability", "Disponibilidade para contato"), f("paymentPreference", "Preferência de recebimento"), f("notes", "Observações internas", "textarea")] } : { title: "Locação e perfil", fields: [f("employer", "Empresa / atividade profissional"), f("income", "Renda mensal (R$)", "number"), f("occupants", "Quantidade de moradores", "number"), f("pets", "Animais de estimação"), select("guarantee", "Garantia pretendida", ["Caução", "Seguro-fiança", "Fiador", "Título de capitalização", "A definir"]), f("guarantor", "Nome do fiador"), f("guarantorContact", "Contato do fiador"), f("moveDate", "Data prevista de mudança", "date"), f("contractStart", "Início da locação", "date"), f("contractEnd", "Fim da locação", "date"), f("notes", "Observações internas", "textarea")] }];
}
export const propertyInternalSections: RegistrationSection[] = [
  { title: "Construção e ambientes", fields: [f("usableArea", "Área útil (m²)", "number"), f("frontage", "Frente do terreno (m)", "number"), f("depth", "Profundidade do terreno (m)", "number"), f("yearBuilt", "Ano de construção", "number"), f("renovated", "Última reforma", "number"), f("floors", "Pavimentos", "number"), f("floor", "Andar / unidade"), select("condition", "Estado de conservação", ["Novo", "Excelente", "Bom", "Precisa de reforma", "Em construção"]), select("furnished", "Mobília", ["Sem mobília", "Parcialmente mobiliado", "Mobiliado"]), select("sun", "Posição solar", ["Manhã", "Tarde", "Manhã e tarde"]), f("livingRooms", "Salas", "number"), f("lavatories", "Lavabos", "number"), f("coveredSpaces", "Vagas cobertas", "number"), f("flooring", "Revestimentos / pisos"), f("accessibility", "Acessibilidade"), f("utilities", "Água, energia, gás e internet")] },
  { title: "Documentação e negociação", fields: [f("registry", "Matrícula do imóvel"), f("registryOffice", "Cartório de registro"), f("municipalNumber", "Inscrição municipal / IPTU"), select("deed", "Escritura e registro", ["Regularizados", "Em regularização", "A conferir"]), select("occupancyPermit", "Habite-se", ["Disponível", "Em regularização", "A conferir", "Não se aplica"]), select("financing", "Aceita financiamento", ["Sim", "Não", "A confirmar"]), select("fgts", "Possibilidade de FGTS", ["A analisar", "Não se aplica"]), select("exchange", "Aceita permuta", ["Sim", "Não", "A negociar"]), f("exchangeTerms", "Condições da permuta"), f("commission", "Comissão acordada (%)", "number"), select("exclusive", "Exclusividade", ["Sim", "Não"]), f("authorizationEnd", "Validade da autorização", "date"), f("negotiationNotes", "Condições e pendências", "textarea")] },
  { title: "Vínculos e operação", fields: [f("broker", "Corretor responsável"), f("creci", "CRECI do corretor"), select("occupancy", "Ocupação atual", ["Desocupado", "Proprietário ocupa", "Locado", "Em construção"]), f("availableFrom", "Disponível a partir de", "date"), f("visits", "Horários / instruções de visita"), f("keyAgency", "Imobiliária com a chave"), f("keyLocation", "Local da chave"), f("keyId", "Identificação da chave"), f("internalNotes", "Observações da equipe", "textarea")] },
];
export type PersonRecord = { id: string; kind: PersonKind; values: Record<string, string>; propertyRefs: string[]; updatedAt: string };
export const peopleKey = "aldenn-imoveis-pessoas-v1";
export const extrasKey = "aldenn-imoveis-fichas-internas-v1";
export const extraKeys = [...propertyInternalSections.flatMap((section) => section.fields.map((field) => field.key)), "ownerId", "tenantId"];
export function cleanValues(value: unknown, keys: string[]): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const source = value as Record<string, unknown>;
  return Object.fromEntries(keys.filter((key) => typeof source[key] === "string").map((key) => [key, (source[key] as string).slice(0, key.toLowerCase().includes("notes") ? 2000 : 120)]));
}
export function restorePeople(value: unknown): PersonRecord[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value.slice(0, 100).flatMap((item) => {
    if (!item || typeof item !== "object" || !/^[a-f0-9-]{36}$/.test(item.id) || seen.has(item.id) || !["proprietarios", "inquilinos"].includes(item.kind)) return [];
    const values = cleanValues(item.values, personSections(item.kind).flatMap((section) => section.fields.map((field) => field.key)));
    if (!values.name?.trim()) return [];
    seen.add(item.id);
    return [{ id: item.id, kind: item.kind, values, propertyRefs: Array.isArray(item.propertyRefs) ? item.propertyRefs.filter((ref: unknown) => typeof ref === "string" && /^[A-Za-z0-9-]{1,50}$/.test(ref)).slice(0, 100) : [], updatedAt: typeof item.updatedAt === "string" && Number.isFinite(Date.parse(item.updatedAt)) ? item.updatedAt : "" }];
  });
}
export function readPeople() { try { return restorePeople(JSON.parse(localStorage.getItem(peopleKey) || "[]")); } catch { return []; } }
export function readExtras(reference: string): Record<string, string> { try { return cleanValues(JSON.parse(localStorage.getItem(`${extrasKey}:${reference}`) || "{}"), extraKeys); } catch { return {}; } }
export function saveExtras(reference: string, values: Record<string, string>) { localStorage.setItem(`${extrasKey}:${reference}`, JSON.stringify(cleanValues(values, extraKeys))); }
