import { MapPin } from "lucide-react";
import { dealership } from "@/lib/dealership";

export function LocationMap() {
  return (
    <div className="location-map">
      <div className="location-map-frame">
        <iframe
          src={`https://maps.google.com/maps?q=${encodeURIComponent(dealership.name + " " + dealership.address)}&z=15&output=embed`}
          title={`Mapa da ${dealership.name} — ${dealership.street}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <span className="location-map-pin" aria-hidden="true">
        <MapPin size={34} strokeWidth={1.8} fill="currentColor" />
      </span>
    </div>
  );
}
