"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocalCatalog } from "./local-catalog";
import { createPromotion, promotionStorageKey, restorePromotions, type BoostPlan, type Promotion } from "@/lib/promotions";

const Context = createContext<{ campaigns: Promotion[]; promote: (reference: string, plan: BoostPlan) => boolean; stop: (reference: string) => void } | null>(null);
export function PromotionProvider({ children }: { children: ReactNode }) {
  const { properties } = useLocalCatalog();
  const references = useMemo(() => properties.map((item) => item.reference), [properties]);
  const [campaigns, setCampaigns] = useState<Promotion[]>([]);
  useEffect(() => {
    const load = () => { try { const stored = localStorage.getItem(promotionStorageKey); const initial = ["27236", "24477", "26556"].filter((reference) => references.includes(reference)).map((reference, index) => createPromotion(reference, "week", Date.now() - index)); if (stored === null) localStorage.setItem(promotionStorageKey, JSON.stringify(initial)); setCampaigns(restorePromotions(stored === null ? initial : JSON.parse(stored), references)); } catch { setCampaigns([]); } };
    load();
    const sync = (event: StorageEvent) => { if (event.key === promotionStorageKey) load(); };
    window.addEventListener("storage", sync);
    const timer = window.setInterval(() => setCampaigns((current) => { const next = restorePromotions(current, references); return next.length === current.length ? current : next; }), 1000);
    return () => { window.removeEventListener("storage", sync); window.clearInterval(timer); };
  }, [references]);
  function save(next: Promotion[]) {
    setCampaigns(next);
    try { localStorage.setItem(promotionStorageKey, JSON.stringify(next)); return true; } catch { return false; }
  }
  return <Context.Provider value={{ campaigns, promote: (reference, plan) => save([...campaigns.filter((item) => item.reference !== reference), createPromotion(reference, plan)]), stop: (reference) => { save(campaigns.filter((item) => item.reference !== reference)); } }}>{children}</Context.Provider>;
}
export function usePromotions() { const context = useContext(Context); if (!context) throw new Error("PromotionProvider ausente"); return context; }
