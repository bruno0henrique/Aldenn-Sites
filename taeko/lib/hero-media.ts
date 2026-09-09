export type SequenceSource = { poster: string; framePattern?: string; frameCount?: number; focalPoint: [number, number] };
export type HeroMedia = { mode: "poster" | "sequence"; desktop: SequenceSource; mobile: SequenceSource; scrollDistance: number };
export const heroMedia: HeroMedia = {
 mode: "poster",
 desktop: { poster: "/demonstracao-taeko/media/hero-editorial.webp", focalPoint: [0.7, 0.5] },
 mobile: { poster: "/demonstracao-taeko/media/hero-editorial.webp", focalPoint: [0.72, 0.5] },
 scrollDistance: 1.4,
};
