import snapshot from "./vehicles.generated.json" with { type: "json" };
import {
  parseVehicleInventory,
  type VehicleDiagnostic,
} from "../domain/vehicle-parser.ts";
import type { Vehicle } from "../domain/vehicle.ts";
import {
  findPublicVehicleBySlug,
  isPublicVehicle,
} from "../domain/vehicle-publication.ts";
const { vehicles: normalized, diagnostics } = parseVehicleInventory(
  snapshot.vehicles,
);
if (process.env.NODE_ENV === "development")
  for (const diagnostic of diagnostics)
    console.warn(
      "[vehicle-data]",
      diagnostic.vehicleId,
      diagnostic.field,
      diagnostic.message,
    );
/** Sole inventory read boundary. No network access, side effects or shared mutable records. */
export async function getVehicles(): Promise<Vehicle[]> {
  return structuredClone(normalized);
}
export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  return (await getVehicles()).find((vehicle) => vehicle.slug === slug) ?? null;
}
export async function getPublicVehicles(): Promise<Vehicle[]> {
  return (await getVehicles()).filter(isPublicVehicle);
}
export async function getPublicVehicleBySlug(
  slug: string,
): Promise<Vehicle | null> {
  return findPublicVehicleBySlug(await getVehicles(), slug);
}
export function getVehicleDataDiagnostics(): VehicleDiagnostic[] {
  return structuredClone(diagnostics);
}
