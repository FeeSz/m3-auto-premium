import { CTA } from "@/components/m3/primitives";
export default function NotFound() {
  return (
    <section className="container page-hero">
      <div>
        <p className="eyebrow">404 / M3 AUTO PREMIUM</p>
        <h1>Esta página tomou outro caminho.</h1>
      </div>
      <div>
        <p>Volte ao início ou explore os veículos da M3.</p>
        <br />
        <CTA href="/estoque">Ver estoque</CTA>{" "}
        <CTA href="/">Voltar ao início</CTA>
      </div>
    </section>
  );
}
