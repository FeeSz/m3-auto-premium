import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateFinancing,
  entryPercentFromValues,
  entryFromPercent,
  matchingEntryPreset,
} from "../src/lib/finance-simulator.ts";

test("20% entry is derived from the selected vehicle price", () => {
  assert.equal(entryFromPercent(100_000, 20), 20_000);
  assert.equal(entryFromPercent(68_900, 20), 13_780);
});

test("entry percentage is clamped to the vehicle price", () => {
  assert.equal(entryFromPercent(100_000, -10), 0);
  assert.equal(entryFromPercent(100_000, 120), 100_000);
});

test("financing uses the fixed-payment formula", () => {
  const result = calculateFinancing({
    price: 100_000,
    entry: 20_000,
    months: 48,
    monthlyRate: 1.99,
  });

  assert.equal(result.financedAmount, 80_000);
  assert.ok(Math.abs(result.installment - 2602.84) < 0.01);
  assert.ok(result.purchaseTotal > 100_000);
});

test("zero rate divides the financed amount without adding interest", () => {
  const result = calculateFinancing({
    price: 60_000,
    entry: 12_000,
    months: 24,
    monthlyRate: 0,
  });

  assert.equal(result.installment, 2_000);
  assert.equal(result.purchaseTotal, 60_000);
});

test("entry presets require an exact percentage within a sub 0.01 p.p. tolerance", () => {
  const presets = [20, 30, 40, 50];
  assert.equal(matchingEntryPreset(20.009, presets), 20);
  assert.equal(matchingEntryPreset(20.01, presets), null);
  assert.equal(matchingEntryPreset(19.99, presets), null);
  assert.equal(matchingEntryPreset(25, presets), null);
  assert.equal(entryPercentFromValues(100_000, 20_009), 20.009);
});

test("entry equal to or above price produces no financed amount", () => {
  assert.equal(
    calculateFinancing({
      price: 100_000,
      entry: 100_000,
      months: 48,
      monthlyRate: 2,
    }).financedAmount,
    0,
  );
  assert.equal(
    calculateFinancing({
      price: 100_000,
      entry: 120_000,
      months: 48,
      monthlyRate: 2,
    }).installment,
    0,
  );
});
