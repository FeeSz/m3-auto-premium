import type { Vehicle, VehicleModification } from "./vehicle.ts";
import { parseVehicle, parseVehicles, validIso } from "./vehicle-parser.ts";
const timestamp = (value: string) => {
  if (!validIso(value)) throw Error("A valid event timestamp is required");
  return value;
};
function replace(
  rows: readonly Vehicle[],
  id: string,
  change: (vehicle: Vehicle) => Vehicle,
): Vehicle[] {
  let found = false;
  const next = rows.map((vehicle) => {
    if (vehicle.id !== id) return structuredClone(vehicle);
    found = true;
    return parseVehicle(change(structuredClone(vehicle)));
  });
  if (!found) throw Error(`Unknown vehicle ${id}`);
  return parseVehicles(next);
}
/** These functions return a validated next snapshot. They do not persist or expose public writes. */
export function addVehicle(
  rows: readonly Vehicle[],
  input: unknown,
): Vehicle[] {
  return parseVehicles([...structuredClone(rows), parseVehicle(input)]);
}
export type VehicleEdit = Partial<
  Omit<
    Vehicle,
    | "id"
    | "price"
    | "priceHistory"
    | "status"
    | "soldAt"
    | "images"
    | "imageDetails"
    | "isModified"
    | "modifications"
  >
>;
export function editVehicle(
  rows: readonly Vehicle[],
  id: string,
  patch: VehicleEdit,
): Vehicle[] {
  const forbidden = [
    "id",
    "price",
    "priceHistory",
    "status",
    "soldAt",
    "images",
    "imageDetails",
    "isModified",
    "modifications",
  ];
  if (Object.keys(patch).some((key) => forbidden.includes(key)))
    throw Error("Use the dedicated operation for protected fields");
  return replace(rows, id, (v) => ({ ...v, ...structuredClone(patch) }));
}
export function changeVehiclePrice(
  rows: readonly Vehicle[],
  id: string,
  price: number,
  at: string,
): Vehicle[] {
  timestamp(at);
  if (typeof price !== "number" || !Number.isFinite(price) || price <= 0)
    throw Error("Invalid price");
  return replace(rows, id, (v) => {
    if (price === v.price) return v;
    const history = v.priceHistory ?? [];
    if (history.some((point) => Date.parse(point.date) > Date.parse(at)))
      throw Error("Price update predates recorded history");
    return { ...v, price, priceHistory: [...history, { price, date: at }] };
  });
}
export function markVehicleSold(
  rows: readonly Vehicle[],
  id: string,
  at: string,
): Vehicle[] {
  timestamp(at);
  return replace(rows, id, (v) => {
    if (v.listedAt && Date.parse(at) < Date.parse(v.listedAt))
      throw Error("Sale predates listing");
    return v.status === "sold" ? v : { ...v, status: "sold", soldAt: at };
  });
}
export function setVehicleCuration(
  rows: readonly Vehicle[],
  id: string,
  featured: boolean,
  priority: number,
): Vehicle[] {
  if (typeof featured !== "boolean") throw Error("Invalid featured flag");
  return replace(rows, id, (v) => ({ ...v, featured, priority }));
}
export function addVehicleModification(
  rows: readonly Vehicle[],
  id: string,
  modification: VehicleModification,
): Vehicle[] {
  return replace(rows, id, (v) => ({
    ...v,
    isModified: true,
    modifications: [...(v.modifications ?? []), structuredClone(modification)],
  }));
}
export function addVehicleImages(
  rows: readonly Vehicle[],
  id: string,
  images: string[],
): Vehicle[] {
  if (
    images.some(
      (image) =>
        typeof image !== "string" ||
        !image.trim() ||
        !/^(?:\/(?!\/)|https:\/\/)/.test(image),
    )
  )
    throw Error("Invalid image URL");
  return replace(rows, id, (v) => ({
    ...v,
    images: [...new Set([...v.images, ...images])],
  }));
}
export function updateVehicleMileage(
  rows: readonly Vehicle[],
  id: string,
  mileage: number,
): Vehicle[] {
  if (typeof mileage !== "number" || !Number.isFinite(mileage) || mileage < 0)
    throw Error("Invalid mileage");
  return replace(rows, id, (v) => ({ ...v, mileage }));
}
/** Future authenticated server adapter; deliberately no implementation/endpoints in Block 1. */
export interface VehicleSnapshotWriter {
  save(
    vehicles: readonly Vehicle[],
    expectedRevision: string,
  ): Promise<{ revision: string }>;
}
