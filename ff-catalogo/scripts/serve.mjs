import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(fileURLToPath(new URL('../dist/',import.meta.url)));
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2'};
const port=Number(process.env.FF_PREVIEW_PORT || 5186);
http.createServer(async(req,res)=>{
 try {
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  let filename=path.resolve(root,'.'+pathname);
  if(filename!==root && !filename.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  if((await stat(filename)).isDirectory())filename=path.join(filename,'index.html');
  const data=await readFile(filename);
  res.writeHead(200,{'Content-Type':mime[path.extname(filename)] || 'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(data);
 }catch {res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(await readFile(path.join(root,'404.html')));}
}).listen(port,'127.0.0.1',()=>console.log(`FF: http://127.0.0.1:${port}/`));
