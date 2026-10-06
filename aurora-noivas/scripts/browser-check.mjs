import {chromium,webkit,expect} from "@playwright/test";
import assert from "node:assert/strict";
import {mkdir,writeFile} from "node:fs/promises";
const url=process.env.AURORA_TEST_URL??"http://127.0.0.1:5184/demonstracao-noiva-dois/";
await mkdir("output/validation",{recursive:true});
const results=[];
const suites=[{name:"chromium",engine:chromium,widths:[360,390,768,1440]},{name:"webkit",engine:webkit,widths:[390,1440]}];
for(const suite of suites){
 const browser=await suite.engine.launch({headless:true});
 try{
  for(const width of suite.widths){
   const context=await browser.newContext({viewport:{width,height:900},reducedMotion:"reduce",hasTouch:width<500});
   const page=await context.newPage();
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
   await expect(page.locator("canvas")).toHaveCount(0);
   await expect(page.locator(".process-photo img")).toHaveAttribute("src",/noiva-magnolia.webp/);
   const disabled=page.locator(".planner-result a");await expect(disabled).toHaveAttribute("aria-disabled","true");
   const collections=[{category:"Noivas",titles:["Jasmim","Magnólia","Camélia"],moment:"Casamento"},{category:"Madrinhas",titles:["Peônia","Lavanda","Oliva"],moment:"Madrinha"},{category:"Debutantes",titles:["Aurora","Lua","Estrela"],moment:"Debutante"},{category:"Gala",titles:["Ametista","Ônix","Rubi"],moment:"Gala"}];
   for(const collection of collections){
    await page.getByRole("tab",{name:collection.category,exact:true}).click();
    await expect(page.locator(".dress-slide.is-current h3")).toHaveText(collection.titles[0]);
    await expect(page.locator(".dress-slide.is-current img")).toHaveJSProperty("naturalWidth",1024);
    for(let index=1;index<3;index++){
     await page.getByRole("button",{name:"Próximo vestido",exact:true}).click();
     await expect(page.locator(".dress-slide.is-current h3")).toHaveText(collection.titles[index]);
     await expect(page.locator(".dress-slide.is-current img")).toHaveJSProperty("naturalWidth",1024);
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
   await expect(page.locator(".process-photo img")).toHaveJSProperty("naturalWidth",1024);
   await expect(page.locator("canvas")).toHaveCount(0);
   await page.locator("#processo").screenshot({path:`output/validation/${suite.name}-${width}-process.png`});
   assert.deepEqual(errors,[],`${suite.name} page errors`);
   results.push({browser:suite.name,width,passed:true,scenarios:["responsive","categories","three samples each","wrap navigation","reference selection","WhatsApp","keyboard","reduced motion","clickable photos","static editorial photograph",...(width<500?["touch event"]:[])]});
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
  await page.emulateMedia({reducedMotion:"reduce"});
  await expect.poll(()=>page.evaluate(()=>document.getAnimations().filter(a=>a.playState==="running").length)).toBe(0);
  assert.deepEqual(errors,[]);
  results.push({browser:suite.name,width:1440,passed:true,scenarios:["normal motion","dynamic reduced motion","anchor navigation","reference selection with native scrolling"]});
  await context.close();
 }finally{await browser.close();}
}
await writeFile("output/validation/browser-results.json",JSON.stringify(results,null,2));
console.log(`Validated ${results.length} browser and viewport scenarios.`);
