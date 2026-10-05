import type { Vehicle, VehicleStatus } from "./vehicle.ts";

export function isPublicVehicle(vehicle: Pick<Vehicle, "status">): boolean {
  return vehicle.status !== "sold";
}

export function findPublicVehicleBySlug(
  vehicles: readonly Vehicle[],
  slug: string,
): Vehicle | null {
  return (
    vehicles.find(
      (vehicle) => vehicle.slug === slug && isPublicVehicle(vehicle),
    ) ?? null
  );
}

export function publicVehiclePaths(vehicles: readonly Vehicle[]): string[] {
  return vehicles
    .filter(isPublicVehicle)
    .map((vehicle) => `/estoque/${vehicle.slug}`);
}

export function selectOpenGraphVehicle(
  vehicles: readonly Vehicle[],
): Vehicle | null {
  const publicWithCover = vehicles.filter(
    (vehicle) => isPublicVehicle(vehicle) && vehicle.coverImage,
  );
  return (
    publicWithCover.find(
      (vehicle) => vehicle.model === "HR-V" && vehicle.year === 2023,
    ) ??
    publicWithCover[0] ??
    null
  );
}

export function vehicleOfferAvailability(status: VehicleStatus): string {
  switch (status) {
    case "available":
      return "https://schema.org/InStock";
    case "reserved":
      return "https://schema.org/LimitedAvailability";
    case "sold":
      return "https://schema.org/OutOfStock";
  }
}
