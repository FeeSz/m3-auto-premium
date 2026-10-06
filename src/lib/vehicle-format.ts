export const money = (value: number) =>
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
export const number = formatNumber;
