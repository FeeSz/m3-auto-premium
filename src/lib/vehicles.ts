import type { Vehicle as DomainVehicle, VehicleImage } from "@/domain/vehicle";
export type Vehicle = Omit<DomainVehicle, "images" | "description"> & {
  images: VehicleImage[];
  modelYear: number;
  mileageKm: number;
  gallery: string[];
  description: string;
  coverImage: string;
  demo: false;
};
/** Presentation compatibility only; this module never reads the inventory source. */
export function toVehicleView(vehicle: DomainVehicle): Vehicle {
  return {
    ...vehicle,
    images: vehicle.imageDetails,
    modelYear: vehicle.year,
    mileageKm: vehicle.mileage,
    gallery: vehicle.images,
    coverImage:
      vehicle.coverImage || vehicle.images[0] || "/brand/m3-logo.webp",
    description:
      vehicle.description ||
      vehicle.make +
        " " +
        vehicle.model +
        " " +
        vehicle.version +
        " " +
        vehicle.year +
        ". Consulte disponibilidade, documentação e condições com a M3.",
    demo: false,
  };
}
export { money, number, vehicleName } from "./vehicle-format";
