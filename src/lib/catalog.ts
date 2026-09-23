import type { Vehicle } from "../domain/vehicle.ts";
import {
  DEFAULT_VEHICLE_SORT,
  VEHICLE_SORT_OPTIONS,
  CATALOG_PAGE_SIZE,
  type SortKey,
} from "../config/catalog.ts";

export type CatalogVehicle = Pick<
  Vehicle,
  | "id"
  | "make"
  | "model"
  | "version"
  | "year"
  | "price"
  | "mileage"
  | "bodyType"
  | "transmission"
  | "fuel"
  | "status"
  | "listedAt"
  | "isModified"
>;
export type CatalogFilters = {
  q: string;
  make: string;
  model: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  maxMileage?: number;
  body: string;
  transmission: string;
  fuel: string;
  configuration: "all" | "original" | "modified";
  sort: SortKey;
};
export const emptyCatalogFilters = (): CatalogFilters => ({
  q: "",
  make: "",
  model: "",
  body: "",
  transmission: "",
  fuel: "",
  configuration: "all",
  sort: DEFAULT_VEHICLE_SORT,
});
export const normalizeCatalogText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
const compact = (value: string) =>
  normalizeCatalogText(value).replaceAll(" ", "");
const equal = (a: string | undefined, b: string) =>
  compact(a || "") === compact(b);
export const normalizeCatalogBody = (value: string) => {
  const normalized = normalizeCatalogText(value);
  return normalized === "seda" ? "sedan" : normalized;
};
export const isAutomatic = (value: string | undefined) =>
  ["automatico", "automatic", "cvt", "automatizado"].includes(
    compact(value || ""),
  );
export function matchesSearch(vehicle: CatalogVehicle, query: string) {
  const terms = normalizeCatalogText(query).split(" ").filter(Boolean);
  const text = compact(
    `${vehicle.make} ${vehicle.model} ${vehicle.version || ""} ${vehicle.year}`,
  );
  return terms.every((term) => text.includes(term));
}
export function applyCatalogFilters<T extends CatalogVehicle>(
  vehicles: readonly T[],
  filters: CatalogFilters,
): T[] {
  return vehicles.filter(
    (v) =>
      v.status !== "sold" &&
      matchesSearch(v, filters.q) &&
      (!filters.make || equal(v.make, filters.make)) &&
      (!filters.model || equal(v.model, filters.model)) &&
      (filters.minPrice === undefined || v.price >= filters.minPrice) &&
      (filters.maxPrice === undefined || v.price <= filters.maxPrice) &&
      (filters.minYear === undefined || v.year >= filters.minYear) &&
      (filters.maxYear === undefined || v.year <= filters.maxYear) &&
      (filters.maxMileage === undefined || v.mileage <= filters.maxMileage) &&
      (!filters.body ||
        normalizeCatalogBody(v.bodyType || "") ===
          normalizeCatalogBody(filters.body)) &&
      (!filters.transmission ||
        (filters.transmission === "automatic"
          ? isAutomatic(v.transmission)
          : equal(v.transmission, filters.transmission))) &&
      (!filters.fuel || equal(v.fuel, filters.fuel)) &&
      (filters.configuration === "all" ||
        (filters.configuration === "modified" ? v.isModified : !v.isModified)),
  );
}
const entryTime = (date: string | null) =>
  date && Number.isFinite(Date.parse(date)) ? Date.parse(date) : null;
export function sortCatalog<T extends CatalogVehicle>(
  vehicles: readonly T[],
  sort: SortKey = DEFAULT_VEHICLE_SORT,
): T[] {
  return [...vehicles].sort((a, b) => {
    switch (sort) {
      case "recommended":
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "mileage":
        return a.mileage - b.mileage;
      case "year-desc":
        return b.year - a.year;
      case "listed-desc": {
        const left = entryTime(a.listedAt),
          right = entryTime(b.listedAt);
        if (left === null) return right === null ? 0 : 1;
        if (right === null) return -1;
        return right - left;
      }
    }
  });
}
export function selectCatalog<T extends CatalogVehicle>(
  vehicles: readonly T[],
  filters: CatalogFilters,
) {
  return sortCatalog(applyCatalogFilters(vehicles, filters), filters.sort);
}
const numericKeys = [
  "minPrice",
  "maxPrice",
  "minYear",
  "maxYear",
  "maxMileage",
] as const;
function queryNumber(value: string | null, integer = false) {
  if (value === null || !/^\d+(?:\.\d+)?$/.test(value)) return undefined;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 && (!integer || Number.isInteger(n))
    ? n
    : undefined;
}
export function readCatalogQuery(query: string): CatalogFilters {
  const p = new URLSearchParams(query),
    f = emptyCatalogFilters();
  for (const key of [
    "q",
    "make",
    "model",
    "body",
    "transmission",
    "fuel",
  ] as const)
    f[key] = (p.get(key) || "").trim().slice(0, 160);
  f.q = f.q || (p.get("busca") || "").trim().slice(0, 160);
  f.body = f.body || (p.get("bodyType") || "").trim().slice(0, 160);
  f.fuel = f.fuel || (p.get("fuelType") || "").trim().slice(0, 160);
  for (const key of numericKeys)
    f[key] = queryNumber(p.get(key), key === "minYear" || key === "maxYear");
  const legacyYear = queryNumber(p.get("year"), true);
  if (legacyYear !== undefined) {
    f.minYear ??= legacyYear;
    f.maxYear ??= legacyYear;
  }
  f.maxMileage ??= queryNumber(p.get("mileage"));
  const sort = p.get("sort");
  if (VEHICLE_SORT_OPTIONS.some(([key]) => key === sort))
    f.sort = sort as SortKey;
  else if (sort === "newest") f.sort = "year-desc";
  const configuration = p.get("configuration");
  if (configuration === "original" || configuration === "modified")
    f.configuration = configuration;
  return f;
}
export function catalogQuery(filters: CatalogFilters): string {
  const p = new URLSearchParams();
  if (filters.sort !== DEFAULT_VEHICLE_SORT) p.set("sort", filters.sort);
  for (const key of [
    "q",
    "make",
    "model",
    "body",
    "transmission",
    "fuel",
  ] as const)
    if (key === "q" ? normalizeCatalogText(filters.q) : filters[key].trim())
      p.set(key, filters[key].trim());
  for (const key of numericKeys) {
    const value = filters[key];
    if (value !== undefined && Number.isFinite(value) && value >= 0)
      p.set(key, String(value));
  }
  if (filters.configuration !== "all")
    p.set("configuration", filters.configuration);
  return p.toString();
}
export function activeCatalogFilterCount(f: CatalogFilters) {
  return (
    Number(Boolean(normalizeCatalogText(f.q))) +
    Number(Boolean(f.make)) +
    Number(Boolean(f.model)) +
    Number(f.minPrice !== undefined || f.maxPrice !== undefined) +
    Number(f.minYear !== undefined || f.maxYear !== undefined) +
    Number(f.maxMileage !== undefined) +
    Number(Boolean(f.body)) +
    Number(Boolean(f.transmission)) +
    Number(Boolean(f.fuel)) +
    Number(f.configuration !== "all")
  );
}
export type QuickFilter = {
  id: string;
  label: string;
  patch: Partial<CatalogFilters>;
};
export function quickCatalogFilters(
  vehicles: readonly CatalogVehicle[],
): QuickFilter[] {
  const available = vehicles.filter((v) => v.status !== "sold"),
    chips: QuickFilter[] = [
      { id: "all", label: "Todos", patch: emptyCatalogFilters() },
    ];
  for (const cap of [50000, 70000, 100000])
    if (available.some((v) => v.price <= cap))
      chips.push({
        id: "price-" + cap,
        label: `Até R$ ${cap / 1000} mil`,
        patch: { minPrice: undefined, maxPrice: cap },
      });
  for (const [value, label] of [
    ["suv", "SUV"],
    ["sedan", "Sedan"],
    ["hatch", "Hatch"],
  ])
    if (
      available.some(
        (v) =>
          normalizeCatalogBody(v.bodyType || "") ===
          normalizeCatalogBody(value),
      )
    )
      chips.push({ id: "body-" + value, label, patch: { body: value } });
  if (available.some((v) => isAutomatic(v.transmission)))
    chips.push({
      id: "automatic",
      label: "Automático",
      patch: { transmission: "automatic" },
    });
  return chips;
}
export function catalogOptions(vehicles: readonly CatalogVehicle[], make = "") {
  const available = vehicles.filter((v) => v.status !== "sold");
  const values = (
    key: "make" | "model" | "bodyType" | "transmission" | "fuel",
    rows = available,
  ) =>
    [
      ...new Set(
        rows
          .map((v) => v[key])
          .filter((value): value is string => Boolean(value)),
      ),
    ].sort((a, b) => a.localeCompare(b, "pt-BR"));
  const varied = (list: string[]) => (list.length >= 2 ? list : []);
  const prices = available.map((v) => v.price),
    years = available.map((v) => v.year),
    mileages = available.map((v) => v.mileage);
  return {
    make: varied(values("make")),
    model: varied(
      values(
        "model",
        available.filter((v) => !make || equal(v.make, make)),
      ),
    ),
    body: varied(values("bodyType")),
    transmission: varied(values("transmission")),
    fuel: varied(values("fuel")),
    configuration:
      available.some((v) => v.isModified) &&
      available.some((v) => !v.isModified),
    price: prices.length
      ? { min: Math.min(...prices), max: Math.max(...prices) }
      : null,
    year: years.length
      ? { min: Math.min(...years), max: Math.max(...years) }
      : null,
    maxMileage: mileages.length ? Math.max(...mileages) : null,
  };
}
export function suggestedPriceCeiling(
  vehicles: readonly CatalogVehicle[],
  filters: CatalogFilters,
): number | null {
  if (
    filters.maxPrice === undefined ||
    applyCatalogFilters(vehicles, filters).length
  )
    return null;
  const broader = applyCatalogFilters(vehicles, {
    ...filters,
    maxPrice: undefined,
  }).filter((v) => v.price > filters.maxPrice!);
  return broader.length ? Math.min(...broader.map((v) => v.price)) : null;
}
export function catalogPage<T>(
  vehicles: readonly T[],
  pages = 1,
): { items: T[]; hasMore: boolean } {
  const count =
    Math.max(1, Number.isFinite(pages) ? Math.floor(pages) : 1) *
    CATALOG_PAGE_SIZE;
  return { items: vehicles.slice(0, count), hasMore: vehicles.length > count };
}
