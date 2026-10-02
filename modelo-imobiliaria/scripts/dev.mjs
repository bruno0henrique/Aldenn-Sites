import { createServer } from "node:http";
import { spawn } from "node:child_process";
const origins = new Set(["http://127.0.0.1:5175", "http://localhost:5175"]);
const endpoints = new Set(["/api/imobiliaria/cadastro", "/api/imobiliaria/busca"]);
const server = createServer(async (request, response) => {
  const origin = request.headers.origin;
  if (!origins.has(origin) || !endpoints.has(request.url)) { response.writeHead(403); response.end(); return; }
  const headers = { "Access-Control-Allow-Origin": origin, "Vary": "Origin", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Cache-Control": "no-store" };
  if (request.method === "OPTIONS") { response.writeHead(204, headers); response.end(); return; }
  if (request.method !== "POST") { response.writeHead(405, headers); response.end(); return; }
  try { const chunks = []; let size = 0; for await (const chunk of request) { size += chunk.length; if (size > 6000) { response.writeHead(413, headers); response.end(); return; } chunks.push(chunk); }
    const upstream = await fetch(`https://www.aldenn.com.br${request.url}`, { method: "POST", signal: AbortSignal.timeout(35000), headers: { origin: "https://www.aldenn.com.br", "content-type": "application/json" }, body: Buffer.concat(chunks) });
    response.writeHead(upstream.status, { ...headers, "Content-Type": upstream.headers.get("content-type") || "application/json" });
    if (upstream.body) for await (const chunk of upstream.body) response.write(chunk); response.end();
  } catch { response.writeHead(503, { ...headers, "Content-Type": "application/json" }); response.end(JSON.stringify({ message: "A prévia não conseguiu conectar à IA. Tente novamente ou continue manualmente." })); }
});
server.listen(5176, "127.0.0.1", () => console.log("IA da prévia conectada à API institucional, sem chave local."));
const next = spawn(process.execPath, ["node_modules/next/dist/bin/next", "dev", "--port", "5175"], { stdio: "inherit" });
function stop() { server.close(); next.kill(); }
process.on("SIGINT", stop); process.on("SIGTERM", stop); next.on("exit", () => { server.close(); process.exit(); });
