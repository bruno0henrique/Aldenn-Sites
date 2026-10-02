import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BedDouble, CarFront, MapPin, Ruler } from "lucide-react";
import { propertyHref } from "@/lib/local-properties";
import { purposeLabel, landTypes, commercialTypes, type Property } from "@/lib/property";
import { asset, money, number } from "@/lib/format";

export function PropertyCard({ property, promoted = false }: { property: Property; promoted?: boolean }) {
  return <article className={`property-card${promoted ? " is-promoted" : ""}`}><Link href={propertyHref(property)} className="property-link" aria-label={`Ver ${property.title}, ${purposeLabel(property.purpose)}, referência ${property.reference}`}>
    <div className="card-photo"><Image src={asset(property.images[0].thumbnail)} alt={property.title} fill sizes="(max-width: 700px) 100vw, (max-width: 1050px) 50vw, 33vw" /><span className="property-badge">{purposeLabel(property.purpose)}</span>{promoted && <span className="promoted-badge">Promovido</span>}<span className="card-open"><ArrowUpRight size={22} strokeWidth={1.5} /></span></div>
    <div className="card-content"><span className="card-location"><MapPin size={13} /> {property.neighborhood} · {property.city}</span><h3>{property.title}</h3><p className="card-subtitle">{property.subtitle}</p><div className="card-facts"><span><Ruler size={16} />{(property.builtArea ?? property.landArea) === null ? "Área não informada" : `${number((property.builtArea ?? property.landArea)!)} m²`}</span>{!landTypes.includes(property.type) && !commercialTypes.includes(property.type) && <span><BedDouble size={17} />{property.bedrooms} quartos</span>}<span><CarFront size={17} />{property.parking} vagas</span></div><div className="card-bottom"><strong>{money(property.price)}{property.purpose === "locacao" && <small>/mês</small>}{property.purpose === "ambos" && <small className="card-other-price">Aluguel {money(property.rentPrice ?? 0)}/mês</small>}</strong><span>Ver imóvel <ArrowUpRight size={14} /></span></div></div>
  </Link></article>;
}
