import sources from "./sources.json";
import illustrations from "./illustrative-images.json";
import { propertyVideos } from "./videos";
import type { Property } from "../lib/property";

const records: Omit<Property, "images" | "sourceUrl" | "consultedAt">[] = [
  {
    reference: "27236", colors: ["branca", "bege"], slug: "casa-vivant-urbanova", title: "Casa no Vivant Urbanova", subtitle: "Arquitetura contemporânea, espaços para viver.",
    purpose: "venda", type: "Casa", city: "São José dos Campos", neighborhood: "Urbanova", development: "Vivant Urbanova",
    price: 2950000, condominium: 937, iptu: 369, builtArea: 390, landArea: 452,
    bedrooms: 4, suites: 4, bathrooms: 6, parking: 6,
    description: ["Uma casa de arquitetura contemporânea no Vivant Urbanova, com pé-direito duplo e ambientes integrados. São quatro suítes, incluindo uma máster com closet e banheira, em 390 m² de construção.", "A cozinha com ilha se conecta aos espaços de convivência. Na área externa, a piscina aquecida e o espaço gourmet com churrasqueira e forno de pizza ampliam as possibilidades de receber.", "Automação de iluminação e som, aquecimento solar e tomada para carro elétrico completam a residência. O condomínio oferece lazer e espaços para atividades ao ar livre."],
    features: ["4 suítes", "Suíte máster com closet e banheira", "Pé-direito duplo", "Cozinha gourmet com ilha", "Piscina privativa aquecida", "Churrasqueira e forno de pizza", "Automação de iluminação e som", "Aquecimento solar", "Tomada para carro elétrico", "6 vagas, sendo 3 cobertas"],
    amenities: ["Portaria e monitoramento", "Piscinas e raia de 25 m", "Academia", "Beach tennis e squash", "Sauna e spa", "Playground", "Pista de caminhada", "Salão de festas"],
  },
  {
    reference: "13027", colors: ["branca", "marrom"], slug: "sobrado-residencial-jaguary", title: "Sobrado no Residencial Jaguary", subtitle: "Amplitude e uma vista para a reserva.",
    purpose: "venda", type: "Casa", city: "São José dos Campos", neighborhood: "Urbanova", development: "Residencial Jaguary",
    price: 3200000, condominium: 400, iptu: 200, builtArea: 450, landArea: null,
    bedrooms: 5, suites: 5, bathrooms: 7, parking: 8,
    description: ["Cinco suítes e 450 m² de área construída em um sobrado no Residencial Jaguary, no Urbanova. Os espaços de estar, jantar e TV se articulam com a cozinha e a área gourmet.", "O terraço tem vista para a reserva ambiental. Piscina com sauna integrada, lareira, escritório e elevador compõem os ambientes da casa.", "A residência conta com lavanderia, dependência de serviço, hobby box e garagem para oito veículos."],
    features: ["5 suítes", "Elevador", "Terraço com vista para a reserva", "Piscina com sauna integrada", "Área gourmet", "Sala de TV com lareira", "Escritório", "Hobby box", "Dependência de serviço", "8 vagas de garagem"],
    amenities: [],
  },
  {
    reference: "24477", colors: ["branca"], slug: "casa-alphaville-ii", title: "Casa no Alphaville II", subtitle: "Privacidade, luz e espaço ao ar livre.",
    purpose: "venda", type: "Casa", city: "São José dos Campos", neighborhood: "Alphaville II", development: "Alphaville II",
    price: 2980000, condominium: 900, iptu: 150, builtArea: 280, landArea: 470,
    bedrooms: 3, suites: 3, bathrooms: null, parking: 4,
    description: ["No condomínio Alphaville II, esta casa reúne três suítes, incluindo uma máster, e escritório para trabalhar com privacidade. São 280 m² de construção em um terreno de 470 m².", "A área externa inclui piscina de 35 m², churrasqueira e varanda. Sala de estar e jantar completam os ambientes de convivência, com quatro vagas de garagem."],
    features: ["3 suítes", "Suíte máster", "Escritório", "Piscina de 35 m²", "Churrasqueira", "Varanda", "Sala de estar e jantar", "Lavabo", "Área de serviço", "4 vagas de garagem"],
    amenities: [],
  },
  {
    reference: "24060", colors: ["bege", "branca", "cinza"], slug: "apartamento-splendor-garden-venda", title: "Apartamento no Splendor Garden", subtitle: "Vista livre e o sol da manhã.",
    purpose: "venda", type: "Apartamento", city: "São José dos Campos", neighborhood: "Jardim das Indústrias", development: "Splendor Garden",
    price: 1250000, condominium: 595, iptu: null, builtArea: 100, landArea: null,
    bedrooms: 3, suites: 1, bathrooms: null, parking: 2,
    description: ["Apartamento de 100 m², em andar alto, com vista livre e sol da manhã. Os três dormitórios, sendo uma suíte, têm armários planejados. A varanda gourmet conta com cortina de vidro e armários.", "A cozinha possui armários e eletrodomésticos descritos no anúncio, incluindo geladeira, forno e lava-louças. O imóvel tem lavabo, duas vagas no subsolo e hobby box.", "O Splendor Garden reúne piscinas, quadras, academias, salões de festas e espaços de lazer. A localização permite acesso à Rodovia Presidente Dutra e aos serviços do Jardim das Indústrias."],
    features: ["3 dormitórios, sendo 1 suíte", "Varanda gourmet com cortina de vidro", "Vista livre", "Sol da manhã", "Andar alto", "Cozinha equipada", "Armários planejados", "Lavabo", "Hobby box", "2 vagas no subsolo"],
    amenities: ["Piscinas adulto, infantil e climatizada", "Quadras esportivas", "2 academias", "Salões de festas", "Espaço gourmet", "Pet care", "Sauna", "Playground"],
  },
  {
    reference: "21457", colors: ["bege"], slug: "casa-villa-de-santanna", title: "Casa no Villa de Santanna", subtitle: "Um refúgio amplo para morar.",
    purpose: "locacao", type: "Casa", city: "Jacareí", neighborhood: "Altos de Santanna", development: "Villa de Santanna",
    price: 9800, condominium: 1690, iptu: 376, builtArea: 360, landArea: 850,
    bedrooms: 3, suites: 3, bathrooms: null, parking: 4,
    description: ["Construída em dois lotes no Villa de Santanna, esta casa tem 360 m² de área construída e terreno de 850 m². São três suítes, duas delas com closet, incluindo uma máster com hidromassagem.", "Quatro salas, lareira e cozinha americana planejada criam espaços de convivência. O escritório tem banheiro privativo, e a área gourmet recebe os momentos de encontro.", "A lavanderia conta com quarto adicional e banheiro de apoio. A residência oferece quatro vagas de garagem."],
    features: ["3 suítes", "2 closets", "Suíte máster com hidromassagem", "4 salas", "Lareira", "Escritório com banheiro privativo", "Cozinha americana planejada", "Área gourmet", "Quarto e banheiro de apoio", "4 vagas de garagem"],
    amenities: [],
  },
  {
    reference: "26556", colors: ["bege", "cinza", "branca"], slug: "apartamento-casablanca-aquarius", title: "Apartamento no Casablanca", subtitle: "Vista livre, amplitude e sol da manhã.",
    purpose: "locacao", type: "Apartamento", city: "São José dos Campos", neighborhood: "Jardim Aquarius", development: "Casablanca",
    price: 8000, condominium: 1530, iptu: 260, builtArea: 153, landArea: null,
    bedrooms: 4, suites: 2, bathrooms: 4, parking: 3,
    description: ["Apartamento de 153 m² no Jardim Aquarius, com vista livre e sol da manhã. O edifício Casablanca tem apenas dois apartamentos por andar. São quatro dormitórios com armários planejados, incluindo duas suítes e sacada privativa na máster.", "A sala de aproximadamente 34 m² acomoda dois ambientes. Cozinha com despensa e armários, lavabo, banheiro de serviço e aquecimento a gás completam os espaços, com três vagas no subsolo.", "O condomínio reúne piscina, academia, brinquedoteca, salão de festas e churrasqueira. A localização fica próxima à Praça Ulisses Guimarães e aos serviços do Jardim Aquarius."],
    features: ["4 dormitórios, sendo 2 suítes", "Suíte máster com sacada", "Vista livre e sol da manhã", "2 apartamentos por andar", "Sala de aproximadamente 34 m²", "Armários planejados", "Cozinha com despensa", "Aquecimento a gás", "Lavabo e banheiro de serviço", "3 vagas no subsolo"],
    amenities: ["Piscina", "Academia", "Brinquedoteca", "Salão de festas", "Churrasqueira", "Forno a lenha"],
  },
];

export const properties: Property[] = records.map((record) => {
  const source = sources.find((item) => item.reference === record.reference);
  const gallery = illustrations.find((item) => item.reference === record.reference);
  if (!source || !gallery || gallery.images.length < 6) throw new Error(`Fonte incompleta: ${record.reference}`);
  return { ...record, images: gallery.images, sourceUrl: source.url, consultedAt: source.consultedAt, video3d: propertyVideos[record.reference] };
});
