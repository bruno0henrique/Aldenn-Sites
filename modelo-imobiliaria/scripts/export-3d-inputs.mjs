import { readFile, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const sources = JSON.parse(await readFile(new URL("data/sources.json", root), "utf8"));
const manifest = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  basePath: "/demonstracao-imobiliaria",
  properties: sources.map((property) => ({
    reference: property.reference,
    title: property.title,
    sourceUrl: property.url,
    images: property.images.map((image) => ({
      path: `public${image.path}`,
      publicUrl: `/demonstracao-imobiliaria${image.path}`,
      width: image.width,
      height: image.height,
      sourceUrl: image.sourceUrl,
      sourceSha256: image.sha256,
    })),
    suggestedOutput: `public/media/${property.reference}/tour-3d.mp4`,
  })),
};
await mkdir(new URL(".source/", root), { recursive: true });
const destination = new URL(".source/3d-inputs.json", root);
await writeFile(destination, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Manifesto de seis imóveis exportado para ${fileURLToPath(destination)}. Nenhuma imagem foi enviada.`);
