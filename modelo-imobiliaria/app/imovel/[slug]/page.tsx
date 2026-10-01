import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { properties } from "@/data/properties";
import { basePath } from "@/lib/format";
import { PropertyDetail } from "@/components/property-detail";

export const dynamicParams = false;
export function generateStaticParams() { return properties.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const property = properties.find((item) => item.slug === slug);
  return property ? { title: property.title, description: `${property.title} em ${property.city}. ${property.bedrooms} dormitórios, ${property.builtArea} m². Imóvel de referência em uma demonstração da Aldenn.`, alternates: { canonical: `${basePath}/imovel/${slug}/` } } : {};
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = properties.find((item) => item.slug === slug);
  if (!property) notFound();
  return <PropertyDetail property={property} allProperties={properties} />;
}
