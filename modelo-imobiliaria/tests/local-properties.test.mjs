import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";
const propertyJs = ts.transpileModule(await readFile(new URL("../lib/property.ts", import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ESNext } }).outputText;
const propertyUrl = `data:text/javascript;base64,${Buffer.from(propertyJs).toString("base64")}`;
const js = ts.transpileModule(await readFile(new URL("../lib/local-properties.ts", import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ESNext } }).outputText;
const { validLocalProperty, restoreLocalProperties, propertyHref } = await import(`data:text/javascript;base64,${Buffer.from(js.replace('"./property"', JSON.stringify(propertyUrl))).toString("base64")}`);
const item = { reference: "LOCAL-00000000-0000-4000-8000-000000000001", slug: "cadastrado", title: "Casa", subtitle: "Espaço para viver", city: "Taubaté", neighborhood: "Centro", development: "", purpose: "venda", type: "Casa", price: 900000, builtArea: 180, landArea: null, condominium: null, iptu: null, bedrooms: 3, suites: 1, bathrooms: null, parking: 2, description: ["Descrição do imóvel"], features: [], amenities: [], colors: ["branca"], images: [{ path: "/media/illustrative/27236/01.webp", thumbnail: "/media/illustrative/27236/01.webp", width: 1400, height: 934 }], sourceUrl: "", consultedAt: "2026-09-30T15:00:00Z" };
test("local catalog rejects malformed stored data, duplicates and invalid facts", () => {
  assert.equal(validLocalProperty(item), true);
  for (const patch of [{ price: -1 }, { suites: 5 }, { colors: ["a".repeat(51)] }, { title: " " }, { images: [] }, { images: [{ ...item.images[0], path: "javascript:alert(1)" }] }, { video3d: { src: "https://evil.test" } }]) assert.equal(validLocalProperty({ ...item, ...patch }), false);
  assert.deepEqual(restoreLocalProperties([item, item, null, { ...item, price: NaN }]), [item]);
  assert.equal(propertyHref(item), `/imovel/cadastrado/?ref=${item.reference}`);
  assert.equal(propertyHref({ slug: "casa-alphaville-ii", reference: "24477" }), "/imovel/casa-alphaville-ii/");
});
const localUrl = `data:text/javascript;base64,${Buffer.from(js.replace('"./property"', JSON.stringify(propertyUrl))).toString("base64")}`;
const stockJs = ts.transpileModule(await readFile(new URL("../lib/stock-overrides.ts", import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ESNext } }).outputText;
const { validStockOverride, restoreStockOverrides } = await import(`data:text/javascript;base64,${Buffer.from(stockJs.replace('"./local-properties"', JSON.stringify(localUrl))).toString("base64")}`);
const teamJs = ts.transpileModule(await readFile(new URL("../lib/team.ts", import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ESNext } }).outputText;
const { emptyRecord, restoreTeam, seedTeam } = await import(`data:text/javascript;base64,${Buffer.from(teamJs).toString("base64")}`);

test("stock edits require a known reference and slug, reject invalid facts and restore without duplicates", () => {
  const original = { ...item, reference: "27236", slug: "casa-vivant-urbanova" };
  const edited = { ...original, title: "Casa com varanda" };
  assert.equal(validStockOverride(edited, [original]), true);
  for (const patch of [{ reference: "99999" }, { slug: "another" }, { price: -1 }, { images: [] }]) assert.equal(validStockOverride({ ...edited, ...patch }, [original]), false);
  assert.deepEqual(restoreStockOverrides([edited, edited, { ...edited, price: -1 }], [original]), [edited]);
  assert.equal(validLocalProperty(edited), false);
});

test("team records restore bounded notes and reject unknown state, malformed records and development data", () => {
  const fallback = seedTeam([{ ...item, development: "Horizonte" }]);
  assert.equal(fallback.developments[0].name, "Horizonte");
  const note = { id: "note-1", text: "Conferir varanda", at: "2026-10-02T18:00:00Z" };
  const record = { ...emptyRecord(), keyStatus: "Na imobiliária", keyAgency: "Equipe A", notes: [note, { ...note, text: "x".repeat(2001) }, { ...note, at: "invalid" }] };
  const restored = restoreTeam({ records: { "27236": record, "__proto__": record, "27237": { ...record, status: "Unknown" } }, developments: [fallback.developments[0], { name: "bad" }] }, fallback);
  assert.deepEqual(restored.records["27236"].notes, [note]);
  assert.equal(restored.records["27237"], undefined);
  assert.equal(restored.developments.length, 1);
  assert.deepEqual(restoreTeam(null, fallback), fallback);
});
