"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { propertyInternalSections, readExtras, readPeople } from "@/lib/registrations";
export function PropertyInternalDetails({ reference }: { reference: string }) {
  const [values, setValues] = useState<Record<string, string>>({}), [owners, setOwners] = useState<string[]>([]), [tenants, setTenants] = useState<string[]>([]);
  useEffect(() => { queueMicrotask(() => { const extra = readExtras(reference), people = readPeople(); setValues(extra); setOwners(people.filter((p) => p.kind === "proprietarios" && p.propertyRefs.includes(reference)).map((p) => p.values.name)); setTenants(people.filter((p) => p.kind === "inquilinos" && p.propertyRefs.includes(reference)).map((p) => p.values.name)); }); }, [reference]);
  return <section className="team-private-details" aria-label="Ficha interna complementar"><div className="team-data-section"><h2>Pessoas vinculadas</h2><div><dl className="team-facts"><div><dt>Proprietários</dt><dd>{owners.join(", ") || "Sem vínculo"}</dd></div><div><dt>Inquilinos</dt><dd>{tenants.join(", ") || "Sem vínculo"}</dd></div></dl><Link className="text-link" href="/equipe/cadastros/">Consultar cadastros</Link></div></div>{propertyInternalSections.map((section) => { const fields = section.fields.filter((field) => values[field.key] && !["keyAgency", "keyLocation", "keyId"].includes(field.key)); return fields.length ? <div className="team-data-section" key={section.title}><h2>{section.title}</h2><dl className="team-facts">{fields.map((field) => <div key={field.key}><dt>{field.label}</dt><dd>{values[field.key]}</dd></div>)}</dl></div> : null; })}</section>;
}
