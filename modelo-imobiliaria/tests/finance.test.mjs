import test from "node:test";
import assert from "node:assert/strict";
import { calculateFinancing } from "../lib/finance.ts";

test("Price matches an independently known monthly amortization", () => {
  const result = calculateFinancing({ price: 100000, downPayment: 0, months: 12, annualRate: (1.01 ** 12 - 1) * 100 });
  assert.ok(Math.abs(result.monthlyRate - 0.01) < 1e-12);
  assert.ok(Math.abs(result.payment - 8884.878867834166) < 1e-7);
  assert.ok(Math.abs(result.totalPayments - 106618.54641400999) < 1e-7);
  assert.ok(Math.abs(result.interest - 6618.546414009993) < 1e-7);
});
test("zero interest, full entry and a single installment", () => {
  assert.equal(calculateFinancing({ price: 100000, downPayment: 20000, months: 100, annualRate: 0 }).payment, 800);
  const paid = calculateFinancing({ price: 100000, downPayment: 100000, months: 420, annualRate: 10 });
  assert.equal(paid.financed, 0); assert.equal(paid.payment, 0); assert.equal(paid.interest, 0);
  const single = calculateFinancing({ price: 100000, downPayment: 0, months: 1, annualRate: (1.01 ** 12 - 1) * 100 });
  assert.ok(Math.abs(single.payment - 101000) < 1e-7);
});
test("rejects missing, non-finite and out-of-range amounts", () => {
  const standard = { price: 100000, downPayment: 30000, months: 420, annualRate: 10 };
  for (const patch of [{ price: 0 }, { price: NaN }, { downPayment: -1 }, { downPayment: 100001 }, { months: 0 }, { months: 421 }, { months: 1.5 }, { annualRate: -1 }, { annualRate: Infinity }, { annualRate: 101 }]) {
    assert.throws(() => calculateFinancing({ ...standard, ...patch }));
  }
});
test("higher entry reduces payment; larger term reduces payment and increases interest", () => {
  const standard = { price: 2950000, downPayment: 885000, months: 420, annualRate: 10 };
  const baseline = calculateFinancing(standard);
  const largerEntry = calculateFinancing({ ...standard, downPayment: 1000000 });
  const shorter = calculateFinancing({ ...standard, months: 240 });
  assert.ok(largerEntry.payment < baseline.payment);
  assert.ok(shorter.payment > baseline.payment);
  assert.ok(shorter.interest < baseline.interest);
});
