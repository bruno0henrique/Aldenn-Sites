import { readFile, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const sources = JSON.parse(await readFile(new URL("data/illustrative-images.json", root), "utf8"));
const manifest = {
  schemaVersion: 2,
  generatedAt: new Date().toISOString(),
  basePath: "/demonstracao-imobiliaria",
  properties: sources.map((property) => ({
    reference: property.reference,
    imageRole: "illustrative-stock-gallery",
    suitableForSpatialReconstruction: false,
    note: "Ambientes de diferentes projetos. Substituir por capturas consistentes do mesmo imóvel antes de gerar um tour 3D fiel.",
    images: property.images.map((image) => ({
      path: `public${image.path}`,
      publicUrl: `/demonstracao-imobiliaria${image.path}`,
      width: image.width,
      height: image.height,
      sourceUrl: image.sourceUrl,
      sourcePage: image.sourcePage,
      author: image.author,
      license: image.license,
      sourceSha256: image.sha256,
    })),
    suggestedOutput: `public/media/${property.reference}/tour-3d.mp4`,
  })),
};
await mkdir(new URL(".source/", root), { recursive: true });
const destination = new URL(".source/3d-inputs.json", root);
await writeFile(destination, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Manifesto de seis imóveis exportado para ${fileURLToPath(destination)}. Nenhuma imagem foi enviada.`);
