import {mkdir,writeFile,cp} from 'node:fs/promises';
import {products} from '../data/catalog.js';
import {home,detail,shell} from '../lib/render.mjs';
const dist=new URL('../dist/',import.meta.url);
await mkdir(dist,{recursive:true});
await cp(new URL('../public/',import.meta.url),dist,{recursive:true});
await mkdir(new URL('data/',dist),{recursive:true});
await cp(new URL('../data/catalog.js',import.meta.url),new URL('data/catalog.js',dist));
await mkdir(new URL('lib/',dist),{recursive:true});
await cp(new URL('../lib/render.mjs',import.meta.url),new URL('lib/render.mjs',dist));
await writeFile(new URL('index.html',dist),home());
for(const product of products){
 const route=new URL(`vestidos/${product.slug}/`,dist);
 await mkdir(route,{recursive:true}); await writeFile(new URL('index.html',route),detail(product));
}
await writeFile(new URL('404.html',dist),shell('<section class="section empty-state"><h1>Este vestido não foi encontrado.</h1><a class="button" href="/#catalogo">Explorar o catálogo</a></section>','Página não encontrada'));
console.log(`Build concluído: início + ${products.length} páginas de vestido. Fotografias e fontes locais.`);
