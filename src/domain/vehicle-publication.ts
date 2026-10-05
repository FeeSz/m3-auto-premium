import type { Vehicle, VehicleStatus } from "./vehicle.ts";

export function isPublicVehicle(vehicle: Pick<Vehicle, "status">): boolean {
  return vehicle.status !== "sold";
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
