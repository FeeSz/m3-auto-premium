export const VEHICLE_SORT_OPTIONS = [
  ["recommended", "Recomendados"],
  ["price-asc", "Preço: menor para maior"],
  ["price-desc", "Preço: maior para menor"],
  ["mileage", "Menor quilometragem"],
  ["year-desc", "Mais novos"],
  ["listed-desc", "Mais recentes no estoque"],
] as const;
export type SortKey = (typeof VEHICLE_SORT_OPTIONS)[number][0];
// Block 3 will provide recommendation scores. Until then use ascending price.
export const DEFAULT_VEHICLE_SORT: SortKey = "recommended";
export const CATALOG_PAGE_SIZE = 24;
export const SEARCH_DEBOUNCE_MS = 300;
