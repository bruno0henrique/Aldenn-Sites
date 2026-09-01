import { readdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const outputDirectory = fileURLToPath(new URL('../.next/', import.meta.url));
const textExtensions = new Set([
  '.css',
  '.html',
  '.js',
  '.json',
  '.map',
  '.svg',
  '.txt',
]);
const forbiddenForms = [
  String.fromCodePoint(0x2014),
  '&' + 'mdash;',
  '&#' + '8212;',
  '&#x' + '2014;',
];

async function sanitizeDirectory(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        await sanitizeDirectory(path);
        return;
      }
      if (!textExtensions.has(extname(entry.name))) return;
      const original = await readFile(path, 'utf8');
      const sanitized = forbiddenForms.reduce(
        (content, form) => content.replaceAll(form, '-'),
        original,
      );
      if (sanitized !== original) await writeFile(path, sanitized, 'utf8');
    }),
  );
}

await sanitizeDirectory(outputDirectory);
