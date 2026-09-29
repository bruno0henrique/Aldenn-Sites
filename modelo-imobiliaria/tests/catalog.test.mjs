import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { defaultFilters, filterProperties } from "../lib/property.ts";

const records = [
  { purpose: "venda", type: "Casa", city: "São José dos Campos", neighborhood: "Urbanova", development: "Vivant", bedrooms: 4, price: 2950000 },
  { purpose: "venda", type: "Apartamento", city: "São José dos Campos", neighborhood: "Jardim das Indústrias", development: "Splendor Garden", bedrooms: 3, price: 1250000 },
  { purpose: "locacao", type: "Casa", city: "Jacareí", neighborhood: "Altos de Santanna", development: "Villa de Santanna", bedrooms: 3, price: 9800 },
];
test("combines filters and searches without accent or case sensitivity", () => {
  assert.deepEqual(filterProperties(records, { ...defaultFilters, purpose: "venda", location: "SAO JOSE", type: "Casa", bedrooms: "4", minPrice: "2000000", maxPrice: "3000000" }), [records[0]]);
  assert.deepEqual(filterProperties(records, { ...defaultFilters, location: "industrias" }), [records[1]]);
  assert.deepEqual(filterProperties(records, { ...defaultFilters, location: "splendor" }), [records[1]]);
  assert.equal(filterProperties(records, { ...defaultFilters, location: "Curitiba" }).length, 0);
});
test("ordering preserves the original catalog and price boundaries are inclusive", () => {
  assert.equal(filterProperties(records, { ...defaultFilters, sort: "lowest" })[0], records[2]);
  assert.equal(filterProperties(records, { ...defaultFilters, sort: "highest" })[0], records[0]);
  assert.equal(records[0].price, 2950000);
  assert.equal(filterProperties(records, { ...defaultFilters, minPrice: "9800", maxPrice: "9800" }).length, 1);
});
test("six source listings have at least six distinct local photos from their own reference", () => {
  const sources = JSON.parse(readFileSync(new URL("../data/sources.json", import.meta.url), "utf8"));
  assert.equal(sources.length, 6);
  assert.equal(new Set(sources.map((source) => source.reference)).size, 6);
  for (const source of sources) {
    assert.ok(source.images.length >= 6);
    assert.equal(new Set(source.images.map((image) => image.sha256)).size, source.images.length);
    for (const image of source.images) {
      assert.ok(image.sourceUrl.includes(`/foto_/`) && image.sourceUrl.includes(`/${source.reference}/`));
      assert.ok(existsSync(new URL(`../public${image.path}`, import.meta.url)));
      assert.ok(existsSync(new URL(`../public${image.thumbnail}`, import.meta.url)));
    }
  }
});
