export const boostPlans = [
  { id: "week", label: "7 dias", days: 7, price: 49, description: "Uma semana para ganhar visibilidade." },
  { id: "month", label: "30 dias", days: 30, price: 149, description: "Mais tempo para encontrar a pessoa certa." },
  { id: "until-sold", label: "Até vender", days: null, price: 299, description: "Sem prazo fixo. Encerre ao vender ou alugar." },
] as const;
export type BoostPlan = typeof boostPlans[number]["id"];
export type Promotion = { reference: string; plan: BoostPlan; startedAt: number; expiresAt: number | null };
export const promotionStorageKey = "aldenn-imoveis-demo-boosts-v1";

export function createPromotion(reference: string, planId: BoostPlan, now = Date.now()): Promotion {
  const plan = boostPlans.find((item) => item.id === planId);
  if (!plan || !reference.trim() || !Number.isFinite(now)) throw new Error("Promoção inválida");
  return { reference, plan: planId, startedAt: now, expiresAt: plan.days === null ? null : now + plan.days * 86400000 };
}

/** Local demo data is untrusted; discard unknown references, malformed records and expired boosts. */
export function restorePromotions(value: unknown, references: string[], now = Date.now()): Promotion[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value.slice(0, 100).filter((item): item is Promotion => {
    if (!item || typeof item !== "object" || !references.includes(item.reference) || seen.has(item.reference) || !Number.isFinite(item.startedAt) || item.startedAt > now) return false;
    const plan = boostPlans.find((plan) => plan.id === item.plan);
    if (!plan) return false;
    const expected = plan.days === null ? null : item.startedAt + plan.days * 86400000;
    if (item.expiresAt !== expected || (expected !== null && expected <= now)) return false;
    seen.add(item.reference); return true;
  });
}

/** Apply AFTER every search filter. At most three eligible campaigns lead the list. */
export function prioritizePromotions<T extends { reference: string }>(results: T[], campaigns: Promotion[], now = Date.now()) {
  const active = new Map(campaigns.filter((item) => item.startedAt <= now && (item.expiresAt === null || item.expiresAt > now)).map((item) => [item.reference, item]));
  const promoted = results.filter((item) => active.has(item.reference)).sort((a, b) => active.get(b.reference)!.startedAt - active.get(a.reference)!.startedAt).slice(0, 3);
  const references = new Set(promoted.map((item) => item.reference));
  return { results: [...promoted, ...results.filter((item) => !references.has(item.reference))], promoted: references };
}
