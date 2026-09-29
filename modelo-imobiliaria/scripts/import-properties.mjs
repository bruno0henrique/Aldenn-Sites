import { mkdir, writeFile, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { load } from "cheerio";
import sharp from "sharp";

const entries = [
  ["27236", "comprar/Sao-Jose-dos-Campos/Casa/Condominio/Urbanova"],
  ["13027", "comprar/Sao-Jose-dos-Campos/Casa/Condominio/Urbanova"],
  ["24477", "comprar/Sao-Jose-dos-Campos/Casa/Condominio/Condominio-Residencial-Alphaville-II"],
  ["24060", "comprar/Sao-Jose-dos-Campos/Apartamento/Padrao/Jardim-das-Industrias"],
  ["21457", "alugar/Jacarei/Casa/Condominio/Altos-de-Santanna"],
  ["26556", "alugar/Sao-Jose-dos-Campos/Apartamento/Padrao/Parque-Residencial-Aquarius"],
];

await mkdir(".source", { recursive: true });
await mkdir("data", { recursive: true });
let sources = [];
try { sources = JSON.parse(await readFile("data/sources.json", "utf8")); } catch { /* First import. */ }
const limit = Number(process.argv.find((arg) => arg.startsWith("--limit="))?.split("=")[1] ?? entries.length);
const selected = process.argv.find((arg) => arg.startsWith("--reference="))?.split("=")[1];
for (const [reference, route] of entries.slice(0, limit).filter(([reference]) => !selected || selected === reference)) {
  const url = `https://www.francaimobiliaria.com.br/${route}/${reference}`;
  let html;
  try { html = await readFile(`.source/${reference}.html`, "utf8"); } catch { /* First import. */ }
  if (!html || html.includes("<title>404")) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Anúncio ${reference}: HTTP ${response.status}`);
    html = await response.text();
  }
  const $ = load(html);
  if ($("title").text().includes("404")) throw new Error(`Anúncio ${reference} não encontrado`);
  await writeFile(`.source/${reference}.html`, html);
  await writeFile(`.source/${reference}.txt`, $("body").text().replace(/\s+/g, " "));
  const urls = [...new Set($("meta[property='og:image']").map((_, node) => $(node).attr("content")).get())]
    .filter((image) => image.includes("/foto_/") && image.includes(`/${reference}/`));
  if (urls.length < 6) throw new Error(`Anúncio ${reference}: apenas ${urls.length} fotografias próprias`);
  const directory = `public/media/${reference}`;
  await mkdir(directory, { recursive: true });
  const hashes = new Set();
  const images = [];
  // Eight views balance a useful gallery and initial transfer size. No condominium or similar-property photos.
  for (const imageUrl of urls) {
    if (images.length === 8) break;
    const photo = await fetch(imageUrl);
    if (!photo.ok) throw new Error(`Foto ${reference}: HTTP ${photo.status}`);
    const original = Buffer.from(await photo.arrayBuffer());
    const hash = createHash("sha256").update(original).digest("hex");
    if (hashes.has(hash)) continue;
    hashes.add(hash);
    const index = String(images.length + 1).padStart(2, "0");
    const file = `${directory}/${index}.webp`;
    const info = await sharp(original).rotate().resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 84, effort: 5 }).toFile(file);
    await sharp(original).rotate().resize({ width: 700, withoutEnlargement: true })
      .webp({ quality: 78, effort: 5 }).toFile(`${directory}/${index}-small.webp`);
    images.push({ path: `/media/${reference}/${index}.webp`, thumbnail: `/media/${reference}/${index}-small.webp`, width: info.width, height: info.height, sourceUrl: imageUrl, sha256: hash });
  }
  if (images.length < 6) throw new Error(`Anúncio ${reference}: fotografias distintas insuficientes`);
  sources = sources.filter((item) => item.reference !== reference);
  sources.push({ reference, url, consultedAt: new Date().toISOString(), title: $("title").text().trim(), images });
  await writeFile("data/sources.json", JSON.stringify(sources, null, 2) + "\n");
  console.log(`${reference}: ${images.length} fotos próprias, ${$("title").text().trim()}`);
}
await writeFile("data/sources.json", JSON.stringify(sources, null, 2) + "\n");
