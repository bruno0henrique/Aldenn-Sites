import {createServer} from "node:http";
import {readFile,stat} from "node:fs/promises";
import {resolve,sep,extname} from "node:path";
const root=resolve("out");const base="/demonstracao-noiva-dois";
const types={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json",".webp":"image/webp",".avif":"image/avif",".jpg":"image/jpeg",".svg":"image/svg+xml",".woff":"font/woff",".woff2":"font/woff2",".txt":"text/plain; charset=utf-8"};
const port=Number(process.env.AURORA_PREVIEW_PORT??5184);
createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,"http://127.0.0.1");
  if(url.pathname.startsWith("/demonstracao-aurora-noivas")){res.writeHead(302,{Location:url.pathname.replace("/demonstracao-aurora-noivas",base)+url.search});res.end();return;}
  if(url.pathname===base){res.writeHead(302,{Location:base+"/"});res.end();return;}
  if(!url.pathname.startsWith(base+"/")){res.writeHead(404);res.end();return;}
  const relative=decodeURIComponent(url.pathname.slice(base.length));
  let file=resolve(root,"."+relative);
  if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403);res.end();return;}
  if((await stat(file)).isDirectory()) file=resolve(file,"index.html");
  const bytes=await readFile(file);
  res.writeHead(200,{"Content-Type":types[extname(file)]??"application/octet-stream","Cache-Control":"no-cache"});res.end(bytes);
 }catch{res.writeHead(404);res.end("Não encontrado");}
}).listen(port,"127.0.0.1",()=>console.log(`Aurora Noivas: http://127.0.0.1:${port}${base}/`));
