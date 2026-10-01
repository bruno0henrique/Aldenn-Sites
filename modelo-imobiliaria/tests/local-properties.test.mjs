import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";
const js = ts.transpileModule(await readFile(new URL("../lib/local-properties.ts", import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { validLocalProperty, restoreLocalProperties, propertyHref } = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
const item = { reference: "LOCAL-00000000-0000-4000-8000-000000000001", slug: "cadastrado", title: "Casa", subtitle: "Espaço para viver", city: "Taubaté", neighborhood: "Centro", development: "", purpose: "venda", type: "Casa", price: 900000, builtArea: 180, landArea: null, condominium: null, iptu: null, bedrooms: 3, suites: 1, bathrooms: null, parking: 2, description: ["Descrição do imóvel"], features: [], amenities: [], colors: ["branca"], images: [{ path: "/media/illustrative/27236/01.webp", thumbnail: "/media/illustrative/27236/01.webp", width: 1400, height: 934 }], sourceUrl: "", consultedAt: "2026-09-30T15:00:00Z" };
test("local catalog rejects malformed stored data, duplicates and invalid facts", () => {
  assert.equal(validLocalProperty(item), true);
  for (const patch of [{ price: -1 }, { suites: 5 }, { colors: ["invalid"] }, { title: " " }, { images: [] }, { images: [{ ...item.images[0], path: "javascript:alert(1)" }] }, { video3d: { src: "https://evil.test" } }]) assert.equal(validLocalProperty({ ...item, ...patch }), false);
  assert.deepEqual(restoreLocalProperties([item, item, null, { ...item, price: NaN }]), [item]);
  assert.equal(propertyHref(item), `/imovel/cadastrado/?ref=${item.reference}`);
  assert.equal(propertyHref({ slug: "casa-alphaville-ii", reference: "24477" }), "/imovel/casa-alphaville-ii/");
});
