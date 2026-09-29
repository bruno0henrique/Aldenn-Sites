import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = new URL("../", import.meta.url);
const selection = JSON.parse(await readFile(new URL("data/illustrative-images.json", root), "utf8"));
const manifest = [];
const tiles = [];
for (const property of selection) {
  const { reference } = property;
  const images = [];
  await mkdir(new URL(`public/media/illustrative/${reference}/`, root), { recursive: true });
  for (const [position, source] of property.images.entries()) {
    const url = new URL(source.sourceUrl);
    url.searchParams.set("w", "1600");
    url.searchParams.set("q", "85");
    const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error(`Falha ${source.stockId}: ${response.status}`);
    const original = Buffer.from(await response.arrayBuffer());
    const file = String(position + 1).padStart(2, "0");
    const path = `/media/illustrative/${reference}/${file}.webp`;
    const thumbnail = `/media/illustrative/${reference}/${file}-small.webp`;
    const full = await sharp(original).rotate().resize({ width: 1400, height: 1100, fit: "inside", withoutEnlargement: true }).webp({ quality: 84 }).toBuffer({ resolveWithObject: true });
    await writeFile(new URL(`public${path}`, root), full.data);
    await sharp(original).rotate().resize({ width: 700, height: 550, fit: "inside", withoutEnlargement: true }).webp({ quality: 80 }).toFile(fileURLToPath(new URL(`public${thumbnail}`, root)));
    images.push({ path, thumbnail, width: full.info.width, height: full.info.height, sourceUrl: url.href, sourcePage: source.sourcePage, author: source.author, license: source.license, stockId: source.stockId, illustrative: true, sha256: createHash("sha256").update(original).digest("hex") });
    const tile = await sharp(full.data).resize(230, 160, { fit: "cover" }).toBuffer();
    const label = Buffer.from(`<svg width="230" height="25"><rect width="230" height="25" fill="#fff"/><text x="8" y="18" font-size="13">${reference}/${file}</text></svg>`);
    tiles.push({ input: tile, left: selection.findIndex((entry) => entry.reference === reference) * 230, top: position * 185 });
    tiles.push({ input: label, left: selection.findIndex((entry) => entry.reference === reference) * 230, top: position * 185 + 160 });
  }
  manifest.push({ reference, origin: "Unsplash", consultedAt: new Date().toISOString(), illustrative: true, coherentPropertyCapture: false, images });
  console.log(`${reference}: oito fotografias locais`);
}
await writeFile(new URL("data/illustrative-images.json", root), JSON.stringify(manifest, null, 2) + "\n");
await sharp({ create: { width: 1380, height: 1480, channels: 3, background: "#fff" } }).composite(tiles).png().toFile(fileURLToPath(new URL(".source/stock-review.png", root)));
