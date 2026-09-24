import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageCircle, Phone } from "lucide-react";
import { toVehicleView, vehicleName, money, number } from "@/lib/vehicles";
import { getVehicles, getVehicleBySlug } from "@/data/vehicles";
import { whatsappUrl, dealership } from "@/lib/dealership";
import { pageMetadata } from "@/lib/metadata";
import { CTA, Photo, SectionHeading } from "@/components/m3/primitives";
import { VehicleGallery } from "@/components/m3/vehicle-gallery";
import { VehicleGrid } from "@/components/m3/vehicle-card";
export const generateStaticParams = async () =>
  (await getVehicles()).map((v) => ({ slug: v.slug }));
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const record = await getVehicleBySlug(slug);
  const v = record ? toVehicleView(record) : null;
  return v
    ? pageMetadata(
        vehicleName(v) + " " + v.modelYear + " à venda",
        v.version +
          " · " +
          number(v.mileageKm) +
          " km · " +
          money(v.price) +
          ". Conheça na M3 Auto Premium, Itaim Paulista.",
        "/estoque/" + slug,
        v.coverImage,
      )
    : { title: "Veículo não encontrado" };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const record = await getVehicleBySlug(slug);
  const v = record ? toVehicleView(record) : null;
  if (!v) notFound();
  const vehicles = (await getVehicles()).map(toVehicleView);
  const name = vehicleName(v);
  const galleryImages = [
    v.coverImage,
    ...v.gallery.filter((image) => image !== v.coverImage),
  ];
  const mobileInterestUrl = whatsappUrl(
    `Tenho interesse no ${name} ${v.version} ${v.modelYear} anunciado pela M3 Auto Premium.`,
  );
  const specs = [
    {
      label: "Ano fabricação/modelo",
      value: v.manufactureYear + "/" + v.modelYear,
    },
    {
      label: "Quilometragem",
      value: number(v.mileageKm) + " km",
    },
    { label: "Marca", value: v.make },
    { label: "Modelo", value: v.model },
    { label: "Versão", value: v.version },
    { label: "Categoria", value: v.bodyType },
    { label: "Combustível", value: v.fuel },
    { label: "Câmbio", value: v.transmission },
    { label: "Cor", value: v.color },
  ].filter((spec) => spec.value);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: name + " " + v.version + " " + v.modelYear,
    brand: { "@type": "Brand", name: v.make },
    model: v.model,
    vehicleModelDate: String(v.modelYear),
    image: v.images.map((i) => i.src),
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: v.mileageKm,
      unitCode: "KMT",
    },
    offers: {
      "@type": "Offer",
      price: v.price,
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
      seller: { "@type": "AutoDealer", name: dealership.name },
      ...(dealership.siteUrl
        ? { url: dealership.siteUrl + "/estoque/" + v.slug }
        : {}),
    },
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\u003c"),
        }}
      />
      <section className="container vehicle-intro">
        <div className="vehicle-intro-copy">
          <p className="eyebrow">
            <Link href="/estoque">Estoque</Link> / {v.make}
          </p>
          <h1>{name}</h1>
          <p>
            {v.version} · {v.modelYear} · {number(v.mileageKm)} km
          </p>
          <div className="vehicle-price-row">
            <h2>{money(v.price)}</h2>
          </div>
          <p>Anunciado no estoque · consulte disponibilidade</p>
          <CTA
            className="vehicle-interest-cta"
            href={whatsappUrl(
              "Olá! Tenho interesse no " +
                name +
                " " +
                v.version +
                " " +
                v.modelYear +
                " anunciado no site da M3 Auto Premium. Gostaria de confirmar disponibilidade e saber mais.",
            )}
          >
            Tenho interesse
          </CTA>
          <CTA className="vehicle-finance-cta" href="/financiamento">
            Consultar financiamento
          </CTA>
          {v.notes.map((n) => (
            <p className="data-note" key={n}>
              {n}
            </p>
          ))}
        </div>
        <div className="vehicle-intro-image">
          {galleryImages.length > 0 ? (
            <VehicleGallery
              images={galleryImages}
              name={name}
              className="vehicle-gallery-primary"
            />
          ) : (
            <Photo src={v.coverImage} alt={v.images[0]?.alt || name} priority />
          )}
        </div>
      </section>
      <div className="section-stack">
        <section className="container vehicle-details">
          <div className="vehicle-details-content">
            <p className="eyebrow">INFORMAÇÕES DO ANÚNCIO</p>
            <h2>Conheça os detalhes.</h2>
            <div className="vehicle-information">
              <details className="vehicle-information-section" open>
                <summary>
                  <span>Especificações</span>
                  <span
                    className="vehicle-information-toggle"
                    aria-hidden="true"
                  />
                </summary>
                <dl className="vehicle-specification-list">
                  {specs.map(({ label, value }, index) => (
                    <div key={label}>
                      <span
                        className="vehicle-specification-index"
                        aria-hidden="true"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </details>

              {v.features.length > 0 && (
                <details className="vehicle-information-section">
                  <summary>
                    <span>Equipamentos</span>
                    <span
                      className="vehicle-information-toggle"
                      aria-hidden="true"
                    />
                  </summary>
                  <ul className="vehicle-feature-list">
                    {v.features.map((feature, index) => (
                      <li key={feature}>
                        <span aria-hidden="true">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <strong>{feature}</strong>
                      </li>
                    ))}
                  </ul>
                </details>
              )}

              <details className="vehicle-information-section">
                <summary>
                  <span>Descrição e procedência</span>
                  <span
                    className="vehicle-information-toggle"
                    aria-hidden="true"
                  />
                </summary>
                <div className="vehicle-description">
                  <div className="vehicle-description-copy">
                    <span>Sobre este veículo</span>
                    <p>{v.description}</p>
                  </div>
                  <aside className="vehicle-origin-note">
                    <div>
                      <span>Procedência do anúncio</span>
                      <strong>Informações verificáveis</strong>
                      <p className="inventory-disclaimer">
                        Dados publicados pela M3 Auto Premium com base no
                        anúncio de origem. Confirme disponibilidade,
                        equipamentos e documentação antes da compra.
                      </p>
                      <a
                        className="vehicle-source-link"
                        href={v.source.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Ver anúncio de origem ↗
                      </a>
                    </div>
                  </aside>
                </div>
              </details>
            </div>

            <div className="vehicle-details-action">
              <CTA href="/financiamento">Consultar financiamento</CTA>
            </div>
          </div>
        </section>
        <section className="container">
          <SectionHeading
            eyebrow="CONTINUE EXPLORANDO"
            title="Outras opções na M3."
            href="/estoque"
          />
          <VehicleGrid
            vehicles={vehicles
              .filter((x) => x.id !== v.id)
              .sort(
                (a, b) =>
                  Number(b.bodyType === v.bodyType) -
                  Number(a.bodyType === v.bodyType),
              )
              .slice(0, 3)}
          />
        </section>
      </div>
      <aside
        className="vehicle-mobile-actions"
        aria-label="AÃ§Ãµes do anÃºncio"
      >
        <Link href="/financiamento">Financiar</Link>
        <a
          href={dealership.phoneHref}
          aria-label="Ligar para a M3 Auto Premium"
        >
          <Phone size={21} aria-hidden="true" />
        </a>
        <a href={mobileInterestUrl} target="_blank" rel="noopener noreferrer">
          <MessageCircle size={19} aria-hidden="true" />
          WhatsApp
        </a>
      </aside>
    </>
  );
}
