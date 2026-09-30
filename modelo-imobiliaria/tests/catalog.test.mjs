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

test("advanced filters combine locations, features and inclusive ranges without treating unknown areas as zero", () => {
  const detailed = [
    { ...records[0], reference: "27236", suites: 4, bathrooms: 6, parking: 6, builtArea: 390, landArea: 452, features: ["Escritório", "Piscina"], amenities: [] },
    { ...records[1], reference: "24060", suites: 1, bathrooms: null, parking: 2, builtArea: 100, landArea: null, features: ["Varanda gourmet"], amenities: ["Piscina", "Academia"] },
  ];
  assert.deepEqual(filterProperties(detailed, { ...defaultFilters, city: "São José dos Campos", neighborhood: "Jardim das Indústrias", development: "Splendor Garden", suites: "1", parking: "2", minArea: "100", maxArea: "100", feature: "academia", reference: "240" }), [detailed[1]]);
  assert.deepEqual(filterProperties(detailed, { ...defaultFilters, bathrooms: "7" }), [detailed[0]]);
  assert.deepEqual(filterProperties(detailed, { ...defaultFilters, areaType: "land", minArea: "0", maxArea: "452" }), [detailed[0]]);
  for (const patch of [{ minArea: "200", maxArea: "100" }, { minPrice: "-1" }, { bathrooms: "abc" }, { maxArea: "Infinity" }]) {
    assert.equal(filterProperties(detailed, { ...defaultFilters, ...patch }).length, 0);
  }
  assert.equal(filterProperties(detailed, { ...defaultFilters, feature: "piscina" }).length, 2);
});
