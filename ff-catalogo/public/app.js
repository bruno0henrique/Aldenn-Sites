import {products,filterProducts,whatsappUrl} from './data/catalog.js';
import {card,escape,icon} from './lib/render.mjs';
const $ = selector => document.querySelector(selector);
// Rotação contínua solicitada: interação manual não interrompe o intervalo.
const campaign=$('.campaign');
if(campaign){
 const slides=[...campaign.querySelectorAll('.campaign-slide')];
 const dots=[...campaign.querySelectorAll('.campaign-dots button')];
 let current=0,startX=null,startY=null;
 const show=index=>{current=(index+slides.length)%slides.length;campaign.dataset.active=String(current);slides.forEach((slide,i)=>{slide.hidden=i!==current;});dots.forEach((dot,i)=>dot.setAttribute('aria-pressed',String(i===current)));$('#campaign-status').textContent=`Banner ${current+1} de ${slides.length}: ${slides[current].dataset.label}`;};
 setInterval(()=>show(current+1),5000);
 campaign.querySelector('.previous').addEventListener('click',()=>show(current-1));
 campaign.querySelector('.next').addEventListener('click',()=>show(current+1));
 dots.forEach((dot,i)=>dot.addEventListener('click',()=>show(i)));
 const stage=campaign.querySelector('.campaign-stage');
 stage.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();show(current+(event.key==='ArrowLeft'?-1:1));}});
 stage.addEventListener('touchstart',event=>{startX=event.touches[0].clientX;startY=event.touches[0].clientY;},{passive:true});
 stage.addEventListener('touchend',event=>{if(startX===null)return;const dx=event.changedTouches[0].clientX-startX,dy=event.changedTouches[0].clientY-startY;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)){show(current+(dx>0?-1:1));stage.dataset.swiped='true';}startX=null;},{passive:true});
 stage.addEventListener('click',event=>{if(stage.dataset.swiped){event.preventDefault();delete stage.dataset.swiped;}},true);
}
const keys={q:'busca',occasion:'ocasiao',color:'cor',size:'tamanho',model:'modelo',fabric:'tecido',length:'comprimento',category:'categoria'};
const readFilters = () => Object.fromEntries(Object.entries(keys).map(([key,param])=>[key,new URLSearchParams(location.search).get(param) || '']));
let filters=readFilters();
let dialogTrigger;
const publicReference = p => ['localhost','127.0.0.1','::1'].includes(location.hostname) ? undefined : new URL(`/vestidos/${p.slug}/`,location.origin).href;
document.addEventListener('click',event=>{
 const opener=event.target.closest('[data-open]');
 if(opener){dialogTrigger=opener;document.getElementById(opener.dataset.open).showModal();document.body.classList.add('dialog-open');}
 const close=event.target.closest('[data-close]');
 if(close)close.closest('dialog').close();
});
for(const dialog of document.querySelectorAll('dialog')){
 dialog.addEventListener('close',()=>{document.body.classList.remove('dialog-open');dialogTrigger?.focus();});
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
}
function updateWhatsapp(){
 for(const anchor of document.querySelectorAll('[data-wa-product]')){
  const p=products.find(x=>x.id===anchor.dataset.waProduct);
  const detail=$('[data-detail]');
  anchor.href=whatsappUrl(p,{size:detail?$('#event-size')?.value:filters.size,date:detail?$('#event-date')?.value:'',occasion:filters.occasion,url:publicReference(p)});
 }
 const current=$('[data-detail]');
 if(current){const p=products.find(x=>x.id===current.dataset.detail);$('.floating-wa').href=whatsappUrl(p,{size:$('#event-size')?.value,date:$('#event-date')?.value,url:publicReference(p)});}
 for(const link of document.querySelectorAll('#catalog-grid a[href^="/vestidos/"]')){
  const url=new URL(link.href);if(filters.size)url.searchParams.set('tamanho',filters.size);link.href=url.pathname+url.search;
 }
}
function renderCatalog(saveUrl=true){
 const grid=$('#catalog-grid');if(!grid)return;
 const found=filterProducts(products,filters);
 grid.innerHTML=found.map(card).join('');
 $('#result-count').textContent=`${found.length} ${found.length===1?'vestido':'vestidos'}`;
 $('#empty-state').hidden=found.length>0;
 $('#catalog-search').value=filters.q;
 const active=Object.entries(filters).filter(([,value])=>value);
 $('#filter-count').textContent=active.length?`(${active.length})`:'';
 $('#active-filters').innerHTML=active.map(([key,value])=>`<button data-remove="${key}" aria-label="Remover filtro ${escape(value)}">${key==='size'?'Tamanho desejado: ':''}${escape(value)} ${icon('close')}</button>`).join('');
 $('#size-note').hidden=!filters.size;
 $('#size-note').textContent=`Você busca tamanho ${filters.size}. A numeração destas peças precisa ser confirmada; os resultados são sugestões para consultar com a loja.`;
 for(const select of $('#filter-form').elements){if(select.name)select.value=filters[select.name] || '';}
 for(const button of document.querySelectorAll('[data-occasion],[data-category]')){
  button.setAttribute('aria-pressed',button.hasAttribute('data-category')?String(filters.category===button.dataset.category):String(!filters.category&&filters.occasion===button.dataset.occasion));
 }
 if(saveUrl){const url=new URL(location.href);url.search='';for(const [key,value]of active)url.searchParams.set(keys[key],value);history.replaceState(null,'',url);}
 updateWhatsapp();
}
if($('#catalog-grid')){
 renderCatalog(false);
 $('#catalog-search').addEventListener('input',event=>{filters.q=event.target.value;renderCatalog();});
 $('#filter-form').addEventListener('submit',event=>{event.preventDefault();const entries=Object.fromEntries(new FormData(event.currentTarget));filters={...filters,...entries};renderCatalog();$('#filter-dialog').close();});
 $('#reset-filters').addEventListener('click',()=>{filters={q:filters.q};$('#filter-form').reset();renderCatalog();});
 $('#clear-all').addEventListener('click',()=>{filters={};renderCatalog();});
 $('#active-filters').addEventListener('click',event=>{const b=event.target.closest('[data-remove]');if(b){filters[b.dataset.remove]='';renderCatalog();}});
 for(const b of document.querySelectorAll('[data-occasion],[data-category]'))b.addEventListener('click',()=>{filters.category=b.dataset.category||'';filters.occasion=b.dataset.occasion||'';renderCatalog();});
 window.addEventListener('popstate',()=>{filters=readFilters();renderCatalog(false);});
 if(Object.values(filters).some(Boolean)&&!location.hash)$('#catalogo').scrollIntoView();
}
const detail=$('[data-detail]');
if(detail){
 const p=products.find(x=>x.id===detail.dataset.detail);
 const date=$('#event-date');
 const today=new Date();date.min=`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
 const requested=readFilters().size;if(requested)$('#event-size').value=requested;
 date.addEventListener('change',()=>{if(date.value && date.value<date.min){date.value='';}updateWhatsapp();});
 $('#event-size').addEventListener('change',updateWhatsapp);
 for(const b of document.querySelectorAll('[data-image]'))b.addEventListener('click',()=>{
  const img=p.images[Number(b.dataset.image)];
  for(const main of document.querySelectorAll('.gallery-main > img,.zoom-photo')){main.src=img.src;main.srcset=`${img.small} 480w, ${img.src} 1100w`;}
  for(const thumb of document.querySelectorAll('[data-image]'))thumb.setAttribute('aria-pressed',String(thumb===b));
 });
 updateWhatsapp();
}
// Entradas discretas, sem deslocar a página nem esconder conteúdo sem JavaScript.
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
 const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.animate([{opacity:0.6,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:450,easing:'ease-out'});observer.unobserve(entry.target);}},{threshold:0.08});
 for(const element of document.querySelectorAll('.section-heading,.editorial-card,.store-copy'))observer.observe(element);
}
