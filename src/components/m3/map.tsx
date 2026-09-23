"use client";
import { useState } from "react";
import { MapPin } from "lucide-react";
import { dealership, mapsUrl } from "@/lib/dealership";
export function ShowroomMap() {
  const [enabled, setEnabled] = useState(false);
  return (
    <div className="showroom-map">
      {enabled ? (
        <iframe
          title="Localização da M3 Auto Premium no Google Maps"
          src={`https://maps.google.com/maps?q=${encodeURIComponent(dealership.address)}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="map-placeholder">
          <MapPin size={40} />
          <p>{dealership.address}</p>
          <button className="cta" onClick={() => setEnabled(true)}>
            <span>Carregar Google Maps</span>
          </button>
          <small>Ao carregar, você se conecta ao Google.</small>
          <a href={mapsUrl} target="_blank" rel="noreferrer">
            Abrir rota em outra aba ↗
          </a>
        </div>
      )}
    </div>
  );
}
