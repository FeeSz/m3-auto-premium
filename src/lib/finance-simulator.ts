export const DEFAULT_ENTRY_PERCENT = 20;
export const DEFAULT_MONTHLY_RATE = 1.99;
export const FINANCE_TERMS = [12, 24, 36, 48, 60] as const;
export const ENTRY_PRESET_TOLERANCE = 0.01;

export function entryFromPercent(price: number, percent: number) {
  if (!Number.isFinite(price) || !Number.isFinite(percent)) return 0;
  return Math.max(0, Math.min(price, (price * percent) / 100));
}

export function entryPercentFromValues(price: number, entry: number) {
  if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(entry)) return 0;
  return (Math.max(0, entry) / price) * 100;
}

export function matchingEntryPreset(
  entryPercent: number,
  presets: readonly number[],
) {
  if (!Number.isFinite(entryPercent)) return null;
  return (
    presets.find(
      (preset) =>
        Math.abs(entryPercent - preset) < ENTRY_PRESET_TOLERANCE,
    ) ?? null
  );
}

export function calculateFinancing({
  price,
  entry,
  months,
  monthlyRate,
}: {
  price: number;
  entry: number;
  months: number;
  monthlyRate: number;
}) {
  const financedAmount = Math.max(0, price - entry);
  const safeMonths = Math.max(1, Math.round(months));
  const rate = Math.max(0, monthlyRate) / 100;
  const installment =
    rate === 0
      ? financedAmount / safeMonths
      : (financedAmount * rate * (1 + rate) ** safeMonths) /
        ((1 + rate) ** safeMonths - 1);

  return {
    financedAmount,
    installment,
    installmentsTotal: installment * safeMonths,
    purchaseTotal: entry + installment * safeMonths,
  };
}
