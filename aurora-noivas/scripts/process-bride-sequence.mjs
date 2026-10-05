import { mkdir, rename } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const sourceDirectory = process.argv[2];
const outputDirectory = process.argv[3] ?? path.resolve("public/media/bride-sequence");
const frameCount = 240;
const concurrency = 4;

if (!sourceDirectory) {
  throw new Error("Informe a pasta dos PNGs como primeiro argumento.");
}

await mkdir(outputDirectory, { recursive: true });

let nextFrame = 1;

async function processFrame(frame) {
  const sourceName = `frame_${String(frame).padStart(6, "0")}.png`;
  const outputName = `frame-${String(frame).padStart(4, "0")}.webp`;
  const sourcePath = path.resolve(sourceDirectory, sourceName);
  const outputPath = path.resolve(outputDirectory, outputName);
  const temporaryPath = `${outputPath}.tmp`;

  const metadata = await sharp(sourcePath).metadata();
  if (metadata.width !== 1280 || metadata.height !== 720) {
    throw new Error(`${sourceName} possui ${metadata.width}x${metadata.height}; esperado: 1280x720.`);
  }

  await sharp(sourcePath)
    .webp({ quality: 95, effort: 6, smartSubsample: true })
    .toFile(temporaryPath);
  await rename(temporaryPath, outputPath);
}

async function worker() {
  while (nextFrame <= frameCount) {
    const frame = nextFrame;
    nextFrame += 1;
    await processFrame(frame);
  }
}

await Promise.all(Array.from({ length: concurrency }, worker));
console.log(`${frameCount} quadros processados em ${outputDirectory}.`);
