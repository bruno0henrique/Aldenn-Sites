import { test } from "node:test";
import assert from "node:assert/strict";
import { frameIndex, frameUrl, coverRect, createSequencePlayer } from "../lib/sequence-player.ts";
test("frame positions clamp and reverse; file numbering is one-based", () => {
 assert.equal(frameIndex(-1, 120), 0);
 assert.equal(frameIndex(1.2, 120), 119);
 assert.equal(frameIndex(0.5, 121), 60);
 assert.equal(frameIndex(NaN, 120), 0);
 assert.equal(frameUrl("/frames/{frame}.webp", 119), "/frames/0120.webp");
 assert.deepEqual([1, .5, 0].map(p => frameIndex(p, 121)), [120, 60, 0]);
});
test("cover fills portrait viewport while honoring focal point", () => {
 const [x, y, w, h] = coverRect(390, 770, 1536, 1024, [.72, .5]);
 assert.ok(x < 0); assert.equal(y, 0); assert.equal(h, 770); assert.ok(w >= 390);
 assert.ok(x + w >= 390);
});
test("player warms network data, bounds decoding, draws both directions, and releases frames", async () => {
 const original = { fetch: globalThis.fetch, window: globalThis.window, ResizeObserver: globalThis.ResizeObserver, createImageBitmap: globalThis.createImageBitmap };
 let inFlight = 0, peak = 0, closed = 0, decoded = 0;
 const draws = [];
 globalThis.window = { devicePixelRatio: 2 };
 globalThis.ResizeObserver = class { observe() {} disconnect() {} };
 globalThis.fetch = async (url) => { inFlight++; peak = Math.max(peak, inFlight); await new Promise(r => setTimeout(r, 3)); inFlight--; return { ok: true, blob: async () => ({ url }) }; };
 globalThis.createImageBitmap = async blob => { decoded++; return { width: 1440, height: 960, url: blob.url, close() { closed++; } }; };
 const canvas = { style: {}, width: 0, height: 0, getBoundingClientRect: () => ({ width: 1000, height: 600 }), getContext: () => ({ clearRect() {}, drawImage(bitmap) { draws.push(bitmap.url); } }) };
 const player = createSequencePlayer(canvas, { poster: "/poster.webp", framePattern: "/frames/{frame}.webp", frameCount: 100, focalPoint: [.7, .5] });
 try {
  assert.equal(await player.ready, true);
  player.seek(1); await new Promise(r => setTimeout(r, 40));
  assert.ok(draws.includes("/frames/0100.webp"));
  player.seek(0); await new Promise(r => setTimeout(r, 40));
  assert.equal(draws.at(-1), "/frames/0001.webp");
  assert.ok(peak <= 8); assert.ok(decoded < 64);
  assert.equal(canvas.width, 1440); assert.equal(canvas.height, 864);
  player.destroy(); assert.equal(canvas.style.opacity, "0"); assert.equal(closed, decoded);
 } finally { player.destroy(); Object.assign(globalThis, original); }
});
test("unavailable sequence falls back to poster", async () => {
 const original = { fetch: globalThis.fetch, window: globalThis.window, ResizeObserver: globalThis.ResizeObserver };
 globalThis.window = { devicePixelRatio: 1 };
 globalThis.ResizeObserver = class { observe() {} disconnect() {} };
 globalThis.fetch = async () => ({ ok: false });
 let fallback = 0;
 const canvas = { style: {}, getBoundingClientRect: () => ({ width: 390, height: 770 }), getContext: () => ({ clearRect() {}, drawImage() {} }) };
 const player = createSequencePlayer(canvas, { poster: "/poster.webp", framePattern: "/frames/{frame}.webp", frameCount: 100, focalPoint: [.7,.5] }, () => fallback++);
 try { assert.equal(await player.ready, false); assert.equal(fallback, 1); assert.equal(canvas.style.opacity, "0"); }
 finally { player.destroy(); Object.assign(globalThis, original); }
});
