import { contact } from "./brand.ts";
import { dresses, momentForCategory } from "./catalog.ts";
export const moments = ["Casamento", "Madrinha", "Debutante", "Gala", "Outro momento"];
export const preferences = ["Renda delicada", "Clássico e romântico", "Leve e minimalista", "Estruturado e marcante", "Ainda estou descobrindo"];
export const stages = ["Estou começando a pesquisar", "Já reuni algumas referências", "Gostaria de provar modelos"];
export type PlannerValues = { moment: string; preference: string; stage: string; eventDate: string; referenceId: string };
export function selectedReference(id: string) { return dresses.find((dress) => dress.id === id); }
export function referenceForMoment(id: string, moment: string) { const reference = selectedReference(id); return reference && momentForCategory[reference.category] === moment ? reference : undefined; }
export function createWhatsAppUrl(values: PlannerValues): string | null {
 if (!moments.includes(values.moment) || !preferences.includes(values.preference) || !stages.includes(values.stage)) return null;
 let date = "Ainda não definida";
 if (values.eventDate) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(values.eventDate)) return null;
  const parsed = new Date(`${values.eventDate}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== values.eventDate) return null;
  date = new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(parsed);
 }
 const reference = referenceForMoment(values.referenceId, values.moment);
 const lines = ["Olá, Aldenn!", "", "Estou conhecendo a demonstração Aurora Noivas e gostaria de conversar sobre um site para minha loja.", "", "Estas são as escolhas que fiz na demonstração:", `• Ocasião: ${values.moment}`, `• Estilo: ${values.preference}`, `• Etapa da escolha: ${values.stage}`, `• Data do evento: ${date}`];
 if (reference) lines.push(`• Referência ilustrativa: ${reference.title} (${reference.category})`);
 lines.push("", "Gostaria de conhecer as possibilidades para o meu negócio.");
 return `${contact.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
}
