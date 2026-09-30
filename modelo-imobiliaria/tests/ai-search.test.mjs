import test from "node:test";
import assert from "node:assert/strict";
import { readFile, writeFile, mkdtemp, unlink, rmdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const folder = await mkdtemp(join(tmpdir(), "aldenn-ai-tests-"));
const catalog = JSON.parse(await readFile(new URL("../data/search-catalog.json", import.meta.url), "utf8"));
for (const [name, path] of [["property", "lib/property.ts"], ["ai-search", "lib/ai-search.ts"], ["handler", "server/search-handler.ts"]]) {
  let source = await readFile(new URL(`../${path}`, import.meta.url), "utf8");
  source = source.replace('import catalog from "../data/search-catalog.json";', `const catalog = ${JSON.stringify(catalog)};`).replace(/"(?:\.\.\/lib\/|\.\/)(property|ai-search)"/g, '"./$1.mjs"');
  await writeFile(join(folder, `${name}.mjs`), ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText);
}
const { defaultFilters, filterProperties } = await import(pathToFileURL(join(folder, "property.mjs")));
const { partialMessage, validateSearch, searchHref } = await import(pathToFileURL(join(folder, "ai-search.mjs")));
const { POST } = await import(pathToFileURL(join(folder, "handler.mjs")));
test.after(async () => { for (const name of ["property", "ai-search", "handler"]) await unlink(join(folder, `${name}.mjs`)); await rmdir(folder); });

test("public summary streaming preserves escaped Unicode and ignores incomplete escapes", () => {
  assert.equal(partialMessage('{"message":"Busco \\u00e1'), "Busco á");
  assert.equal(partialMessage('{"message":"Busco \\u00'), "Busco ");
  assert.equal(partialMessage('{"filters":{}'), "");
  assert.equal(partialMessage('{"message":"Uma \\"casa\\""'), 'Uma "casa"');
});
test("exact and minimum quantities differ from maximum, all features must match", () => {
  assert.equal(filterProperties(catalog, { ...defaultFilters, minBedrooms: "3", bedrooms: "3" }).length, 3);
  assert.equal(filterProperties(catalog, { ...defaultFilters, minBedrooms: "5" }).length, 1);
  assert.equal(filterProperties(catalog, { ...defaultFilters, feature: "piscina|elevador" }).length, 1);
  const filters = { ...defaultFilters, purpose: "locacao", minSuites: "2", location: "Aquarius" };
  assert.equal(new URL(searchHref(filters), "https://www.aldenn.com.br").searchParams.get("minSuites"), "2");
  assert.throws(() => validateSearch({ message: "oi", filters: { ...filters, maxPrice: "NaN" } }));
  assert.throws(() => validateSearch({ message: "oi", filters: { ...filters, purpose: "hack" } }));
});

const request = (query, extra = {}) => new Request("https://www.aldenn.com.br/api/imobiliaria/busca", { method: "POST", headers: { origin: "https://www.aldenn.com.br", "content-type": "application/json", ...extra }, body: JSON.stringify({ query }) });
test("API rejects cross-origin, oversize, malformed and unavailable-key requests without calling upstream", async () => {
  const old = process.env.OPENAI_API_KEY; delete process.env.OPENAI_API_KEY;
  try {
    assert.equal((await POST(request("Apartamento", { origin: "https://outro.com" }))).status, 403);
    assert.equal((await POST(request("A"))).status, 400);
    assert.equal((await POST(request("A".repeat(5000)))).status, 413);
    assert.equal((await POST(request("Apartamento"))).status, 503);
  } finally { if (old) process.env.OPENAI_API_KEY = old; }
});
test("API streams summary then authoritative catalog matches and handles interrupted or refused responses", async () => {
  const oldKey = process.env.OPENAI_API_KEY, oldFetch = globalThis.fetch;
  process.env.OPENAI_API_KEY = "test-only-key";
  try {
    const answer = { message: "Vou buscar aluguel no Aquarius com duas suítes ou mais.", filters: { ...defaultFilters, purpose: "locacao", location: "Aquarius", minSuites: "2" } };
    let posted;
    globalThis.fetch = async (_url, options) => {
      posted = JSON.parse(options.body);
      const json = JSON.stringify(answer), encoder = new TextEncoder();
      const events = [json.slice(0, 30), json.slice(30, 60), json.slice(60)].map((delta) => `event: response.output_text.delta\ndata: ${JSON.stringify({ type: "response.output_text.delta", delta })}\n\n`).join("") + 'event: response.completed\ndata: {"type":"response.completed"}\n\n';
      return new Response(new ReadableStream({ start(output) { for (let i = 0; i < events.length; i += 17) output.enqueue(encoder.encode(events.slice(i, i + 17))); output.close(); } }));
    };
    const response = await POST(request("Aluguel no Aquarius, pelo menos 2 suítes"));
    assert.equal(response.status, 200);
    const events = (await response.text()).trim().split("\n").map(JSON.parse);
    assert.equal(events.filter((event) => event.type === "delta").map((event) => event.text).join(""), answer.message);
    assert.equal(events.at(-1).type, "complete"); assert.equal(events.at(-1).count, 1);
    assert.equal(posted.store, false); assert.equal(posted.stream, true); assert.equal(posted.text.format.strict, true);
    globalThis.fetch = async () => new Response('data: {"type":"response.refusal.delta"}\n\n');
    assert.equal(JSON.parse((await (await POST(request("Outra busca"))).text()).trim()).type, "error");
    globalThis.fetch = async () => new Response("upstream private error", { status: 401 });
    const failed = await POST(request("Apartamento")); assert.equal(failed.status, 503); assert.ok(!(await failed.text()).includes("private"));
    for (let i = 0; i < 6; i++) await POST(request("Apartamento"));
    assert.equal((await POST(request("Apartamento"))).status, 429);
  } finally { globalThis.fetch = oldFetch; if (oldKey) process.env.OPENAI_API_KEY = oldKey; else delete process.env.OPENAI_API_KEY; }
});

test("color filters match visual tags, combine with type and survive search links", () => {
  const filters = { ...defaultFilters, color: "branca", type: "Casa" };
  assert.equal(filterProperties(catalog, filters).length, 3);
  assert.equal(filterProperties(catalog, { ...filters, color: "azul" }).length, 0);
  assert.equal(filterProperties(catalog, { ...filters, city: "Jacareí" }).length, 0);
  assert.equal(new URL(searchHref(filters), "https://www.aldenn.com.br").searchParams.get("color"), "branca");
  assert.equal(validateSearch({ message: "Casas brancas", filters }).filters.color, "branca");
  assert.throws(() => validateSearch({ message: "Casas", filters: { ...filters, color: "invalid" } }));
});
