import type { SequenceSource } from "./hero-media";

export function frameIndex(progress: number, count: number) {
  return Math.round(
    Math.max(0, Math.min(1, Number.isFinite(progress) ? progress : 0)) * Math.max(0, count - 1),
  );
}

export function frameUrl(pattern: string, index: number) {
  return pattern.replace("{frame}", String(index + 1).padStart(4, "0"));
}

export function coverRect(
  width: number,
  height: number,
  imageWidth: number,
  imageHeight: number,
  focalPoint: [number, number],
) {
  const scale = Math.max(width / imageWidth, height / imageHeight);
  const w = imageWidth * scale;
  const h = imageHeight * scale;
  return [
    (width - w) * Math.max(0, Math.min(1, focalPoint[0])),
    (height - h) * Math.max(0, Math.min(1, focalPoint[1])),
    w,
    h,
  ] as const;
}

export function createSequencePlayer(
  canvas: HTMLCanvasElement,
  source: SequenceSource,
  onFailure = () => {},
) {
  const ctx = canvas.getContext("2d");
  const blobs = new Map<number, Blob>();
  const bitmaps = new Map<number, ImageBitmap>();
  const fetches = new Map<number, Promise<Blob>>();
  const decoding = new Set<number>();
  let decodeQueue: number[] = [];
  let desired = 0;
  let previousDesired = 0;
  let lastDrawn = -1;
  let stopped = false;
  let failures = 0;
  let maxBitmaps = 14;
  let resolveReady: (value: boolean) => void = () => {};
  const ready = new Promise<boolean>((resolve) => {
    resolveReady = resolve;
  });
  const count = source.frameCount ?? 0;

  function draw(index: number) {
    const bitmap = bitmaps.get(index);
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
    draw(bitmaps.has(desired) ? desired : lastDrawn);
  }

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);

  function fail() {
    if (stopped) return;
    stopped = true;
    canvas.style.opacity = "0";
    resolveReady(false);
    observer.disconnect();
    for (const bitmap of bitmaps.values()) bitmap.close();
    bitmaps.clear();
    blobs.clear();
    decodeQueue = [];
    onFailure();
  }

  async function getBlob(index: number) {
    const cached = blobs.get(index);
    if (cached) return cached;
    const active = fetches.get(index);
    if (active) return active;

    const request = fetch(frameUrl(source.framePattern!, index), { cache: "force-cache" }).then(
      async (response) => {
        if (!response.ok) throw new Error("Frame unavailable");
        const blob = await response.blob();
        if (!stopped) blobs.set(index, blob);
        return blob;
      },
    );
    fetches.set(index, request);
    try {
      return await request;
    } finally {
      fetches.delete(index);
    }
  }

  function prune() {
    const victims = [...bitmaps.keys()]
      .filter((index) => index !== lastDrawn && index !== desired)
      .sort((a, b) => Math.abs(b - desired) - Math.abs(a - desired));
    while (bitmaps.size > maxBitmaps && victims.length) {
      const index = victims.shift()!;
      bitmaps.get(index)?.close();
      bitmaps.delete(index);
    }
  }

  async function decode(index: number) {
    try {
      const blob = await getBlob(index);
      if (stopped) return;
      const bitmap = await createImageBitmap(blob);
      if (stopped) {
        bitmap.close();
        return;
      }
      maxBitmaps = Math.max(
        10,
        Math.min(20, Math.floor((72 * 1024 * 1024) / (bitmap.width * bitmap.height * 4))),
      );
      bitmaps.set(index, bitmap);
      failures = 0;
      if (index === desired || lastDrawn === -1) draw(index);
      prune();
    } catch {
      if (!stopped && ++failures >= 3) fail();
    } finally {
      decoding.delete(index);
      pump();
    }
  }

  function pump() {
    if (stopped) return;
    while (decoding.size < 4 && decodeQueue.length) {
      const index = decodeQueue.shift()!;
      if (bitmaps.has(index) || decoding.has(index)) continue;
      decoding.add(index);
      void decode(index);
    }
  }

  function prioritize(index: number, direction: number) {
    const order = [index];
    const forward = direction < 0 ? -1 : 1;
    for (let distance = 1; distance <= 14; distance += 1) {
      order.push(index + forward * distance, index - forward * distance);
    }
    decodeQueue = order.filter(
      (candidate) =>
        candidate >= 0 &&
        candidate < count &&
        !bitmaps.has(candidate) &&
        !decoding.has(candidate),
    );
    pump();
  }

  function seek(progress: number) {
    if (stopped) return;
    previousDesired = desired;
    desired = frameIndex(progress, count);
    if (bitmaps.has(desired)) draw(desired);
    prioritize(desired, Math.sign(desired - previousDesired));
  }

  async function warmFrames() {
    let next = 0;
    async function worker() {
      while (!stopped) {
        const index = next;
        next += 1;
        if (index >= count) return;
        try {
          await getBlob(index);
        } catch {
          // O carregador prioritário ainda pode solicitar novamente o quadro em uso.
        }
      }
    }
    await Promise.all(Array.from({ length: 4 }, worker));
  }

  if (!ctx || !source.framePattern?.includes("{frame}") || count < 2) {
    fail();
  } else {
    resize();
    seek(0);
    void ready.then((available) => {
      if (available && !stopped) void warmFrames();
    });
  }

  return {
    ready,
    seek,
    destroy() {
      stopped = true;
      observer.disconnect();
      for (const bitmap of bitmaps.values()) bitmap.close();
      bitmaps.clear();
      blobs.clear();
      decodeQueue = [];
      canvas.style.opacity = "0";
      resolveReady(false);
    },
  };
}
