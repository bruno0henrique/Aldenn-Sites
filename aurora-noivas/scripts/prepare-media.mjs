import sharp from "sharp";
import { readFile, writeFile, mkdir } from "node:fs/promises";
const sources = JSON.parse((await readFile(process.argv[2] ?? "output/validation/image-sources.json", "utf8")).replace(/^\uFEFF/, ""));
await mkdir("public/media", {recursive:true});
await mkdir("output/validation", {recursive:true});
const contactSheet = [];
for (let index = 0; index < sources.length; index++) {
 const {id,path} = sources[index];
 await sharp(path).resize({width:1024,withoutEnlargement:true}).webp({quality:83}).toFile(`public/media/${id}.webp`);
 const thumb = await sharp(path).resize(240,360,{fit:"contain",background:"#fff8f5"}).png().toBuffer();
 contactSheet.push({input:thumb,left:index%4*240,top:Math.floor(index/4)*360});
}
await sharp({create:{width:960,height:1080,channels:3,background:"#fff8f5"}}).composite(contactSheet).png().toFile("output/validation/image-contact-sheet.png");
const photo = await sharp("public/media/noiva-jasmim.webp").resize(520,630,{fit:"cover",position:"attention"}).toBuffer();
const overlay = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><text x="70" y="205" font-family="Georgia" font-size="76" fill="#57233e">aurora</text><text x="74" y="250" font-family="Arial" font-size="15" letter-spacing="8" fill="#57233e">NOIVAS</text><text x="70" y="358" font-family="Georgia" font-size="42" fill="#34232e">Um vestido com</text><text x="70" y="414" font-family="Georgia" font-style="italic" font-size="42" fill="#57233e">a sua essência.</text><text x="70" y="550" font-family="Arial" font-size="12" fill="#725d68">DEMONSTRAÇÃO FICTÍCIA · ALDENN</text></svg>`);
await sharp({create:{width:1200,height:630,channels:3,background:"#f2d8df"}}).composite([{input:photo,left:680,top:0},{input:overlay}]).jpeg({quality:88}).toFile("public/media/aurora-compartilhamento.jpg");
const sizes = await Promise.all(sources.map(async ({id}) => ({id,bytes:(await readFile(`public/media/${id}.webp`)).length})));
await writeFile("output/validation/media-sizes.json",JSON.stringify(sizes,null,2));
console.log(JSON.stringify({images:sizes.length,totalBytes:sizes.reduce((sum,row)=>sum+row.bytes,0)}));
