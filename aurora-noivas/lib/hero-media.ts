export type SequenceSource = { poster: string; framePattern?: string; frameCount?: number; focalPoint: [number, number] };
export type HeroMedia = { mode: "poster" | "sequence"; desktop: SequenceSource; mobile: SequenceSource; scrollDistance: number };
export const heroMedia: HeroMedia = { mode: "poster", desktop: { poster: "/demonstracao-noiva-dois/media/noiva-jasmim.webp", focalPoint: [0.5, 0.4] }, mobile: { poster: "/demonstracao-noiva-dois/media/noiva-jasmim.webp", focalPoint: [0.5, 0.4] }, scrollDistance: 1.4 };
