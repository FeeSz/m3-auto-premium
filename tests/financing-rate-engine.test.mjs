import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateReferenceRateRange,
  calculateVehicleAge,
} from "../src/lib/financing/rate-engine.ts";

test("vehicle age uses injected current year and model year", () => {
  assert.equal(calculateVehicleAge(2023, 2026), 3);
  assert.equal(calculateVehicleAge(2027, 2026), 0);
});

test("age bands return the configured placeholder base rates", () => {
  const rateFor = (modelYear) =>
    calculateReferenceRateRange({
      modelYear,
      currentYear: 2026,
      entryPercent: 20,
      months: 36,
      financedAmount: 80_000,
    }).probable;

  assert.equal(rateFor(2023), 1.8);
  assert.equal(rateFor(2022), 2.0);
  assert.equal(rateFor(2018), 2.4);
  assert.equal(rateFor(2014), 2.9);
});

test("entry and term adjustments compose into the rate range", () => {
  assert.deepEqual(
    calculateReferenceRateRange({
      modelYear: 2024,
      currentYear: 2026,
      entryPercent: 15,
      months: 48,
      financedAmount: 85_000,
    }),
    { optimistic: 1.95, probable: 2.25, conservative: 2.75 },
  );
  assert.deepEqual(
    calculateReferenceRateRange({
      modelYear: 2024,
      currentYear: 2026,
      entryPercent: 50,
      months: 36,
      financedAmount: 50_000,
    }),
    { optimistic: 1.3, probable: 1.6, conservative: 2.1 },
  );
});

