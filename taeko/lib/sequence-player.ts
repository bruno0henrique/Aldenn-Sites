import type { SequenceSource } from "./hero-media";
export function frameIndex(progress: number, count: number) {
 return Math.round(Math.max(0, Math.min(1, Number.isFinite(progress) ? progress : 0)) * Math.max(0, count - 1));
}
export function frameUrl(pattern: string, index: number) {
 return pattern.replace("{frame}", String(index + 1).padStart(4, "0"));
}
export function coverRect(width: number, height: number, imageWidth: number, imageHeight: number, focalPoint: [number, number]) {
 const scale = Math.max(width / imageWidth, height / imageHeight);
 const w = imageWidth * scale, h = imageHeight * scale;
 return [(width - w) * Math.max(0, Math.min(1, focalPoint[0])), (height - h) * Math.max(0, Math.min(1, focalPoint[1])), w, h] as const;
}
// Bounded cache and two requests in flight. No eager full-sequence preload.
export function createSequencePlayer(canvas: HTMLCanvasElement, source: SequenceSource, onFailure = () => {}) {
 const ctx = canvas.getContext("2d");
 const cache = new Map<number, ImageBitmap>();
 const pending = new Map<number, AbortController>();
 let desired = 0, lastDrawn = -1, stopped = false, failures = 0;
 let resolveReady: (value: boolean) => void = () => {};
 const ready = new Promise<boolean>((resolve) => { resolveReady = resolve; });
 let queue: number[] = [];
 const count = source.frameCount ?? 0;
 let maxCached = 4;
 function draw(index: number) {
  const bitmap = cache.get(index);
  if (!bitmap || !ctx || stopped) return;
  const rect = coverRect(canvas.width, canvas.height, bitmap.width, bitmap.height, source.focalPoint);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, ...rect);
  canvas.style.opacity = "1";
  lastDrawn = index;
  resolveReady(true);
 }
 function resize() {
  const bounds = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  canvas.width = Math.max(1, Math.round(bounds.width * dpr));
  canvas.height = Math.max(1, Math.round(bounds.height * dpr));
  draw(cache.has(desired) ? desired : lastDrawn);
 }
 const observer = new ResizeObserver(resize);
 observer.observe(canvas);
 function release() {
  for (const request of pending.values()) request.abort();
  for (const bitmap of cache.values()) bitmap.close();
  pending.clear(); cache.clear(); queue = [];
 }
 function fail() {
  stopped = true; canvas.style.opacity = "0"; resolveReady(false);
  observer.disconnect(); release(); onFailure();
 }
 function prune() {
  const victims = [...cache.keys()].filter((index) => index !== lastDrawn && index !== desired).sort((a, b) => Math.abs(b - desired) - Math.abs(a - desired));
  while (cache.size > maxCached && victims.length) {
   const index = victims.shift()!;
   cache.get(index)?.close(); cache.delete(index);
  }
 }
 async function load(index: number, controller: AbortController) {
  try {
   const response = await fetch(frameUrl(source.framePattern!, index), { signal: controller.signal, cache: "force-cache" });
   if (!response.ok) throw new Error("Frame unavailable");
   const bitmap = await createImageBitmap(await response.blob(), { resizeWidth: 1440, resizeQuality: "medium" });
   if (stopped || controller.signal.aborted) { bitmap.close(); return; }
   maxCached = Math.max(2, Math.min(6, Math.floor(24 * 1024 * 1024 / (bitmap.width * bitmap.height * 4))));
   cache.set(index, bitmap); failures = 0;
   if (index === desired || lastDrawn === -1) draw(index);
   prune();
  } catch {
   if (!stopped && !controller.signal.aborted && ++failures >= 3) fail();
  } finally { pending.delete(index); pump(); }
 }
 function pump() {
  if (stopped) return;
  while (pending.size < 2 && queue.length) {
   const index = queue.shift()!;
   if (cache.has(index) || pending.has(index)) continue;
   const controller = new AbortController();
   pending.set(index, controller);
   void load(index, controller);
  }
 }
 function seek(progress: number) {
  if (stopped) return;
  desired = frameIndex(progress, count);
  if (desired !== lastDrawn) draw(desired);
  queue = [desired, desired + 1, desired - 1, desired + 2, desired - 2].filter((index) => index >= 0 && index < count && !cache.has(index) && !pending.has(index));
  pump();
 }
 if (!ctx || !source.framePattern?.includes("{frame}") || count < 2) fail();
 else { resize(); seek(0); }
 return { ready, seek, destroy() { stopped = true; observer.disconnect(); release(); canvas.style.opacity = "0"; resolveReady(false); } };
}
