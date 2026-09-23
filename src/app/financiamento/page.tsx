import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { CTA } from "@/components/m3/primitives";
import { LeadForm } from "@/components/m3/lead-form";
import { FAQ } from "@/components/m3/faq";
import { getVehicles } from "@/data/vehicles";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Financiamento de veículos",
  "Planeje entrada e prazo com atendimento da M3 Auto Premium. Solicite uma proposta e analise todas as condições antes de decidir.",
  "/financiamento",
);

const questions = [
  ["A aprovação do financiamento é garantida?", "Não. A aprovação, os limites e as condições dependem da análise realizada pela instituição financeira."],
  ["O que devo comparar em uma proposta?", "Considere entrada, prazo, valor das parcelas, taxa de juros, tarifas, Custo Efetivo Total e valor total da operação."],
  ["Posso incluir um veículo na troca?", "Você pode informar essa intenção no formulário. A avaliação do veículo é feita separadamente e depende de inspeção e documentação."],
  ["Quais documentos serão necessários?", "A equipe informa os documentos aplicáveis durante o atendimento, conforme a solicitação e os critérios da instituição financeira."],
] as const;

export default async function Page() {
  const financeVehicles = (await getVehicles())
    .filter((vehicle) => vehicle.status !== "sold")
    .map((vehicle) => ({
      label: `${vehicle.make} ${vehicle.model}${vehicle.version ? ` ${vehicle.version}` : ""} · ${vehicle.year}`,
      price: vehicle.price,
    }))
    .sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));

  return (
    <div className="finance-page">
      <section className="finance-hero container" aria-labelledby="finance-title">
        <div className="finance-hero-media">
          <Image src="/images/financing-showroom-bmw-pexels.jpg" alt="BMW em exposição em um showroom contemporâneo" fill priority sizes="(max-width: 809px) 100vw, 1280px" />
        </div>
        <div className="finance-hero-shade" aria-hidden="true" />
        <div className="finance-hero-content">
          <p className="eyebrow">FINANCIAMENTO M3</p>
          <h1 id="finance-title">Inicie seu financiamento direto pelo site.</h1>
          <p>Informe o veículo, a entrada e o prazo. Comece sua solicitação online, sem sair da M3.</p>
          <div className="finance-hero-actions">
            <CTA href="#simulacao">Simular agora</CTA>
            <a href="#duvidas-financiamento" className="finance-text-link">Ver dúvidas <ArrowDown size={17} aria-hidden="true" /></a>
          </div>
          <small>Simulação sem compromisso. Crédito sujeito à análise.</small>
        </div>
      </section>

      <section id="simulacao" className="finance-application reveal">
        <div className="container finance-application-grid">
          <div className="finance-application-copy">
            <p className="eyebrow">SIMULAÇÃO ONLINE</p>
            <h2>Monte sua proposta.</h2>
            <p>Preencha os dados essenciais para iniciar seu financiamento.</p>
          </div>
          <div className="finance-form-shell"><LeadForm kind="finance" financeVehicles={financeVehicles} /></div>
        </div>
      </section>

      <div id="duvidas-financiamento" className="finance-faq-wrap">
        <FAQ
          items={questions}
          eyebrow="DÚVIDAS SOBRE FINANCIAMENTO"
          title={<>Antes de avançar,<br />saiba o essencial.</>}
          description="Respostas diretas para você preencher sua simulação com segurança."
        />
      </div>
    </div>
  );
}
