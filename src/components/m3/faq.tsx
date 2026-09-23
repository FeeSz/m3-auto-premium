"use client";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
export const faqItems = [
  [
    "Como funciona o financiamento?",
    "Converse com a M3 sobre o veículo e a entrada que você pretende oferecer. As condições dependem da análise da instituição financeira. Solicite a proposta completa e o Custo Efetivo Total antes de contratar.",
  ],
  [
    "Posso usar meu veículo como parte do pagamento?",
    "Sim, você pode solicitar uma avaliação para troca. A proposta depende da inspeção, do estado de conservação e da documentação do seu veículo.",
  ],
  [
    "Como consultar o histórico e a garantia?",
    "Peça ao atendimento as informações e os documentos disponíveis para o veículo de seu interesse. As condições de garantia devem constar na proposta e no contrato.",
  ],
  [
    "Como agendar uma visita ou test drive?",
    "Use o formulário de contato ou fale com a M3 pelo WhatsApp. Nossa equipe combina com você a data e confirma a disponibilidade do veículo.",
  ],
  [
    "Os veículos deste catálogo estão disponíveis?",
    "O site apresenta os veículos anunciados pela M3 na última atualização. Como o estoque muda, confirme disponibilidade, preço e informações com a loja antes de visitar.",
  ],
] as const;
export function FAQ({
  items = faqItems,
  eyebrow = "DÚVIDAS FREQUENTES",
  title = <>O que você<br />precisa saber.</>,
  description = "Compra, avaliação, financiamento e atendimento. Encontre aqui os próximos passos para escolher com confiança.",
}: {
  items?: readonly (readonly [string, string])[];
  eyebrow?: string;
  title?: React.ReactNode;
  description?: string;
} = {}) {
  const [active, setActive] = useState<number | null>(null);
  return (
    <section className="container faq-section reveal">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="faq-list">
        {items.map(([q, a], i) => (
          <div className={`faq-item ${active === i ? "is-open" : ""}`} key={q}>
            <h3>
              <button
                id={`faq-button-${i}`}
                aria-expanded={active === i}
                aria-controls={`faq-panel-${i}`}
                onClick={() => setActive(active === i ? null : i)}
              >
                {q}
                <span aria-hidden="true">
                  {active === i ? <Minus size={19} /> : <Plus size={19} />}
                </span>
              </button>
            </h3>
            <div
              id={`faq-panel-${i}`}
              role="region"
              aria-labelledby={`faq-button-${i}`}
              className="faq-answer"
              inert={active !== i}
            >
              <div>
                <p>{a}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
