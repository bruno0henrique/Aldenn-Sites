import test from "node:test";
import assert from "node:assert/strict";
import { readFile, writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";
const folder = await mkdtemp(join(tmpdir(), "aldenn-editor-test-"));
for (const [name, path] of [["property", "lib/property.ts"], ["editor", "lib/editor.ts"], ["editor-ai", "lib/editor-ai.ts"], ["handler", "server/editor-handler.ts"]]) {
  const source = (await readFile(new URL(`../${path}`, import.meta.url), "utf8")).replace(/"(?:\.\.\/lib\/|\.\/)(property|editor-ai|editor)"/g, '"./$1.mjs"');
  await writeFile(join(folder, `${name}.mjs`), ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText);
}
test.after(() => rm(folder, { recursive: true }));
const { initialDraft, restoreDraft, featureTags } = await import(pathToFileURL(join(folder, "editor.mjs")));
const { validateCopyFacts } = await import(pathToFileURL(join(folder, "editor-ai.mjs")));
const { defaultFilters, filterProperties } = await import(pathToFileURL(join(folder, "property.mjs")));
const { POST } = await import(pathToFileURL(join(folder, "handler.mjs")));
const facts = { type: "Casa", purpose: "ambos", city: "Taubaté", neighborhood: "Centro", development: "", price: 900000, rentPrice: 4500, area: 180, bedrooms: 3, bathrooms: 2, features: ["Varanda"] };
test("tags correct common spelling, accents and case, deduplicate and preserve unknown terms", () => { assert.deepEqual(featureTags(["PISCINA", "piscna", "escritorio", "varanda", "Varanda", "vista da serra"]), ["Piscina", "Escritório", "Varanda", "Vista da serra"]); });
test("draft starts without photos, restores fields/photos/AI suggestion, requires confirmation again", () => { const draft = initialDraft(); assert.equal(draft.values.bedrooms, "1"); assert.equal(draft.values.bathrooms, "1"); assert.deepEqual(draft.photos, []); draft.values.title = "Meu título"; draft.aiConfirmed = true; draft.aiProposal = { title: "Sugestão", description: "Texto" }; const restored = restoreDraft(draft, initialDraft()); assert.equal(restored.values.title, "Meu título"); assert.equal(restored.aiConfirmed, false); assert.equal(restored.aiProposal.title, "Sugestão"); });
test("both purposes use corresponding prices and custom colors; land accepts no rooms", () => { const item = { ...facts, purpose: "ambos", type: "Terreno", builtArea: null, landArea: 400, colors: ["Terracota"], bedrooms: 0 }; assert.equal(filterProperties([item], { ...defaultFilters, purpose: "locacao", maxPrice: "5000", color: "terracota" })[0].price, 4500); assert.equal(filterProperties([item], { ...defaultFilters, purpose: "venda", maxPrice: "5000" }).length, 0); assert.equal(item.price, 900000); });
test("copy facts whitelist excludes private address/photos and validates minimum facts", () => { const clean = validateCopyFacts({ ...facts, cep: "00000-000", addressNumber: "999", photos: ["private"] }); assert.deepEqual(clean, facts); assert.throws(() => validateCopyFacts({ ...facts, price: 0 })); assert.throws(() => validateCopyFacts({ ...facts, rentPrice: null })); });
const request = (body, origin = "https://www.aldenn.com.br") => new Request("https://www.aldenn.com.br/api/imobiliaria/cadastro", { method: "POST", headers: { origin, "content-type": "application/json" }, body: JSON.stringify(body) });
test("editor API validates origin, bounds and input before upstream; handles failure and strict output", async () => {
  const oldFetch = globalThis.fetch, oldKey = process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY = "test-only";
  let posted; globalThis.fetch = async (_url, options) => { posted = JSON.parse(options.body); return Response.json({ status: "completed", output: [{ content: [{ type: "output_text", text: JSON.stringify({ title: "Casa com varanda", description: "Casa de 180 m² com três dormitórios." }) }] }] }); };
  try { assert.equal((await POST(request({ mode: "copy", facts }, "https://evil.test"))).status, 403); assert.equal((await POST(request({ mode: "copy", facts: {} }))).status, 400); assert.equal((await POST(request({ mode: "tags", tags: ["a".repeat(7000)] }))).status, 413); const response = await POST(request({ mode: "copy", facts: { ...facts, addressNumber: "999" } })); assert.equal(response.status, 200); assert.equal((await response.json()).title, "Casa com varanda"); assert.equal(posted.store, false); assert.equal(posted.text.format.strict, true); assert.ok(!posted.input.includes("addressNumber")); globalThis.fetch = async () => Response.json({}, { status: 500 }); assert.equal((await POST(request({ mode: "copy", facts }))).status, 503); } finally { globalThis.fetch = oldFetch; if (oldKey) process.env.OPENAI_API_KEY = oldKey; else delete process.env.OPENAI_API_KEY; }
});
