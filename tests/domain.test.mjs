import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  filterVehicles,
  initialFilters,
  normalizeSearch,
  readFilters,
  filtersQuery,
} from "../src/lib/inventory-domain.ts";
import { validateLead, prepareLead } from "../src/lib/lead.ts";
import { money } from "../src/lib/vehicle-format.ts";
import { whatsappUrl } from "../src/lib/dealership.ts";
const { vehicles } = JSON.parse(
  await readFile(
    new URL("../src/data/vehicles.generated.json", import.meta.url),
  ),
);
test("Search accepts accents, hyphens, spaces, version and year", () => {
  assert.equal(normalizeSearch("H R-V"), "hrv");
  for (const search of ["HRV", "HR-V", "h r v", "EXL", "2023"])
    assert.ok(
      filterVehicles(vehicles, { ...initialFilters, search }).some(
        (v) => v.model === "HR-V" && v.modelYear === 2023,
      ),
    );
  assert.equal(
    filterVehicles(vehicles, { ...initialFilters, search: "inexistente" })
      .length,
    0,
  );
});
test("Filters intersect and sorting does not mutate source", () => {
  const first = vehicles[0];
  const filtered = filterVehicles(vehicles, {
    ...initialFilters,
    make: "Volkswagen",
    maxPrice: "150000",
    sort: "price-asc",
  });
  assert.ok(filtered.length > 0);
  assert.ok(
    filtered.every((v) => v.make === "Volkswagen" && v.price <= 150000),
  );
  assert.ok(
    filtered.every((v, i) => i === 0 || filtered[i - 1].price <= v.price),
  );
  assert.equal(vehicles[0], first);
  for (const [sort, key, sign] of [
    ["price-desc", "price", -1],
    ["mileage", "mileageKm", 1],
    ["newest", "modelYear", -1],
  ]) {
    const rows = filterVehicles(vehicles, { ...initialFilters, sort });
    assert.ok(
      rows.every((v, i) => !i || (v[key] - rows[i - 1][key]) * sign >= 0),
    );
  }
});
test("Filters survive URL roundtrip", () => {
  const f = {
    ...initialFilters,
    search: "HR-V EXL",
    make: "Honda",
    sort: "mileage",
    maxPrice: "150000",
  };
  assert.deepEqual(readFilters(filtersQuery(f)), f);
});
test("Real inventory has unique stable slugs and provenance", () => {
  assert.equal(new Set(vehicles.map((v) => v.slug)).size, vehicles.length);
  for (const v of vehicles) {
    assert.match(v.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(v.price > 0 && v.mileageKm >= 0);
    assert.equal(v.source.provider, "usadosbr");
    assert.ok(Number.isFinite(Date.parse(v.source.retrievedAt)));
    assert.ok(
      v.source.sourceUrl.includes("usadosbr.com/carros-e-utilitarios/"),
    );
    assert.ok(!v.id.startsWith("demo"));
  }
});
test("BRL and contextual WhatsApp preserve accents safely", () => {
  assert.equal(money(143900).replace(/\s/g, " "), "R$ 143.900");
  const text = "Olá! Honda HR-V EXL 2023 & disponibilidade?";
  const url = new URL(whatsappUrl(text));
  assert.equal(url.hostname, "wa.me");
  assert.equal(url.pathname, "/5511930055771");
  assert.equal(url.searchParams.get("text"), text);
});
const lead = {
  name: "Teste local",
  phone: "(11) 99999-0000",
  type: "contact",
  consent: true,
  createdAt: new Date().toISOString(),
};
test("Lead validation rejects invalid phone, email and missing consent", () => {
  assert.equal(validateLead(lead), null);
  assert.ok(validateLead({ ...lead, phone: "000" }));
  assert.ok(validateLead({ ...lead, email: "invalid" }));
  assert.ok(validateLead({ ...lead, consent: false }));
  assert.ok(validateLead({ ...lead, name: " " }));
});
test("Lead adapter prepares only a draft and rejects honeypot", async () => {
  assert.deepEqual(await prepareLead(lead, "Mensagem local", ""), {
    draft: "Mensagem local",
  });
  await assert.rejects(prepareLead(lead, "Mensagem", "bot"));
});
