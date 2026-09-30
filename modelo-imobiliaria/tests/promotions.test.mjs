import test from "node:test";
import assert from "node:assert/strict";
import ts from "typescript";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../lib/promotions.ts", import.meta.url), "utf8");
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { createPromotion, restorePromotions, prioritizePromotions, boostPlans } = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
const now = 1790800000000;
test("boost plans have total prices, exact expiry and manual ending for until sold", () => {
  assert.deepEqual(boostPlans.map((item) => item.price), [49, 149, 299]);
  for (const [plan, days] of [["week", 7], ["month", 30]]) {
    const campaign = createPromotion("a", plan, now);
    assert.equal(campaign.expiresAt, now + days * 86400000);
    assert.equal(restorePromotions([campaign], ["a"], campaign.expiresAt - 1).length, 1);
    assert.equal(restorePromotions([campaign], ["a"], campaign.expiresAt).length, 0);
  }
  assert.equal(createPromotion("a", "until-sold", now).expiresAt, null);
  assert.throws(() => createPromotion("a", "free", now));
});
test("storage discards manipulated, unknown, duplicate and future campaigns", () => {
  const valid = createPromotion("a", "week", now);
  assert.deepEqual(restorePromotions([valid, valid, { ...valid, reference: "unknown" }, { ...valid, reference: "b", expiresAt: null }, { ...valid, reference: "c", startedAt: now + 100 }], ["a", "b", "c"], now), [valid]);
  assert.deepEqual(restorePromotions(null, ["a"], now), []);
});
test("only matching boosts lead results, capped at three; ordinary ordering stays intact", () => {
  const results = ["a", "b", "c", "d", "e"].map((reference) => ({ reference }));
  const campaigns = ["b", "c", "d", "e", "outside"].map((reference, index) => createPromotion(reference, "week", now - 10 + index));
  const ranked = prioritizePromotions(results, campaigns, now);
  assert.deepEqual(ranked.results.map((item) => item.reference), ["e", "d", "c", "a", "b"]);
  assert.equal(ranked.promoted.size, 3);
  assert.deepEqual(prioritizePromotions([results[0], results[1]], campaigns, now).results.map((item) => item.reference), ["b", "a"]);
  assert.deepEqual(results.map((item) => item.reference), ["a", "b", "c", "d", "e"]);
  assert.equal(prioritizePromotions(results, campaigns, now + 8 * 86400000).promoted.size, 0);
});
