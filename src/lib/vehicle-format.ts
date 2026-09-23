export const formatPrice = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
const formatNumber = (value: number) =>
  new Intl.NumberFormat("pt-BR").format(value);
export const vehicleName = (v: { make: string; model: string }) =>
  `${v.make} ${v.model}`;

export const formatMileage = (value: number) => formatNumber(value) + " km";
export const formatYear = (value: number) => String(value);
// Existing call sites retain the exact same rendered output.
export const money = formatPrice;
export const number = formatNumber;
