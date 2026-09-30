import { readFile, writeFile } from "node:fs/promises";
import ts from "typescript";

// Evaluate only this repository's trusted catalog declaration, without imports or galleries.
const source = (await readFile(new URL("../data/properties.ts", import.meta.url), "utf8")).split("export const properties")[0].replace(/^import .*;\r?\n/gm, "");
const compiled = ts.transpileModule(`${source}\nexport { records };`, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const exports = {};
new Function("exports", compiled.outputText)(exports);
const catalog = exports.records.map(({ reference, slug, title, purpose, type, city, neighborhood, development, price, builtArea, landArea, bedrooms, suites, bathrooms, parking, features, amenities, colors }) => ({ reference, slug, title, purpose, type, city, neighborhood, development, price, builtArea, landArea, bedrooms, suites, bathrooms, parking, features, amenities, colors }));
await writeFile(new URL("../data/search-catalog.json", import.meta.url), `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`Catálogo de busca: ${catalog.length} imóveis.`);
