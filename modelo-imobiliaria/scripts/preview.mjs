import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";

const root = resolve("out");
const basePath = "/demonstracao-imobiliaria";
const mime = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".txt": "text/plain", ".json": "application/json", ".webp": "image/webp", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2" };
createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    if (pathname === "/") { response.writeHead(302, { Location: `${basePath}/` }); response.end(); return; }
    if (pathname !== basePath && !pathname.startsWith(`${basePath}/`)) throw new Error("Not found");
    const relative = pathname.slice(basePath.length) || "/";
    let file = resolve(root, `.${relative}`);
    if (file !== root && !file.startsWith(`${root}${sep}`)) throw new Error("Not found");
    if ((await stat(file)).isDirectory()) file = resolve(file, "index.html");
    const bytes = await readFile(file);
    response.writeHead(200, { "Content-Type": mime[extname(file)] ?? "application/octet-stream" }); response.end(bytes);
  } catch { response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" }); response.end(await readFile(resolve(root, "404.html"))); }
}).listen(5175, "127.0.0.1", () => console.log(`Prévia: http://127.0.0.1:5175${basePath}/`));
