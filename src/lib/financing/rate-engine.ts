import { financingRatesConfig } from "../../config/financing-rates.config.ts";

export type ReferenceRateInput = {
  modelYear: number;
  currentYear: number;
  entryPercent: number;
  months: number;
  financedAmount: number;
};

export type ReferenceRateRange = {
  optimistic: number;
  probable: number;
  conservative: number;
};

const roundRate = (value: number) =>
  Math.round((value + Number.EPSILON) * 100) / 100;

export function calculateVehicleAge(modelYear: number, currentYear: number) {
  if (!Number.isInteger(modelYear) || !Number.isInteger(currentYear))
    throw new TypeError("modelYear and currentYear must be integer years");
  if (modelYear < 1886 || currentYear < 1886)
    throw new RangeError("modelYear and currentYear must be valid years");
  return Math.max(0, currentYear - modelYear);
}

export function calculateReferenceRateRange({
  modelYear,
  currentYear,
  entryPercent,
  months,
  financedAmount,
}: ReferenceRateInput): ReferenceRateRange {
  const age = calculateVehicleAge(modelYear, currentYear);
  const safeEntryPercent = Number.isFinite(entryPercent)
    ? Math.max(0, entryPercent)
    : 0;
  const safeMonths = Number.isFinite(months) ? Math.max(1, months) : 1;
  const safeFinancedAmount = Number.isFinite(financedAmount)
    ? Math.max(0, financedAmount)
    : 0;

  const ageBand = financingRatesConfig.vehicleAgeBands.find(
    (band) => band.maxAgeYears === null || age <= band.maxAgeYears,
  );
  if (!ageBand) throw new Error("Financing age bands are incomplete");

  let probable: number = ageBand.monthlyRate;
  const { entry, term, lowFinancedAmount } =
    financingRatesConfig.adjustments;

  if (safeEntryPercent >= entry.high.minPercent)
    probable += entry.high.delta;
  else if (safeEntryPercent < entry.low.belowPercent)
    probable += entry.low.delta;

  if (safeMonths >= term.fromMonths) probable += term.delta;
  if (
    lowFinancedAmount.belowAmount !== null &&
    safeFinancedAmount < lowFinancedAmount.belowAmount
  )
    probable += lowFinancedAmount.delta;

  probable = Math.max(0, roundRate(probable));
  return {
    optimistic: Math.max(
      0,
      roundRate(probable + financingRatesConfig.range.optimisticDelta),
    ),
    probable,
    conservative: Math.max(
      0,
      roundRate(probable + financingRatesConfig.range.conservativeDelta),
    ),
  };
}

