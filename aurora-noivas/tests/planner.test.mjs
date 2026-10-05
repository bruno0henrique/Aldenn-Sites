import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { categories, dresses } from "../lib/catalog.ts";
import { createWhatsAppUrl, referenceForMoment } from "../lib/planner.ts";
import { nextSlide } from "../lib/carousel.ts";
const complete = {moment:"Gala",preference:"Estruturado e marcante",stage:"Já reuni algumas referências",eventDate:"2027-01-14",referenceId:"gala-ametista"};
test("four ordered collections have three distinct local illustrative photographs each", () => {
 assert.deepEqual(categories,["Noivas","Madrinhas","Debutantes","Gala"]);
 assert.equal(new Set(dresses.map(d=>d.id)).size,12);
 for(const category of categories) assert.equal(dresses.filter(d=>d.category===category).length,3);
 for(const dress of dresses) assert.ok(existsSync(new URL(`../public/media/${dress.id}.webp`,import.meta.url)));
});
test("WhatsApp identifies the demo, recipient, chosen sample and local date", () => {
 const url=new URL(createWhatsAppUrl(complete));
 assert.equal(url.hostname,"wa.me"); assert.equal(url.pathname,"/5512991432188");
 const message=url.searchParams.get("text");
 assert.match(message,/demonstração Aurora Noivas/); assert.match(message,/site para minha loja/);
 assert.match(message,/Ametista \(Gala\)/); assert.match(message,/14\/01\/2027/);
 assert.match(message,/Ocasião: Gala/);
});
test("incomplete or invalid selections and invalid dates do not produce a sendable message", () => {
 for(const values of [{...complete,moment:""},{...complete,stage:"inventado"},{...complete,preference:""},{...complete,eventDate:"2027-02-30"},{...complete,eventDate:"invalid"}]) assert.equal(createWhatsAppUrl(values),null);
});
test("an optional date is omitted safely, and mismatched or removed references are excluded", () => {
 const message=new URL(createWhatsAppUrl({...complete,eventDate:"",moment:"Casamento"})).searchParams.get("text");
 assert.match(message,/Ainda não definida/); assert.doesNotMatch(message,/Ametista/);
 assert.equal(referenceForMoment("gala-ametista","Casamento"),undefined);
 assert.equal(referenceForMoment("unknown","Gala"),undefined);
 const cleared=new URL(createWhatsAppUrl({...complete,referenceId:""})).searchParams.get("text");
 assert.doesNotMatch(cleared,/Referência ilustrativa/);
});
test("carousel wraps both ways and remains safe for empty or single-item lists",()=>{
 assert.equal(nextSlide(0,-1,3),2);assert.equal(nextSlide(2,1,3),0);
 assert.equal(nextSlide(0,1,1),0);assert.equal(nextSlide(0,-1,0),0);
});
