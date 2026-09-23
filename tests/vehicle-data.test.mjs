import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  parseVehicle,
  parseVehicles,
  parseVehicleNumber,
  validIso,
} from "../src/domain/vehicle-parser.ts";
import {
  getVehicles,
  getVehicleBySlug,
  getVehicleDataDiagnostics,
} from "../src/data/vehicles.ts";
import {
  addVehicle,
  editVehicle,
  changeVehiclePrice,
  markVehicleSold,
  setVehicleCuration,
  addVehicleModification,
  addVehicleImages,
  updateVehicleMileage,
} from "../src/domain/vehicle-operations.ts";
const snapshot = JSON.parse(
  await readFile(
    new URL("../src/data/vehicles.generated.json", import.meta.url),
  ),
);
const sample = {
  id: "test-car",
  slug: "test-car-2023",
  make: "Marca teste",
  model: "Modelo teste",
  year: 2023,
  price: 78900,
  mileage: 32000,
};
test("Current source remains numeric, ordered, and semantically identical", async () => {
  const rows = await getVehicles();
  assert.equal(rows.length, snapshot.vehicles.length);
  rows.forEach((row, i) => {
    const old = snapshot.vehicles[i];
    assert.equal(row.id, old.id);
    assert.equal(row.price, old.price);
    assert.equal(row.mileage, old.mileageKm);
    assert.equal(row.year, old.modelYear);
    assert.deepEqual(
      row.images,
      old.images.map((image) => image.src),
    );
    assert.deepEqual(row.imageDetails, old.images);
    assert.equal(row.coverImage, old.coverImage);
    assert.deepEqual(row.notes, old.notes);
    assert.deepEqual(row.source, old.source);
    assert.equal(typeof row.price, "number");
    assert.equal(typeof row.mileage, "number");
  });
});
test("Slug access, not found and defensive copies", async () => {
  const rows = await getVehicles(),
    first = rows[0];
  assert.deepEqual(await getVehicleBySlug(first.slug), first);
  assert.equal(await getVehicleBySlug("missing"), null);
  first.price = 1;
  first.images.push("/tampered.webp");
  const again = await getVehicles();
  assert.notEqual(again[0].price, 1);
  assert.ok(!again[0].images.includes("/tampered.webp"));
});
test("Safe defaults never invent listing date, modifications or past prices", () => {
  const diagnostics = [];
  const row = parseVehicle(sample, (d) => diagnostics.push(d));
  assert.equal(row.isModified, false);
  assert.equal(row.status, "available");
  assert.equal(row.priority, 0);
  assert.deepEqual(row.images, []);
  assert.equal(row.listedAt, null);
  assert.equal(row.priceHistory, undefined);
  assert.equal(row.modifications, undefined);
  assert.ok(diagnostics.some((d) => d.field === "listedAt"));
  assert.ok(getVehicleDataDiagnostics().some((d) => d.field === "listedAt"));
});
test("Parser converts legacy BRL/km and rejects malformed critical data", () => {
  assert.equal(parseVehicleNumber("R$ 78.900", "price"), 78900);
  assert.equal(parseVehicleNumber("78.900,50", "price"), 78900.5);
  assert.equal(parseVehicleNumber("32.000 km", "mileage"), 32000);
  for (const invalid of [NaN, Infinity, -1, "abc", "", "R$ -2"])
    assert.throws(() => parseVehicle({ ...sample, price: invalid }));
  assert.throws(() => parseVehicle({ ...sample, mileage: undefined }));
  assert.throws(() => parseVehicle({ ...sample, year: 2 }));
  assert.throws(() => parseVehicle({ ...sample, status: "whatever" }));
  assert.throws(() => parseVehicle({ ...sample, slug: "unsafe slug" }));
  assert.throws(() => parseVehicles([sample, sample]));
  assert.equal(validIso("2026-02-30"), false);
  assert.equal(validIso('2026-09-21T23:30:00-03:00'),true);
  assert.throws(()=>parseVehicle({...sample,status:{toString:()=> 'available'}}));
});
test("Provided metadata survives normalization without technical inference", () => {
  const row = parseVehicle({
    ...sample,
    status: "reserved",
    listedAt: "2026-09-01",
    priority: 85,
    isModified: true,
    modificationSummary: "Descrição fornecida pela loja",
    modifications: [
      {
        category: "exhaust",
        title: "Escape informado",
        description: "Informado pela M3",
        documented: false,
      },
    ],
    priceHistory: [{ price: 80000, date: "2026-09-01" }],
  });
  assert.equal(row.status, "reserved");
  assert.equal(row.listedAt, "2026-09-01");
  assert.equal(row.modifications[0].documented, false);
  assert.equal(row.fuel, undefined);
  assert.equal(row.transmission, undefined);
  assert.equal(row.priority, 85);
});
test("Write preparations are immutable and validate IDs/slugs", () => {
  const base = [parseVehicle(sample)];
  const added = addVehicle(base, { ...sample, id: "second", slug: "second" });
  assert.equal(base.length, 1);
  assert.equal(added.length, 2);
  assert.throws(() => addVehicle(base, sample));
  assert.throws(() => editVehicle(base, "missing", { model: "X" }));
  assert.throws(() => editVehicle(base, sample.id, { price: 1 }));
  assert.equal(
    editVehicle(base, sample.id, { color: "Cinza" })[0].color,
    "Cinza",
  );
  assert.equal(base[0].color, undefined);
});
test("Price updates append only real events and preserve history", () => {
  const base = [parseVehicle(sample)];
  const at = "2026-09-21T12:00:00Z";
  const next = changeVehiclePrice(base, sample.id, 76000, at);
  assert.deepEqual(next[0].priceHistory, [{ price: 76000, date: at }]);
  assert.equal(base[0].priceHistory, undefined);
  assert.deepEqual(changeVehiclePrice(next, sample.id, 76000, at), next);
  assert.throws(() => changeVehiclePrice(next, sample.id, 75000, "2026-09-20"));
  assert.throws(() => changeVehiclePrice(base, sample.id, -1, at));
  assert.throws(() => changeVehiclePrice(base, sample.id, 76000, "invalid"));
});
test("Sale, curation, modifications, photos and mileage operations", () => {
  const base = [parseVehicle({ ...sample, listedAt: "2026-09-01" })];
  assert.equal(
    markVehicleSold(base, sample.id, "2026-09-21")[0].status,
    "sold",
  );
  assert.throws(() => markVehicleSold(base, sample.id, "2026-08-01"));
  assert.equal(setVehicleCuration(base, sample.id, true, 90)[0].priority, 90);
  assert.throws(() => setVehicleCuration(base, sample.id, true, 101));
  assert.equal(
    addVehicleModification(base, sample.id, {
      category: "wheels",
      title: "Rodas",
      description: "Informação de teste",
    })[0].isModified,
    true,
  );
  assert.deepEqual(
    addVehicleImages(base, sample.id, ["/a.webp", "/a.webp"])[0].images,
    ["/a.webp"],
  );
  assert.throws(() =>
    addVehicleImages(base, sample.id, ["javascript:alert(1)"]),
  );
  assert.equal(updateVehicleMileage(base, sample.id, 33000)[0].mileage, 33000);
  assert.throws(() => updateVehicleMileage(base, sample.id, -1));
  assert.equal(base[0].mileage, 32000);
});
