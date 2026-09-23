export const initialFilters = {
  search: "",
  make: "",
  model: "",
  year: "",
  mileage: "",
  minPrice: "",
  maxPrice: "",
  bodyType: "",
  fuel: "",
  transmission: "",
  sort: "relevance",
};
export type Filters = typeof initialFilters;
export type SearchVehicle = {
  make: string;
  model: string;
  version?: string;
  modelYear: number;
  mileageKm: number;
  price: number;
  bodyType?: string;
  fuel?: string;
  transmission?: string;
  featured: boolean;
};
export const normalizeSearch = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
export function filterVehicles<T extends SearchVehicle>(
  vehicles: T[],
  f: Filters,
): T[] {
  return vehicles
    .filter(
      (v) =>
        (!f.search ||
          normalizeSearch(
            `${v.make} ${v.model} ${v.version || ""} ${v.modelYear}`,
          ).includes(normalizeSearch(f.search))) &&
        (!f.make || v.make === f.make) &&
        (!f.model || v.model === f.model) &&
        (!f.year || v.modelYear === Number(f.year)) &&
        (!f.mileage || v.mileageKm <= Number(f.mileage)) &&
        (!f.minPrice || v.price >= Number(f.minPrice)) &&
        (!f.maxPrice || v.price <= Number(f.maxPrice)) &&
        (!f.bodyType || v.bodyType === f.bodyType) &&
        (!f.fuel || v.fuel === f.fuel) &&
        (!f.transmission || v.transmission === f.transmission),
    )
    .sort((a, b) =>
      f.sort === "price-asc"
        ? a.price - b.price
        : f.sort === "price-desc"
          ? b.price - a.price
          : f.sort === "mileage"
            ? a.mileageKm - b.mileageKm
            : f.sort === "newest"
              ? b.modelYear - a.modelYear
              : Number(b.featured) - Number(a.featured),
    );
}
export function readFilters(query: string): Filters {
  const p = new URLSearchParams(query);
  return Object.fromEntries(
    Object.entries(initialFilters).map(([k, v]) => [
      k,
      p.get(k === "search" ? "busca" : k) || v,
    ]),
  ) as Filters;
}
export function filtersQuery(f: Filters) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(f))
    if (v && v !== initialFilters[k as keyof Filters])
      p.set(k === "search" ? "busca" : k, v);
  return p.toString();
}
