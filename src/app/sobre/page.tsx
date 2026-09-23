import { PageHero, CTA } from "@/components/m3/primitives";
import { Services } from "@/components/m3/home";
import { dealership } from "@/lib/dealership";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Sobre a M3",
  "Seminovos, venda, consignação e financiamento no Itaim Paulista, São Paulo. Conheça a M3 Auto Premium.",
  "/sobre",
);
export default function Page() {
  return (
    <>
      <PageHero
        title="A M3 está no seu caminho."
        description="No Itaim Paulista, em São Paulo, a M3 Auto Premium trabalha com venda de veículos, consignação e financiamento."
        href="/contato"
        cta="Conhecer a loja"
      />
      <div className="section-stack">
        <section className="container m3-visit">
          <div>
            <p className="eyebrow">M3 AUTO PREMIUM</p>
            <h2>
              Uma conversa direta.
              <br />
              Uma escolha informada.
            </h2>
          </div>
          <div>
            <p>
              Comprar ou vender um veículo começa com informação. Aqui você
              encontra fotos dos veículos anunciados pela M3, preços e detalhes
              para comparar suas opções.
            </p>
            <p>
              Antes de fechar negócio, confirme disponibilidade, equipamentos e
              condições com a loja. Agende uma visita em {dealership.street}.
            </p>
            <CTA href="/estoque">Conhecer os veículos</CTA>
          </div>
        </section>
        <Services />
      </div>
    </>
  );
}
