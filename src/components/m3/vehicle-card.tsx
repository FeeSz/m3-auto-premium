import Link from "next/link";
import { ArrowRight, CameraOff } from "lucide-react";
import type { Vehicle } from "@/lib/vehicles";
import { money, number, vehicleName } from "@/lib/vehicle-format";
import { Photo } from "./primitives";
export function VehicleCard({ vehicle: v }: { vehicle: Vehicle }) {
  return (
    <Link className="vehicle-card" href={"/estoque/" + v.slug}>
      <div className="card-image">
        {v.images.length > 0 && v.coverImage !== "/brand/m3-logo.webp" ? (
          <Photo
            src={v.coverImage}
            alt={v.images[0]?.alt || vehicleName(v)}
            sizes="(max-width:809px) 100vw, (max-width:1199px) 50vw, 33vw"
          />
        ) : (
          <div className="vehicle-card-photo-empty">
            <CameraOff size={25} strokeWidth={1.5} aria-hidden="true" />
            <span>Fotos em atualização</span>
            <small>Consulte a M3</small>
          </div>
        )}
        <span className="corner-arrow" aria-hidden="true">
          <ArrowRight size={20} />
        </span>
      </div>
      <div className="vehicle-card-info">
        <div className="vehicle-card-heading">
          <h3>{vehicleName(v)}</h3>
          <p className="card-version">{v.version}</p>
        </div>
        <div className="vehicle-card-summary">
          <span className="vehicle-card-spec">
            <small>Ano · quilometragem</small>
            <span>
              {v.modelYear} · {number(v.mileageKm)} km
            </span>
          </span>
          <span className="vehicle-card-price">
            <strong>{money(v.price)}</strong>
          </span>
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
