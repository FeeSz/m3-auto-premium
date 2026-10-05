import { test } from "node:test";
import assert from "node:assert/strict";
import { parseVehicle } from "../src/domain/vehicle-parser.ts";
import {
  findPublicVehicleBySlug,
  publicVehiclePaths,
  selectOpenGraphVehicle,
} from "../src/domain/vehicle-publication.ts";
import { vehicleMetadata } from "../src/lib/vehicle-seo.ts";

const vehicle = (id, extra = {}) =>
  parseVehicle({
    id,
    slug: id,
    make: "Honda",
    model: "HR-V",
    version: "EXL",
    year: 2023,
    price: 120000,
    mileage: 25000,
    coverImage: `/vehicles/${id}.webp`,
    ...extra,
  });

test("Public route lookup treats sold and missing vehicles as not found", () => {
  const available = vehicle("available");
  const sold = vehicle("sold", { status: "sold" });
  const inventory = [available, sold];

  assert.equal(
    findPublicVehicleBySlug(inventory, available.slug)?.id,
    "available",
  );
  assert.equal(findPublicVehicleBySlug(inventory, sold.slug), null);
  assert.equal(findPublicVehicleBySlug(inventory, "missing"), null);
});

test("Sitemap paths contain only public vehicle routes", () => {
  const available = vehicle("available");
  const reserved = vehicle("reserved", { status: "reserved" });
  const sold = vehicle("sold", { status: "sold" });

  assert.deepEqual(publicVehiclePaths([available, reserved, sold]), [
    "/estoque/available",
    "/estoque/reserved",
  ]);
});

test("Vehicle metadata indexes public offers and blocks sold or missing records", () => {
  const available = vehicle("available");
  const publicMetadata = vehicleMetadata(available, available.slug);
  const soldMetadata = vehicleMetadata(
    vehicle("sold", { status: "sold" }),
    "sold",
  );
  const missingMetadata = vehicleMetadata(null, "missing");

  assert.match(String(publicMetadata.title), /Honda HR-V 2023 à venda/);
  assert.equal(
    publicMetadata.openGraph?.images?.[0]?.url,
    available.coverImage,
  );
  assert.deepEqual(soldMetadata.robots, { index: false, follow: false });
  assert.deepEqual(missingMetadata.robots, { index: false, follow: false });
  assert.equal(soldMetadata.title, "Veículo indisponível");
  assert.equal(missingMetadata.title, "Veículo não encontrado");
});

test("Open Graph cover selection ignores sold offers and supports an empty fallback", () => {
  const other = vehicle("other", { model: "Fit", year: 2021 });
  const preferred = vehicle("preferred");
  const soldPreferred = vehicle("sold-preferred", { status: "sold" });

  assert.equal(
    selectOpenGraphVehicle([soldPreferred, other, preferred])?.id,
    "preferred",
  );
  assert.equal(selectOpenGraphVehicle([soldPreferred]), null);
  assert.equal(selectOpenGraphVehicle([]), null);
});
