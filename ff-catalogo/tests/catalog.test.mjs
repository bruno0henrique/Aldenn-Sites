import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {products,filterProducts,whatsappUrl,commerceMode} from '../data/catalog.js';
import {home,detail,directions} from '../lib/render.mjs';
test('Locação usa dados reais sem extrapolar estoque ou tamanho',async()=>{
 const sources=JSON.parse(await readFile(new URL('../data/sources.json',import.meta.url)));
 assert.equal(products.length,8);assert.equal(new Set(products.map(x=>x.id)).size,8);
 assert.equal(sources.reduce((sum,x)=>sum+x.images.length,0),10);
 for(const p of products){
  assert.equal(p.saleEnabled,false);assert.equal(p.salePrice,null);assert.equal(p.rentalAvailability,'consultar');
  assert.deepEqual(p.sizes,[]);assert.equal(p.newArrival,false);assert.equal(commerceMode(p),'rental');
  const source=sources.find(x=>x.id===p.sourceIndex);assert.ok(source);
  assert.ok(source.sourceUrl.startsWith('https://www.ffmodafesta.com.br/product-page/'));
  for(const img of p.images){assert.ok(source.images.some(x=>x.src===img.src));await stat(new URL('../public'+img.src,import.meta.url));}
 }
});
test('Filtros combinam cor, ocasião, modelo e tecido sem afirmar grade desconhecida',()=>{
 assert.deepEqual(filterProducts(products,{color:'Verde',occasion:'Madrinhas',size:'G'}).map(x=>x.id),['ff-17']);
 assert.ok(filterProducts(products,{category:'Plus Size'}).every(x=>x.sourceIndex===11));
 assert.equal(filterProducts(products,{color:'Marrom',fabric:'Zibeline'}).length,0);
 assert.ok(filterProducts(products,{q:'AZUL MARINHO'}).length>=2);
 assert.ok(filterProducts(products,{q:'formatura'}).length>0);
 assert.equal(filterProducts(products,{q:'inexistente'}).length,0);
 const known={...products[0],sizes:['P','M']};assert.equal(filterProducts([known],{size:'G'}).length,0);
});
test('WhatsApp informa vestido, data, tamanho e URL sem enviar mensagens automaticamente',()=>{
 const url=new URL(whatsappUrl(products[0],{date:'2026-12-20',size:'G',occasion:'Madrinhas',url:'https://example.com/vestidos/menta/'}));
 assert.equal(url.hostname,'wa.me');assert.equal(url.pathname,'/5511950243377');
 const text=url.searchParams.get('text');
 for(const value of [products[0].name,products[0].id,'20/12/2026','G','Madrinhas','https://example.com/vestidos/menta/'])assert.ok(text.includes(value));
 assert.ok(new URL(whatsappUrl()).searchParams.get('text').includes('locação'));
});
test('Home e páginas de produto não contêm preço, carrinho, checkout ou avaliações falsas',()=>{
 for(const html of [home(),...products.map(detail)]){
  assert.doesNotMatch(html,/R\$|Adicionar ao carrinho|Comprar agora|checkout|cinco estrelas|5,0/);
  assert.match(html,/Consultar disponibilidade/);assert.match(html,/lang="pt-BR"/);
  assert.doesNotMatch(html,/\[nome|\[modelo|lorem ipsum/i);
 }
 assert.match(home(),/maps\.google\.com\/maps\?q=/);
 assert.ok(new URL(directions()).searchParams.get('query').includes('2976'));
});
test('Estrutura pode habilitar venda no mesmo card, somente com preço e estoque válidos',()=>{
 assert.equal(commerceMode({...products[0],saleEnabled:true}),'rental');
 assert.equal(commerceMode({...products[0],saleEnabled:true,salePrice:500,saleStock:2}),'sale');
 assert.equal(commerceMode({...products[0],rentalEnabled:false}),'unavailable');
});
