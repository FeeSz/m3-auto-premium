import {
  ArrowUpRight,
  AtSign,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { LeadForm } from "@/components/m3/lead-form";
import { dealership, mapsUrl, whatsappUrl } from "@/lib/dealership";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Contato",
  "Fale com a M3 Auto Premium pelo WhatsApp, telefone ou formulário de atendimento.",
  "/contato",
);

export default function Page() {
  return (
    <main className="contact-page">
      <section
        className="container contact-layout"
        aria-labelledby="contact-title"
      >
        <div className="contact-intro">
          <div>
            <p className="eyebrow">FALE COM A M3</p>
            <h1 id="contact-title">Como podemos ajudar?</h1>
            <p className="contact-lead">
              Escolha o canal mais conveniente ou deixe sua mensagem para a
              equipe.
            </p>
          </div>

          <div className="contact-actions" aria-label="Canais de atendimento">
            <a
              className="contact-action contact-action--primary"
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={19} aria-hidden="true" />
              <span>
                <strong>WhatsApp</strong>
                <small>Converse agora com a equipe</small>
              </span>
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>

            <a className="contact-action" href={dealership.phoneHref}>
              <Phone size={18} aria-hidden="true" />
              <span>
                <strong>{dealership.phone}</strong>
                <small>Ligar para a M3</small>
              </span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>

            <a
              className="contact-action"
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MapPin size={18} aria-hidden="true" />
              <span>
                <strong>Visite a M3</strong>
                <small>{dealership.address}</small>
              </span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>

          {dealership.instagram ? (
            <a
              className="contact-instagram"
              href={dealership.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <AtSign size={16} aria-hidden="true" />
              Acompanhe a M3 no Instagram
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          ) : null}
        </div>

        <div className="contact-form-area">
          <div className="contact-form-heading">
            <p className="eyebrow">MENSAGEM</p>
            <h2>Conte o essencial.</h2>
            <p>
              A mensagem será preparada para você revisar antes de abrir o
              WhatsApp.
            </p>
          </div>
          <LeadForm />
        </div>
      </section>
    </main>
  );
}
