import http from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const base = path.resolve(root);
const mime = {'.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.webp':'image/webp', '.png':'image/png', '.jpg':'image/jpeg', '.svg':'image/svg+xml'};
const port = Number(process.env.NIXO_PREVIEW_PORT || 5187);
http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let filename = path.resolve(base, '.' + pathname);
    if (filename !== base && !filename.startsWith(base + path.sep)) {
      res.writeHead(403); res.end(); return;
    }
    if ((await stat(filename)).isDirectory()) {
      if (!pathname.endsWith('/')) {
        res.writeHead(308, {Location: pathname + '/'}); res.end(); return;
      }
      filename = path.join(filename, 'index.html');
    }
    const data = await readFile(filename);
    res.writeHead(200, {'Content-Type': mime[path.extname(filename)] || 'application/octet-stream', 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff'});
    res.end(data);
  } catch {
    res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'});
    res.end('Arquivo não encontrado.');
  }
}).listen(port, '127.0.0.1', () => console.log(`Nixo: http://127.0.0.1:${port}/`));
