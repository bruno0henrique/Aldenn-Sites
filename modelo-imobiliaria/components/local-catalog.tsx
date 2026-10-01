"use client";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { properties as initialProperties } from "@/data/properties";
import type { Property } from "@/lib/property";
import { localPropertyKey, restoreLocalProperties, staffSessionKey, validLocalProperty } from "@/lib/local-properties";
const Context = createContext<{ properties: Property[]; local: Property[]; ready: boolean; staff: boolean; login: () => void; logout: () => void; save: (property: Property) => void; remove: (reference: string) => void } | null>(null);
export function LocalCatalog({ children }: { children: ReactNode }) {
  const [local, setLocal] = useState<Property[]>([]), [staff, setStaff] = useState(false), [ready, setReady] = useState(false);
  useEffect(() => {
    const load = () => { try { setLocal(restoreLocalProperties(JSON.parse(localStorage.getItem(localPropertyKey) || "[]"))); } catch { setLocal([]); } };
    let active = true;
    queueMicrotask(() => { if (!active) return; load(); try { setStaff(sessionStorage.getItem(staffSessionKey) === "1"); } catch { /* Session is still usable in memory. */ } setReady(true); });
    const sync = (event: StorageEvent) => { if (event.key === localPropertyKey) load(); }; window.addEventListener("storage", sync); return () => { active = false; window.removeEventListener("storage", sync); };
  }, []);
  const properties = useMemo(() => [...initialProperties, ...local], [local]);
  function persist(next: Property[]) { try { if (next.length) localStorage.setItem(localPropertyKey, JSON.stringify(next)); else localStorage.removeItem(localPropertyKey); } catch { throw new Error("Não foi possível salvar no navegador. Reduza as fotos ou libere espaço e tente novamente."); } setLocal(next); }
  return <Context.Provider value={{ properties, local, staff, ready, login: () => { setStaff(true); try { sessionStorage.setItem(staffSessionKey, "1"); } catch { /* No password or email is stored. */ } }, logout: () => { setStaff(false); try { sessionStorage.removeItem(staffSessionKey); } catch { /* In-memory logout already completed. */ } }, save: (item) => { if (!staff) throw new Error("Entre na área da equipe para cadastrar."); if (!validLocalProperty(item)) throw new Error("Revise os dados do imóvel."); const next = [...local.filter((value) => value.reference !== item.reference), item]; if (next.length > 10) throw new Error("Você pode cadastrar até dez imóveis neste navegador."); persist(next); }, remove: (reference) => { if (!staff) throw new Error("Entre na área da equipe."); persist(local.filter((item) => item.reference !== reference)); } }}>{children}</Context.Provider>;
}
export function useLocalCatalog() { const value = useContext(Context); if (!value) throw new Error("LocalCatalog ausente"); return value; }
