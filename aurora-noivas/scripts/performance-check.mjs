import {chromium} from "@playwright/test";
import {writeFile,mkdir} from "node:fs/promises";
const url=process.env.AURORA_TEST_URL??"http://127.0.0.1:5184/demonstracao-noiva-dois/";
await mkdir("output/validation",{recursive:true});
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 await page.route("https://maps.google.com/**",r=>r.fulfill({status:200,contentType:"text/html",body:"<p>Mapa</p>"}));
 await page.goto(url,{waitUntil:"networkidle"});
 await page.evaluate(()=>document.fonts.ready);
 const cdp=await page.context().newCDPSession(page);await cdp.send("Emulation.setCPUThrottlingRate",{rate:4});
 async function measure(name,action){
  await page.evaluate(()=>{window.__perf={frames:[],tasks:[],last:0,active:true};window.__observer=new PerformanceObserver(list=>{window.__perf.tasks.push(...list.getEntries().map(e=>e.duration));});window.__observer.observe({type:"longtask",buffered:false});function frame(t){if(!window.__perf.active)return;if(window.__perf.last)window.__perf.frames.push(t-window.__perf.last);window.__perf.last=t;requestAnimationFrame(frame);}requestAnimationFrame(frame);});
  await action();
  return await page.evaluate(name=>{const p=window.__perf;p.active=false;window.__observer.disconnect();const f=p.frames.sort((a,b)=>a-b);return{name,frames:f.length,p95ms:f[Math.floor(f.length*.95)],slowFrames:f.filter(t=>t>35).length,longTasks:p.tasks.length,longTaskMax:Math.max(0,...p.tasks),longTaskTotal:p.tasks.reduce((a,b)=>a+b,0)};},name);
 }
 const results=[];
 results.push(await measure("scroll",async()=>{for(let i=0;i<40;i++){await page.mouse.wheel(0,125);await page.waitForTimeout(45);}for(let i=0;i<40;i++){await page.mouse.wheel(0,-125);await page.waitForTimeout(45);}await page.waitForTimeout(500);}));
 console.log("scroll",results.at(-1));
 await page.getByRole("link",{name:"Descobrir os vestidos",exact:true}).click();await page.waitForTimeout(1300);
 results.push(await measure("categories",async()=>{for(const name of ["Madrinhas","Debutantes","Gala","Noivas"]){await page.getByRole("tab",{name,exact:true}).click();await page.waitForTimeout(700);}}));
 await writeFile(`output/validation/performance-${process.argv[2]??"current"}.json`,JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
}finally{await browser.close();}
