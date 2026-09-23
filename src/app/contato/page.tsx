import { MapPin, Phone } from "lucide-react";
import { LeadForm } from "@/components/m3/lead-form";
import { ShowroomMap } from "@/components/m3/map";
import { FAQ } from "@/components/m3/faq";
import { CTA } from "@/components/m3/primitives";
import { dealership, mapsUrl, whatsappUrl } from "@/lib/dealership";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Contato",
  "Fale com a M3 Auto Premium pelo WhatsApp ou visite a Rua Manoel de Castilho, 404, Itaim Paulista, São Paulo.",
  "/contato",
);
export default function Page() {
  return (
    <>
      <section className="container contact-hero">
        <div className="contact-copy">
          <div>
            <h1>Vamos conversar sobre seu próximo veículo.</h1>
            <a
              className="profile-link"
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              Veja a localização no Google Maps ↗
            </a>
          </div>
          <div>
            <p>
              A equipe da M3 está pronta para conhecer seus planos. Conte o que
              você procura e dê o próximo passo com a gente.
            </p>
            <a
              className="icon-button"
              href="#showroom"
              aria-label="Ver localização"
            >
              <MapPin size={19} />
            </a>
          </div>
        </div>
        <LeadForm />
      </section>
      <div className="section-stack">
        <section className="container showroom-section" id="showroom">
          <ShowroomMap />
          <div>
            <p className="eyebrow">VISITE A M3</p>
            <h2>Seu próximo veículo começa aqui.</h2>
            <address>{dealership.address}</address>
            <div className="showroom-contacts">
              <a href={dealership.phoneHref}>
                <Phone size={18} />
                {dealership.phone}
              </a>
              <a href={whatsappUrl()} target="_blank" rel="noreferrer">
                Conversar pelo WhatsApp ↗
              </a>
              {dealership.instagram && (
                <a href={dealership.instagram} target="_blank" rel="noreferrer">
                  Instagram ↗
                </a>
              )}
              {dealership.email && (
                <a href={"mailto:" + dealership.email}>{dealership.email}</a>
              )}
              <p>
                Horário:{" "}
                {dealership.openingHours ||
                  "consulte a equipe para agendar sua visita."}
              </p>
            </div>
            <CTA href={mapsUrl}>Traçar rota</CTA>
          </div>
        </section>
        <FAQ />
      </div>
    </>
  );
}
