import {chromium,webkit,expect} from "@playwright/test";
import assert from "node:assert/strict";
import {mkdir,writeFile,readFile,readdir} from "node:fs/promises";
const url=process.env.AURORA_TEST_URL??"http://127.0.0.1:5184/demonstracao-aurora-noivas/";
await mkdir("output/validation",{recursive:true});
const results=[];
const chunks=await readdir("out/_next/static/chunks");
const dressChunks=[];
for(const file of chunks.filter(file=>file.endsWith(".js"))){if((await readFile(`out/_next/static/chunks/${file}`,"utf8")).includes("low-power"))dressChunks.push(file);}
assert.ok(dressChunks.length>0,"export has a separate renderer chunk");
const suites=[{name:"chromium",engine:chromium,widths:[360,390,768,1440]},{name:"webkit",engine:webkit,widths:[390,1440]}];
for(const suite of suites){
 const browser=await suite.engine.launch({headless:true});
 try{
  for(const width of suite.widths){
   const context=await browser.newContext({viewport:{width,height:900},reducedMotion:"reduce",hasTouch:width<500});
   const page=await context.newPage();
   const requests=[];page.on("request",request=>requests.push(request.url()));
   const errors=[];page.on("pageerror",error=>errors.push(error.message));
   await page.route("https://maps.google.com/**",route=>route.fulfill({status:200,contentType:"text/html",body:"<p>Mapa externo omitido no teste local.</p>"}));
   await page.goto(url,{waitUntil:"networkidle"});
   await page.evaluate(()=>document.fonts.ready);
   assert.equal(await page.title(),"Aurora Noivas | Um vestido com a sua essência");
   await expect(page.getByRole("link",{name:"Vestidos",exact:true})).toHaveAttribute("href","#vestidos");
   assert.deepEqual(await page.getByRole("tab").allTextContents(),["Noivas","Madrinhas","Debutantes","Gala"]);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`overflow at ${width}`);
   await expect(page.locator(".dress-slide.is-current h3")).toHaveText("Jasmim");
   await expect(page.getByRole("link",{name:"← Voltar à Aldenn",exact:true})).toHaveAttribute("href","https://www.aldenn.com.br/");
   assert.equal(await page.locator("iframe").count(),1);
   assert.deepEqual(await page.locator("main > section").evaluateAll(els=>els.map(el=>el.id)),["inicio","vestidos","localizacao","planejador","processo","contato"]);
   assert.equal(await page.locator(".dress-carousel-position").count(),0);
   assert.equal(await page.locator(".dress-scene canvas").count(),0,"3D stays out of initial load");
   assert.equal(requests.some(url=>dressChunks.some(file=>url.endsWith(file))),false,"renderer download is deferred");
   const disabled=page.locator(".planner-result a");await expect(disabled).toHaveAttribute("aria-disabled","true");
   const collections=[{category:"Noivas",titles:["Jasmim","Magnólia","Camélia"],moment:"Casamento"},{category:"Madrinhas",titles:["Peônia","Lavanda","Oliva"],moment:"Madrinha"},{category:"Debutantes",titles:["Aurora","Lua","Estrela"],moment:"Debutante"},{category:"Gala",titles:["Ametista","Ônix","Rubi"],moment:"Gala"}];
   for(const collection of collections){
    await page.getByRole("tab",{name:collection.category,exact:true}).click();
    await expect(page.locator(".dress-slide.is-current h3")).toHaveText(collection.titles[0]);
    for(let index=1;index<3;index++){
     await page.getByRole("button",{name:"Próximo vestido",exact:true}).click();
     await expect(page.locator(".dress-slide.is-current h3")).toHaveText(collection.titles[index]);
    }
    await page.getByRole("button",{name:"Próximo vestido",exact:true}).click();
    await expect(page.locator(".dress-slide.is-current h3")).toHaveText(collection.titles[0]);
    await page.getByRole("button",{name:"Vestido anterior",exact:true}).click();
    await expect(page.locator(".dress-slide.is-current h3")).toHaveText(collection.titles[2]);
    await page.locator(".dress-slide.is-current .dress-reference-button").click();
    await expect(page.getByRole("button",{name:collection.moment,exact:true})).toHaveAttribute("aria-pressed","true");
    await expect(page.locator(".planner-reference")).toContainText(collection.titles[2]);
    await page.getByRole("button",{name:"Renda delicada",exact:true}).click();
    await page.getByRole("button",{name:"Já reuni algumas referências",exact:true}).click();
    await page.getByLabel("Quando será o evento?",{exact:false}).fill("2027-01-14");
    const target=new URL(await page.locator(".planner-result a").getAttribute("href"));
    assert.equal(target.pathname,"/5512991432188");
    assert.ok(target.searchParams.get("text").includes(collection.titles[2]));
    assert.ok(target.searchParams.get("text").includes("14/01/2027"));
    assert.ok(target.searchParams.get("text").includes("demonstração Aurora Noivas"));
   }
   await page.getByRole("tab",{name:"Noivas",exact:true}).click();
   const sidePhoto=page.getByRole("button",{name:"Ver vestido Magnólia",exact:true});
   await page.locator(".dress-carousel-viewport").scrollIntoViewIfNeeded();
   const sideBox=await sidePhoto.boundingBox();
   await page.mouse.click(Math.min(width-15,sideBox.x+sideBox.width/2),Math.min(700,sideBox.y+sideBox.height/2));
   await expect(page.locator(".dress-slide.is-current h3")).toHaveText("Magnólia");
   await page.getByRole("button",{name:"Usar Magnólia como referência",exact:true}).click();
   await expect(page.locator(".planner-reference")).toContainText("Magnólia");
   await page.getByRole("button",{name:"Remover referência",exact:true}).click();
   await expect(page.locator(".planner-reference")).toBeEmpty();
   await page.getByRole("tab",{name:"Gala",exact:true}).click();
   await page.getByRole("tab",{name:"Noivas",exact:true}).click();
   await expect(page.locator(".dress-slide.is-current h3")).toHaveText("Jasmim");
   const viewport=page.locator(".dress-carousel-viewport");await viewport.focus();await page.keyboard.press("ArrowRight");
   await expect(page.locator(".dress-slide.is-current h3")).toHaveText("Magnólia");
   await page.keyboard.press("Home");await expect(page.locator(".dress-slide.is-current h3")).toHaveText("Jasmim");
   await page.getByRole("tab",{name:"Noivas",exact:true}).focus();await page.keyboard.press("ArrowRight");
   await expect(page.getByRole("tab",{name:"Madrinhas",exact:true})).toBeFocused();
   await expect(page.getByRole("tab",{name:"Madrinhas",exact:true})).toHaveAttribute("aria-selected","true");
   await page.getByRole("tab",{name:"Noivas",exact:true}).click();
   if(width<500){
    await viewport.scrollIntoViewIfNeeded();
    const box=await viewport.boundingBox();const x=box.x+box.width*.8,y=box.y+Math.min(180,box.height/2);
    await viewport.dispatchEvent("pointerdown",{pointerType:"touch",clientX:x,clientY:y});
    await viewport.dispatchEvent("pointerup",{pointerType:"touch",clientX:x-100,clientY:y+4});
    await expect(page.locator(".dress-slide.is-current h3")).toHaveText("Magnólia");
    await page.locator(".dress-slide.is-current .dress-reference-button").focus();await page.keyboard.press("Enter");
    await expect(page.locator(".planner-reference")).toContainText("Magnólia");
   }
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
   await page.getByRole("tab",{name:"Noivas",exact:true}).click();
   await page.locator("#vestidos").screenshot({path:`output/validation/${suite.name}-${width}-samples.png`});
   await page.evaluate(()=>scrollTo(0,0));
   await page.screenshot({path:`output/validation/${suite.name}-${width}-hero.png`});
   await expect(page.locator(".hero-visual img")).toHaveJSProperty("naturalWidth",1024);
   await expect(page.getByRole("link",{name:"Falar com a Aldenn",exact:true})).toHaveAttribute("href","https://wa.me/5512991432188");
   await expect(page.getByRole("link",{name:"@aldenn.com.br",exact:true})).toHaveAttribute("href","https://www.instagram.com/aldenn.com.br/");
   await page.locator("#processo").scrollIntoViewIfNeeded();
   const scene=page.locator(".dress-scene");
   await expect(page.locator(".dress-showroom")).toHaveClass(/is-ready/);
   await expect(scene.locator("canvas")).toHaveCount(1);
   await page.getByRole("button",{name:"Girar vestido para a direita",exact:true}).click();
   const rotation=Number(await scene.getAttribute("data-rotation"));
   await scene.focus();await page.keyboard.press("ArrowLeft");
   assert.ok(Number(await scene.getAttribute("data-rotation"))<rotation);
   const rect=await scene.boundingBox();
   await page.mouse.move(rect.x+100,rect.y+160);await page.mouse.down();
   await page.mouse.move(rect.x+160,rect.y+160,{steps:4});await page.mouse.up();
   assert.ok(Number(await scene.getAttribute("data-rotation"))>rotation);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
   await page.locator("#process-title").click();
   await page.locator("#processo").screenshot({path:`output/validation/${suite.name}-${width}-showroom.png`});
   assert.ok(requests.some(url=>dressChunks.some(file=>url.endsWith(file))),"renderer loads on entry");
   assert.deepEqual(errors,[],`${suite.name} page errors`);
   results.push({browser:suite.name,width,passed:true,scenarios:["responsive","categories","three samples each","wrap navigation","reference selection","WhatsApp","keyboard","reduced motion","clickable photos","on-demand 3D","3D rotation",...(width<500?["touch event"]:[])]});
   await context.close();
   console.log(`PASS ${suite.name} ${width}px`);
  }
  const context=await browser.newContext({viewport:{width:1440,height:1000}});
  const page=await context.newPage();await page.route("https://maps.google.com/**",r=>r.abort());
  const errors=[];page.on("pageerror",error=>errors.push(error.message));
  await page.goto(url,{waitUntil:"networkidle"});
  await page.getByRole("link",{name:"Descobrir os vestidos",exact:true}).click();
  await expect.poll(()=>page.locator("#vestidos").evaluate(el=>el.getBoundingClientRect().top)).toBeLessThan(200);
  await page.locator(".dress-slide.is-current .dress-reference-button").focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button",{name:"Casamento",exact:true})).toHaveAttribute("aria-pressed","true");
  await expect(page.locator(".planner-reference")).toContainText("Jasmim");
  await expect.poll(()=>page.locator("#planejador").evaluate(el=>el.getBoundingClientRect().top)).toBeLessThan(200);
  assert.deepEqual(errors,[]);
  results.push({browser:suite.name,width:1440,passed:true,scenarios:["normal motion","anchor navigation","reference selection with GSAP"]});
  await context.close();
 }finally{await browser.close();}
}
// A browser without WebGL retains the illustrated dress and the main navigation.
const fallbackBrowser=await chromium.launch({headless:true});
try {
 const page=await fallbackBrowser.newPage({viewport:{width:390,height:900},reducedMotion:"reduce"});
 await page.addInitScript(()=>{
  const original=HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext=function(type,...args){if(type==="webgl"||type==="webgl2"){window.__blockedWebGLRequests=(window.__blockedWebGLRequests??0)+1;return null;}return original.call(this,type,...args);};
 });
 await page.route("https://maps.google.com/**",r=>r.abort());
 await page.goto(url,{waitUntil:"networkidle"});await page.locator("#processo").scrollIntoViewIfNeeded();
 await expect.poll(()=>page.evaluate(()=>window.__blockedWebGLRequests??0)).toBeGreaterThan(0);
 await expect(page.locator(".dress-poster")).toBeVisible();
 await expect(page.locator(".showroom-controls")).toHaveText("Silhueta ilustrativa");
 await expect(page.locator(".dress-scene canvas")).toHaveCount(0);
 await page.getByRole("link",{name:"Escolher uma referência",exact:true}).click();
 await expect(page.getByRole("tab",{name:"Noivas",exact:true})).toBeVisible();
 results.push({browser:"chromium",width:390,passed:true,scenarios:["WebGL unavailable","illustrated fallback","navigation"]});
}finally{await fallbackBrowser.close();}
await writeFile("output/validation/browser-results.json",JSON.stringify(results,null,2));
console.log(`Validated ${results.length} browser and viewport scenarios.`);
