import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";
const source = await readFile(new URL("../lib/registrations.ts", import.meta.url), "utf8");
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { restorePeople, cleanValues, extraKeys } = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
test("person restore separates roles, bounds data, rejects malformed records and removes unknown fields", () => {
  const item = { id: "00000000-0000-4000-8000-000000000001", kind: "proprietarios", values: { name: "Proprietário de exemplo", document: "000.000.000-00", income: "9999", token: "secret", notes: "a".repeat(3000) }, propertyRefs: ["27236", "DEMO-31001", "<script>"], updatedAt: "2026-10-04T12:00:00Z" };
  const restored = restorePeople([item, item, { ...item, id: "bad" }, { ...item, kind: "admins" }]);
  assert.equal(restored.length, 1); assert.equal(restored[0].values.document, item.values.document);
  assert.equal(restored[0].values.income, undefined); assert.equal(restored[0].values.token, undefined);
  assert.equal(restored[0].values.notes.length, 2000); assert.deepEqual(restored[0].propertyRefs, ["27236", "DEMO-31001"]);
  assert.deepEqual(cleanValues({ registry: "Matrícula de exemplo", document: "private" }, extraKeys), { registry: "Matrícula de exemplo" });
});

test("additional catalog examples are ten unique houses and the public search export excludes private registration fields", async () => {
  const catalog = JSON.parse(await readFile(new URL("../data/search-catalog.json", import.meta.url), "utf8"));
  assert.equal(catalog.length, 16);
  const extra = catalog.filter((item) => item.reference.startsWith("DEMO-"));
  assert.equal(extra.length, 10); assert.equal(new Set(extra.map((item) => item.slug)).size, 10);
  assert.ok(extra.every((item) => item.type === "Casa" && item.price > 0 && item.builtArea > 0 && item.landArea > item.builtArea));
  assert.ok(catalog.every((item) => !Object.hasOwn(item, "ownerId") && !Object.hasOwn(item, "registry") && !Object.hasOwn(item, "document")));
});
