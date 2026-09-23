import snapshot from "./vehicles.generated.json" with { type: "json" };
import {
  parseVehicles,
  type VehicleDiagnostic,
} from "../domain/vehicle-parser.ts";
import type { Vehicle } from "../domain/vehicle.ts";
const diagnostics: VehicleDiagnostic[] = [];
const normalized = parseVehicles(snapshot.vehicles, (d) => diagnostics.push(d));
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
export function getVehicleDataDiagnostics(): VehicleDiagnostic[] {
  return structuredClone(diagnostics);
}
export const inventoryRetrievedAt = snapshot.lastUpdatedAt;
