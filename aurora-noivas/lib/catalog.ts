export const categories = ["Noivas", "Madrinhas", "Debutantes", "Gala"] as const;
export type Category = (typeof categories)[number];
export type Dress = { id: string; title: string; category: Category; description: string; alt: string; src: string };
export const basePath = "/demonstracao-aurora-noivas";
const dress = (id: string, title: string, category: Category, description: string, alt: string): Dress => ({ id, title, category, description, alt, src: `${basePath}/media/${id}.webp` });
export const dresses: Dress[] = [
 dress("noiva-jasmim", "Jasmim", "Noivas", "Renda floral, mangas delicadas e uma saia que acompanha o seu sim.", "Modelo de pele escura e cabelo cacheado com vestido de noiva em renda e saia ampla"),
 dress("noiva-magnolia", "Magnólia", "Noivas", "O encanto do cetim em linhas leves e um decote que emoldura o rosto.", "Modelo morena de cabelo cacheado com vestido de noiva em cetim marfim"),
 dress("noiva-camelia", "Camélia", "Noivas", "Camadas de tule e detalhes românticos para uma entrada inesquecível.", "Modelo com cabelo ondulado usando vestido de noiva com renda e tule"),
 dress("madrinha-peonia", "Peônia", "Madrinhas", "Rosé fluido, um ombro só e movimento em cada passo.", "Modelo de pele escura e cabelo cacheado com vestido rosé de um ombro só"),
 dress("madrinha-lavanda", "Lavanda", "Madrinhas", "Um toque de lilás, mangas suaves e delicadeza no caimento.", "Modelo morena cacheada usando vestido longo lilás com mangas leves"),
 dress("madrinha-oliva", "Oliva", "Madrinhas", "Cetim verde-sálvia para celebrar com leveza e personalidade.", "Modelo usando vestido de madrinha verde-sálvia com decote drapeado"),
 dress("debutante-aurora", "Aurora", "Debutantes", "Rosa, bordados florais e uma saia de tule feita para sonhar.", "Modelo adulta de pele escura e cabelo cacheado com vestido de baile rosa"),
 dress("debutante-lua", "Lua", "Debutantes", "Lilás e brilho delicado para iluminar um momento só seu.", "Modelo adulta morena cacheada com vestido de baile lilás"),
 dress("debutante-estrela", "Estrela", "Debutantes", "Champagne e pequenos brilhos em uma silhueta de conto de fadas.", "Modelo adulta de cabelo ruivo com vestido de baile champagne"),
 dress("gala-ametista", "Ametista", "Gala", "Ameixa profundo, drapeados e uma presença que dispensa excessos.", "Modelo de pele escura e cabelo cacheado usando vestido de gala ameixa"),
 dress("gala-onix", "Ônix", "Gala", "Preto, linhas esculturais e elegância para uma noite especial.", "Modelo morena com penteado cacheado e vestido de gala preto assimétrico"),
 dress("gala-rubi", "Rubi", "Gala", "Vinho e bordados discretos para uma elegância marcante.", "Modelo de cabelo ondulado usando vestido de gala vinho com bordados"),
];
export const momentForCategory: Record<Category, string> = { Noivas: "Casamento", Madrinhas: "Madrinha", Debutantes: "Debutante", Gala: "Gala" };
export const referenceEvent = "aurora:select-reference";
