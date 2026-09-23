import type { Metadata } from "next";
import "./m3.css";
import "./routes.css";
import "./brand.css";
import { Header } from "@/components/m3/header";
import { Footer } from "@/components/m3/footer";
import { RevealObserver } from "@/components/m3/reveal";
import { dealership } from "@/lib/dealership";
const site = process.env.NEXT_PUBLIC_SITE_URL;
export const metadata: Metadata = {
  metadataBase: new URL(site || "http://localhost:3000"),
  title: "M3 Auto Premium | Seminovos com procedência em São Paulo",
  description:
    "Conheça o estoque da M3 Auto Premium no Itaim Paulista, São Paulo. Veículos, consignação e financiamento. Fotos reais e atendimento pelo WhatsApp.",
  robots: { index: Boolean(site), follow: Boolean(site) },
  ...(site ? { alternates: { canonical: "/" } } : {}),
  openGraph: {
    title: "M3 Auto Premium",
    description: "Seu próximo veículo começa com confiança.",
    type: "website",
    locale: "pt_BR",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "M3 Auto Premium",
    description: "Seminovos com procedência em São Paulo.",
    images: ["/opengraph-image"],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <RevealObserver />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AutoDealer",
              name: dealership.name,
              telephone: dealership.phone,
              address: {
                "@type": "PostalAddress",
                streetAddress: dealership.street,
                addressLocality: dealership.city,
                addressRegion: dealership.state,
                addressCountry: "BR",
              },
              ...(site ? { url: site } : {}),
            }).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
