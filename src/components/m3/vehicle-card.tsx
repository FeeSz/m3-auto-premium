import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Vehicle } from "@/lib/vehicles";
import { money, number, vehicleName } from "@/lib/vehicle-format";
import { Photo } from "./primitives";
export function VehicleCard({ vehicle: v }: { vehicle: Vehicle }) {
  return (
    <Link className="vehicle-card" href={"/estoque/" + v.slug}>
      <div className="card-image">
        <Photo
          src={v.coverImage}
          alt={v.images[0]?.alt || vehicleName(v)}
          sizes="(max-width:809px) 100vw, (max-width:1199px) 50vw, 33vw"
        />
        <span className="corner-arrow" aria-hidden="true">
          <ArrowRight size={20} />
        </span>
      </div>
      <div className="vehicle-card-info">
        <h3>{vehicleName(v)}</h3>
        <p className="card-version">{v.version}</p>
        <div>
          <span>
            {v.modelYear} · {number(v.mileageKm)} km
          </span>
          <strong>{money(v.price)}</strong>
        </div>
      </div>
    </Link>
  );
}
export function VehicleGrid({ vehicles }: { vehicles: Vehicle[] }) {
  return (
    <div className="vehicle-grid">
      {vehicles.map((v) => (
        <VehicleCard key={v.id} vehicle={v} />
      ))}
    </div>
  );
}
