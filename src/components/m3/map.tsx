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

export function LocationMap() {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="location-map" data-enabled={enabled ? "true" : "false"}>
      {enabled ? (
        <>
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
        </>
      ) : (
        <div className="location-map-consent">
          <MapPin size={28} strokeWidth={1.6} aria-hidden="true" />
          <div>
            <strong>Localização da M3</strong>
            <span>{dealership.street}</span>
          </div>
          <button type="button" onClick={() => setEnabled(true)}>
            Carregar mapa
          </button>
          <small>Ao carregar, você se conecta ao Google.</small>
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
            Abrir rota em outra aba
          </a>
        </div>
      )}
    </div>
  );
}
