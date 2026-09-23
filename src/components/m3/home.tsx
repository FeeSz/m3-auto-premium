import Link from "next/link";
import {
  ArrowUpRight,
  Banknote,
  CarFront,
  MapPin,
  MessageCircle,
  Phone,
  RefreshCw,
} from "lucide-react";
import { SectionHeading } from "./primitives";
import { dealership, mapsUrl } from "@/lib/dealership";
import { toVehicleView } from "@/lib/vehicles";
import { getVehicles } from "@/data/vehicles";
import { VehicleGrid } from "./vehicle-card";
import { FAQ } from "./faq";
import { HomeHero } from "./home-hero";
import { ExperienceCarousel } from "./experience-carousel";

const services = [
  {
    number: "01",
    icon: CarFront,
    title: "Curadoria para o seu próximo veículo",
    copy: "Compare fotos, versões e valores do estoque publicado e escolha o que merece ser visto de perto.",
    href: "/estoque",
    label: "Explorar estoque",
  },
  {
    number: "02",
    icon: RefreshCw,
    title: "Venda, troca ou consignação",
    copy: "Converse diretamente com a equipe sobre avaliação e entenda as condições antes de decidir.",
    href: "/venda-seu-carro",
    label: "Avaliar meu veículo",
  },
  {
    number: "03",
    icon: Banknote,
    title: "Financiamento sob medida",
    copy: "Consulte as possibilidades para o veículo escolhido, sempre sujeitas à análise de crédito.",
    href: "/financiamento",
    label: "Consultar condições",
  },
] as const;

export function Services() {
  return (
    <section className="container m3-services-premium">
      <ExperienceCarousel />
      <div className="services-intro" hidden>
        <p className="eyebrow">EXPERIÊNCIA M3</p>
        <h2>Do primeiro olhar à próxima conquista.</h2>
        <p>
          Uma jornada direta, com informação clara e atendimento próximo em cada
          decisão.
        </p>
      </div>
      <div className="services-cards">
        {services.map(({ number, icon: Icon, title, copy, href, label }) => (
          <article key={number} className="service-card-premium">
            <div className="service-card-top">
              <span>{number}</span>
              <Icon size={22} strokeWidth={1.6} aria-hidden="true" />
            </div>
            <div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
            <Link href={href}>
              {label} <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export async function Home() {
  const vehicles = (await getVehicles()).map(toVehicleView);
  return (
    <>
      <HomeHero />
      <div className="section-stack">
        <section className="container featured-section">
          <SectionHeading
            eyebrow="ESTOQUE M3"
            title="Encontre o que faz sentido para você."
            description="Consulte os anúncios e fale com a loja para confirmar disponibilidade e condições."
            href="/estoque"
          />
          <VehicleGrid
            vehicles={vehicles.filter((vehicle) => vehicle.featured)}
          />
        </section>
        <Services />
        <section className="m3-location">
          <div className="location-content">
            <p className="eyebrow">VISITE A M3</p>
            <h2>Seu próximo veículo está mais perto.</h2>
            <p className="location-lead">
              Veja cada detalhe pessoalmente e converse com quem entende o seu
              momento.
            </p>
            <div className="location-cards">
              <a href={mapsUrl} target="_blank" rel="noreferrer">
                <span>
                  <strong>M3 Auto Premium</strong>
                  {dealership.street}
                  <br />
                  {dealership.neighborhood}, {dealership.city}/
                  {dealership.state}
                </span>
                <MapPin size={21} aria-hidden="true" />
              </a>
              <a href={dealership.phoneHref}>
                <span>
                  <strong>{dealership.phone}</strong>Fale com a equipe
                </span>
                <Phone size={21} aria-hidden="true" />
              </a>
              <a
                href={`https://wa.me/${dealership.whatsapp}`}
                target="_blank"
                rel="noreferrer"
              >
                <span>
                  <strong>WhatsApp M3</strong>Inicie uma conversa
                </span>
                <MessageCircle size={21} aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="location-map">
            <div className="location-map-frame">
              <iframe
                src="https://maps.google.com/maps?q=M3+Auto+Premium,+Rua+Manoel+de+Castilho,+404,+Itaim+Paulista,+S%C3%A3o+Paulo%2FSP&z=15&output=embed"
                title="Mapa da M3 Auto Premium — Rua Manoel de Castilho, 404"
                referrerPolicy="no-referrer-when-downgrade"
                tabIndex={-1}
                aria-hidden="true"
              />
            </div>
            <span className="location-map-pin" aria-hidden="true">
              <MapPin size={34} strokeWidth={1.8} fill="currentColor" />
            </span>
          </div>
        </section>
        <FAQ />
      </div>
    </>
  );
}
