import sharp from "../../taeko/node_modules/sharp/lib/index.js";
import { fileURLToPath } from "node:url";

const width = 1080;
const height = 1350;
const output = fileURLToPath(new URL("./aldenn-sites-ads-feed-v2.png", import.meta.url));
const photoPath = fileURLToPath(new URL("../../taeko/public/media/hero-editorial.webp", import.meta.url));

const photo = await sharp(photoPath)
  .resize(444, 470, { fit: "cover", position: "right" })
  .composite([
    {
      input: Buffer.from(
        '<svg width="444" height="470" xmlns="http://www.w3.org/2000/svg"><rect width="444" height="470" rx="3" fill="white"/></svg>',
      ),
      blend: "dest-in",
    },
  ])
  .png()
  .toBuffer();

const artwork = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="1080" height="1350" fill="#F2F0EB"/>
  <rect x="0" y="0" width="18" height="1350" fill="#2457FF"/>

  <g fill="#111111" font-family="Arial, Helvetica, sans-serif">
    <text x="76" y="102" font-size="31" font-weight="700" letter-spacing="5">ALDENN.</text>
    <text x="1004" y="90" text-anchor="end" font-size="15" font-weight="700" letter-spacing="2.6">SITES COM ESTRATÉGIA</text>
    <text x="1004" y="116" text-anchor="end" font-size="15" letter-spacing="2.6" fill="#66635E">DESIGN + CÓDIGO</text>

    <text x="76" y="272" font-size="79" font-weight="700" letter-spacing="-3.6">Seu negócio</text>
    <text x="76" y="354" font-size="79" font-weight="700" letter-spacing="-3.6">merece mais</text>
    <text x="76" y="436" font-size="79" font-weight="700" letter-spacing="-3.6">que um perfil.</text>

    <rect x="76" y="490" width="78" height="7" fill="#2457FF"/>
    <text x="76" y="557" font-size="27" font-weight="400" fill="#373532">Sites sob medida para apresentar sua marca,</text>
    <text x="76" y="596" font-size="27" font-weight="400" fill="#373532">explicar seu valor e facilitar o contato.</text>
  </g>

  <g>
    <rect x="514" y="660" width="490" height="528" rx="7" fill="#FFFFFF" stroke="#1B1B1B" stroke-width="2"/>
    <rect x="514" y="660" width="490" height="46" rx="7" fill="#171717"/>
    <rect x="514" y="699" width="490" height="7" fill="#171717"/>
    <circle cx="540" cy="683" r="5" fill="#FF6B66"/>
    <circle cx="558" cy="683" r="5" fill="#E7C34A"/>
    <circle cx="576" cy="683" r="5" fill="#62B56A"/>
    <text x="606" y="688" fill="#BDBDBD" font-family="Arial, Helvetica, sans-serif" font-size="12">aldenn.com.br/demonstracao-taeko</text>
  </g>

  <g fill="#111111" font-family="Arial, Helvetica, sans-serif">
    <text x="76" y="718" font-size="15" font-weight="700" letter-spacing="2.2">O QUE ENTRA NO PROJETO</text>
    <line x1="76" y1="744" x2="452" y2="744" stroke="#BDB9B1"/>
    <text x="76" y="796" font-size="25" font-weight="700">01</text>
    <text x="138" y="796" font-size="25">Identidade visual aplicada</text>
    <line x1="76" y1="830" x2="452" y2="830" stroke="#D2CEC7"/>
    <text x="76" y="882" font-size="25" font-weight="700">02</text>
    <text x="138" y="882" font-size="25">Experiência no celular</text>
    <line x1="76" y1="916" x2="452" y2="916" stroke="#D2CEC7"/>
    <text x="76" y="968" font-size="25" font-weight="700">03</text>
    <text x="138" y="968" font-size="25">Conteúdo com direção</text>
  </g>

  <g font-family="Arial, Helvetica, sans-serif">
    <rect x="76" y="1082" width="376" height="82" rx="41" fill="#2457FF"/>
    <text x="264" y="1132" text-anchor="middle" fill="#FFFFFF" font-size="20" font-weight="700" letter-spacing="1.3">PEÇA UMA PROPOSTA</text>
    <text x="76" y="1249" fill="#111111" font-size="17" font-weight="700" letter-spacing="2">ALDENN SITES</text>
    <text x="1004" y="1249" text-anchor="end" fill="#66635E" font-size="17">Criação de sites para negócios reais.</text>
    <line x1="76" y1="1282" x2="1004" y2="1282" stroke="#AAA69E"/>
  </g>
</svg>`;

await sharp(Buffer.from(artwork))
  .composite([
    { input: photo, left: 537, top: 704 },
    {
      input: Buffer.from(`
        <svg width="438" height="430" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="shade" x1="0" y1="1" x2="0.9" y2="0">
              <stop offset="0" stop-color="#2A161A" stop-opacity="0.78"/>
              <stop offset="0.55" stop-color="#2A161A" stop-opacity="0.06"/>
              <stop offset="1" stop-color="#2A161A" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <rect width="438" height="430" fill="url(#shade)"/>
          <text x="22" y="36" fill="#FFFFFF" font-family="Georgia, serif" font-size="19">Taeko Noivas</text>
          <text x="22" y="330" fill="#FFFFFF" font-family="Georgia, serif" font-size="34">O seu sonho,</text>
          <text x="22" y="371" fill="#FFFFFF" font-family="Georgia, serif" font-size="34">feito sob medida.</text>
          <rect x="22" y="392" width="122" height="2" fill="#FFFFFF" opacity="0.75"/>
        </svg>`),
      left: 540,
      top: 706,
    },
    {
      input: Buffer.from(`
        <svg width="438" height="32" xmlns="http://www.w3.org/2000/svg">
          <rect width="438" height="32" fill="#6D2438"/>
          <text x="20" y="21" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="11" letter-spacing="2">PROJETO REAL · TAEKO NOIVAS</text>
        </svg>`),
      left: 540,
      top: 1136,
    },
  ])
  .png({ compressionLevel: 9 })
  .toFile(output);

console.log(output);
