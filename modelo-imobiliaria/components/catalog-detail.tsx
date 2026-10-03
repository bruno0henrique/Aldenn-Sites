"use client";
import type { Property } from "@/lib/property";
import { useLocalCatalog } from "./local-catalog";
import { PropertyDetail } from "./property-detail";
export function CatalogDetail({ property }: { property: Property }) {
  const { properties } = useLocalCatalog();
  return <PropertyDetail property={properties.find((item) => item.reference === property.reference) ?? property} allProperties={properties} />;
}
