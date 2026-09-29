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
test("six illustrative galleries have eight distinct local stock photos with source and license", () => {
  const sources = JSON.parse(readFileSync(new URL("../data/illustrative-images.json", import.meta.url), "utf8"));
  assert.equal(sources.length, 6);
  assert.equal(new Set(sources.map((source) => source.reference)).size, 6);
  for (const source of sources) {
    assert.equal(source.images.length, 8);
    assert.equal(source.coherentPropertyCapture, false);
    assert.equal(new Set(source.images.map((image) => image.sha256)).size, source.images.length);
    for (const image of source.images) {
      assert.equal(new URL(image.sourceUrl).hostname, "images.unsplash.com");
      assert.equal(new URL(image.sourcePage).hostname, "unsplash.com");
      assert.equal(image.license, "https://unsplash.com/license");
      assert.ok(image.author && image.illustrative);
      assert.ok(existsSync(new URL(`../public${image.path}`, import.meta.url)));
      assert.ok(existsSync(new URL(`../public${image.thumbnail}`, import.meta.url)));
    }
  }
});
test("bedroom filter is an inclusive maximum and multiword regions match", () => {
  const twoRooms = { ...records[1], bedrooms: 2 };
  assert.deepEqual(filterProperties([...records, twoRooms], { ...defaultFilters, bedrooms: "2" }), [twoRooms]);
  assert.equal(filterProperties(records, { ...defaultFilters, bedrooms: "3" }).length, 2);
  assert.deepEqual(filterProperties(records, { ...defaultFilters, location: "Jardim das Industrias, Sao Jose dos Campos" }), [records[1]]);
});
