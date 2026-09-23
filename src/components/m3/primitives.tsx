export { Photo } from "./photo";
import Link from "next/link";
import { ArrowRight, Car, ShieldCheck } from "lucide-react";
import { whatsappUrl } from "@/lib/dealership";
export function CTA({
  href = whatsappUrl(),
  children = "Falar com a M3",
  light = false,
  className = "",
}: {
  href?: string;
  children?: React.ReactNode;
  light?: boolean;
  className?: string;
}) {
  const external = href.startsWith("https:");
  return (
    <Link
      className={`cta ${light ? "cta-light" : ""} ${className}`}
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span>{children}</span>
      <i aria-hidden="true">
        <ArrowRight size={20} />
      </i>
    </Link>
  );
}
export function Metric({
  value,
  label,
  second = false,
}: {
  value: string;
  label: string;
  second?: boolean;
}) {
  return (
    <div className="metric">
      <span className="metric-icon" aria-hidden="true">
        {second ? <ShieldCheck size={26} /> : <Car size={26} />}
      </span>
      <span>
        <strong>{value}</strong>
        <small>{label}</small>
      </span>
    </div>
  );
}
export function Metrics() {
  return (
    <div className="metrics">
      <Metric value="M3" label="Auto Premium" />
      <Metric value="SP" label="Itaim Paulista" second />
    </div>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  cta = "Ver estoque",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      <div className="heading-aside">
        {href && <CTA href={href}>{cta}</CTA>}
        {description && <p>{description}</p>}
      </div>
    </div>
  );
}
export function CTASection() {
  return (
    <section className="container m3-contact-strip">
      <div>
        <p className="eyebrow">VAMOS CONVERSAR</p>
        <h2>Ficou com alguma dúvida?</h2>
        <p>Consulte disponibilidade ou combine uma visita à M3.</p>
      </div>
      <CTA>Falar com a M3</CTA>
    </section>
  );
}
export function PageHero({
  title,
  description,
  href = "#conteudo",
  cta = "Saiba mais",
}: {
  title: string;
  description: string;
  href?: string;
  cta?: string;
}) {
  return (
    <section className="page-hero container">
      <h1>{title}</h1>
      <div className="page-hero-bottom">
        <div>
          <p>{description}</p>
          <CTA href={href}>{cta}</CTA>
        </div>
        <Metrics />
      </div>
    </section>
  );
}
