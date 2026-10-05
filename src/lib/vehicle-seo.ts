import type { Metadata } from "next";
import type { Vehicle } from "../domain/vehicle.ts";
import { pageMetadata } from "./metadata.ts";
import { money, number, toVehicleView, vehicleName } from "./vehicles.ts";

export function vehicleMetadata(
  record: Vehicle | null,
  slug: string,
): Metadata {
  if (!record || record.status === "sold") {
    return {
      title: record ? "Veículo indisponível" : "Veículo não encontrado",
      robots: { index: false, follow: false },
    };
  }

  const vehicle = toVehicleView(record);
  return pageMetadata(
    `${vehicleName(vehicle)} ${vehicle.modelYear} à venda`,
    `${vehicle.version} · ${number(vehicle.mileageKm)} km · ${money(vehicle.price)}. Conheça na M3 Auto Premium, Itaim Paulista.`,
    `/estoque/${slug}`,
    vehicle.coverImage,
  );
}
