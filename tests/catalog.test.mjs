import { test } from "node:test";
import assert from "node:assert/strict";
import { getVehicles } from "../src/data/vehicles.ts";
import {
  DEFAULT_VEHICLE_SORT,
  VEHICLE_SORT_OPTIONS,
} from "../src/config/catalog.ts";
import {
  emptyCatalogFilters,
  normalizeCatalogText,
  matchesSearch,
  applyCatalogFilters,
  sortCatalog,
  selectCatalog,
  readCatalogQuery,
  catalogQuery,
  quickCatalogFilters,
  catalogOptions,
  suggestedPriceCeiling,
  catalogPage,
  activeCatalogFilterCount,
} from "../src/lib/catalog.ts";
const fixture = (id, extra = {}) => ({
  id,
  make: "Honda",
  model: "HR-V",
  version: "EXL",
  year: 2023,
  price: 90000,
  mileage: 30000,
  bodyType: "SUV",
  transmission: "Automático",
  fuel: "Flex",
  status: "available",
  listedAt: null,
  isModified: false,
  ...extra,
});
const rows = [
  fixture("a", {
    price: 70000,
    year: 2021,
    mileage: 50000,
    listedAt: "2026-09-01",
  }),
  fixture("b", {
    price: 90000,
    year: 2024,
    mileage: 10000,
    listedAt: "2026-09-20",
    isModified: true,
  }),
  fixture("c", {
    make: "Volkswagen",
    model: "Nivus",
    version: "1.0 200 TSI Highline",
    price: 80000,
    year: 2022,
    mileage: 40000,
    listedAt: "2026-09-10",
    status: "reserved",
  }),
  fixture("d", { price: 10000, status: "sold" }),
];
test("Blank normalized search is not an active filter or URL parameter", () => {
  const filters = { ...emptyCatalogFilters(), q: "  --  " };
  assert.equal(activeCatalogFilterCount(filters), 0);
  assert.equal(catalogQuery(filters), "");
  assert.equal(applyCatalogFilters(rows, filters).length, 3);
});
test("Sedan chip includes the real Portuguese Sedã category", async () => {
  const stock = await getVehicles();
  const chip = quickCatalogFilters(stock).find(
    (chip) => chip.id === "body-sedan",
  );
  assert.ok(chip);
  const selected = applyCatalogFilters(stock, {
    ...emptyCatalogFilters(),
    ...chip.patch,
  });
  assert.ok(selected.length > 0);
  assert.deepEqual(
    selected.map((v) => v.id),
    stock
      .filter((v) => v.status !== "sold" && v.bodyType === "Sedã")
      .map((v) => v.id),
  );
  assert.equal(
    applyCatalogFilters([fixture("sedan", { bodyType: "Sedan" })], {
      ...emptyCatalogFilters(),
      body: "Sedã",
    }).length,
    1,
  );
});
test("Six numeric sorts are stable, immutable and use configured fallback", () => {
  assert.equal(DEFAULT_VEHICLE_SORT, "recommended");
  assert.equal(VEHICLE_SORT_OPTIONS.length, 6);
  const source = rows.slice(0, 3),
    copy = structuredClone(source);
  for (const [sort, expected] of [
    ["recommended", ["a", "c", "b"]],
    ["price-asc", ["a", "c", "b"]],
    ["price-desc", ["b", "c", "a"]],
    ["mileage", ["b", "c", "a"]],
    ["year-desc", ["b", "c", "a"]],
    ["listed-desc", ["b", "c", "a"]],
  ])
    assert.deepEqual(
      sortCatalog(source, sort).map((v) => v.id),
      expected,
    );
  assert.deepEqual(source, copy);
  assert.deepEqual(
    sortCatalog([fixture("x"), fixture("y")]).map((v) => v.id),
    ["x", "y"],
  );
});
test("Unknown/invalid listedAt sorts after real dates without using collection date", () => {
  const result = sortCatalog(
    [
      fixture("unknown"),
      fixture("known", { listedAt: "2026-09-01" }),
      fixture("invalid", { listedAt: "invalid" }),
    ],
    "listed-desc",
  );
  assert.deepEqual(
    result.map((v) => v.id),
    ["known", "unknown", "invalid"],
  );
});
test("Inclusive price/year/km boundaries and combined filters", () => {
  const f = {
    ...emptyCatalogFilters(),
    make: "Honda",
    minPrice: 70000,
    maxPrice: 90000,
    minYear: 2021,
    maxYear: 2024,
    maxMileage: 50000,
    transmission: "automatic",
  };
  assert.deepEqual(
    applyCatalogFilters(rows, f).map((v) => v.id),
    ["a", "b"],
  );
  assert.deepEqual(
    applyCatalogFilters(rows, { ...f, minPrice: 90000, maxPrice: 90000 }).map(
      (v) => v.id,
    ),
    ["b"],
  );
  assert.deepEqual(
    applyCatalogFilters(rows, { ...f, configuration: "modified" }).map(
      (v) => v.id,
    ),
    ["b"],
  );
  assert.deepEqual(
    applyCatalogFilters(rows, { ...f, configuration: "original" }).map(
      (v) => v.id,
    ),
    ["a"],
  );
  assert.equal(
    applyCatalogFilters(rows, { ...f, minPrice: 100000, maxPrice: 10000 })
      .length,
    0,
  );
});
test("Search supports accents, hyphens, case, partials and AND terms in any order", () => {
  assert.equal(normalizeCatalogText("  HR-V   AUTOMÁTICO "), "hr v automatico");
  for (const query of ["Honda", "HR-V", "hrv", "2023", "exl hrv", "HONDA ex"])
    assert.ok(matchesSearch(fixture("x"), query), query);
  assert.ok(matchesSearch(rows[2], "nivus highline"));
  assert.ok(matchesSearch(rows[2], "HIGHLINE Volkswagen"));
  assert.ok(!matchesSearch(rows[2], "nivus exl"));
  assert.ok(matchesSearch(fixture("x", { make: "Citroën" }), "citroen"));
  assert.ok(matchesSearch(rows[0], ""));
});
test("Sold vehicles never appear, reserved vehicles remain available for inquiry", () => {
  const result = selectCatalog(rows, emptyCatalogFilters());
  assert.ok(!result.some((v) => v.id === "d"));
  assert.ok(result.some((v) => v.id === "c"));
});
test("Query roundtrip, clean default, sanitization and existing links", () => {
  const f = {
    ...emptyCatalogFilters(),
    q: "Nivus Highline",
    make: "Volkswagen",
    body: "suv",
    minPrice: 0,
    maxPrice: 90000,
    minYear: 2022,
    maxYear: 2026,
    maxMileage: 100000,
    configuration: "modified",
    sort: "price-desc",
  };
  assert.deepEqual(readCatalogQuery(catalogQuery(f)), f);
  assert.equal(catalogQuery(emptyCatalogFilters()), "");
  const invalid = readCatalogQuery(
    "sort=bad&maxPrice=Infinity&minPrice=-1&minYear=2023.5&configuration=bad",
  );
  assert.equal(invalid.sort, DEFAULT_VEHICLE_SORT);
  assert.equal(invalid.maxPrice, undefined);
  assert.equal(invalid.minPrice, undefined);
  assert.equal(invalid.minYear, undefined);
  assert.equal(invalid.configuration, "all");
  const legacy = readCatalogQuery(
    "busca=HRV&bodyType=SUV&year=2023&mileage=50000&sort=newest",
  );
  assert.equal(legacy.q, "HRV");
  assert.equal(legacy.minYear, 2023);
  assert.equal(legacy.maxYear, 2023);
  assert.equal(legacy.maxMileage, 50000);
  assert.equal(legacy.sort, "year-desc");
});
test("Chips only represent real available inventory and never introduce fictional thresholds", async () => {
  const real = await getVehicles();
  for (const chip of quickCatalogFilters(real).filter((c) => c.id !== "all"))
    assert.ok(
      applyCatalogFilters(real, { ...emptyCatalogFilters(), ...chip.patch })
        .length > 0,
      chip.id,
    );
  const limited = quickCatalogFilters([
    fixture("expensive", { price: 120000 }),
  ]);
  assert.ok(!limited.some((c) => c.id.startsWith("price-")));
  assert.ok(!limited.some((c) => c.id === "body-sedan"));
  assert.deepEqual(
    quickCatalogFilters([]).map((c) => c.id),
    ["all"],
  );
});
test("Advanced options require variety, models depend on make and limits derive from stock", () => {
  const options = catalogOptions(rows, "Honda");
  assert.deepEqual(options.model, []);
  assert.deepEqual(options.transmission, []);
  assert.deepEqual(options.price, { min: 70000, max: 90000 });
  assert.equal(options.configuration, true);
  assert.equal(catalogOptions([fixture("original")]).configuration, false);
  assert.equal(
    catalogOptions([fixture("modified", { isModified: true })]).configuration,
    false,
  );
  assert.equal(
    catalogOptions([
      fixture("1"),
      fixture("2"),
      fixture("3", { isModified: true }),
      fixture("4", { isModified: true }),
    ]).configuration,
    true,
  );
  assert.equal(catalogOptions([]).price, null);
});
test("Empty recovery offers only the next real price while retaining other filters", () => {
  const f = { ...emptyCatalogFilters(), make: "Volkswagen", maxPrice: 75000 };
  assert.equal(suggestedPriceCeiling(rows, f), 80000);
  assert.equal(suggestedPriceCeiling(rows, { ...f, make: "Missing" }), null);
  assert.equal(suggestedPriceCeiling(rows, { ...f, maxPrice: 80000 }), null);
});
test("Pagination starts at 24, preserves original and counts filter groups only", () => {
  const all = Array.from({ length: 49 }, (_, i) => i);
  assert.equal(catalogPage(all).items.length, 24);
  assert.equal(catalogPage(all).hasMore, true);
  assert.equal(catalogPage(all, 2).items.length, 48);
  assert.equal(catalogPage(all, 3).hasMore, false);
  assert.equal(all.length, 49);
  assert.equal(
    activeCatalogFilterCount({
      ...emptyCatalogFilters(),
      make: "Honda",
      minPrice: 50000,
      maxPrice: 90000,
      sort: "price-asc",
    }),
    2,
  );
});
