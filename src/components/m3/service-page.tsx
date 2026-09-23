import { BadgeCheck, Handshake, ClipboardCheck } from "lucide-react";
import { PageHero, SectionHeading, Photo, CTA } from "./primitives";
import { LeadForm } from "./lead-form";
import { FAQ } from "./faq";
import { media } from "@/lib/dealership";
export function ServicePage({ kind }: { kind: "trade" | "finance" }) {
  const trade = kind === "trade";
  const steps = trade
    ? [
        [
          "Conte sobre seu veículo",
          "Informe marca, modelo, ano e quilometragem para iniciar a conversa.",
        ],
        [
          "Agende uma avaliação",
          "Combinamos a inspeção e conferimos as informações do veículo.",
        ],
        [
          "Escolha o próximo passo",
          "Conheça a proposta para venda ou uso do veículo como parte do pagamento.",
        ],
      ]
    : [
        [
          "Conte o que você procura",
          "Compartilhe o veículo de interesse, sua entrada prevista e o prazo desejado.",
        ],
        [
          "Conheça as possibilidades",
          "A equipe orienta os próximos passos para solicitar uma proposta.",
        ],
        [
          "Avalie com tranquilidade",
          "Confira as condições, o CET e o contrato antes de decidir.",
        ],
      ];
  const benefits = trade
    ? [
        [
          "Avaliação cuidadosa",
          "Conservação, histórico e características do veículo entram na análise.",
        ],
        [
          "Conversa transparente",
          "Entenda o que é considerado na avaliação e tire suas dúvidas.",
        ],
        [
          "Venda por consignação",
          "Converse sobre anunciar seu veículo com a M3 e confira as condições da consignação.",
        ],
        [
          "Você decide",
          "Conheça a proposta e escolha o que faz sentido para o seu momento.",
        ],
      ]
    : [
        [
          "Atendimento consultivo",
          "Uma conversa sobre seu momento e o veículo que você procura.",
        ],
        [
          "Condições claras",
          "Peça informações sobre entrada, parcelas, juros e custo total.",
        ],
        [
          "Planejamento",
          "Considere a compra e os custos de uso dentro do seu orçamento.",
        ],
        [
          "Análise individual",
          "A concessão de crédito depende da instituição financeira.",
        ],
      ];
  return (
    <>
      <PageHero
        title={
          trade
            ? "Seu veículo tem valor. Seu próximo passo também."
            : "Financiamento para o seu próximo capítulo."
        }
        description={
          trade
            ? "Converse com a M3 sobre consignação e avaliação do seu veículo. Conheça as condições e escolha como seguir."
            : "Encontre um caminho para o seu próximo veículo. Converse sobre entrada e prazo e solicite uma proposta adequada ao seu momento."
        }
        href="#formulario"
        cta={trade ? "Solicitar avaliação" : "Conversar sobre financiamento"}
      />
      <div className="section-stack">
        <section className="container steps-section reveal">
          <SectionHeading
            eyebrow={trade ? "VENDA, TROQUE, RENOVE" : "PASSO A PASSO"}
            title={
              trade
                ? "Três passos para seguir em frente."
                : "Seu próximo veículo em três etapas."
            }
            description={
              trade
                ? "Da primeira conversa à proposta, acompanhe cada etapa da avaliação."
                : "Conheça o processo e tenha as informações necessárias para decidir."
            }
          />
          <div className="steps-grid">
            {steps.map(([title, copy], i) => (
              <div className="step" key={title}>
                <span className="step-number">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="container benefits-section reveal">
          <SectionHeading
            eyebrow={trade ? "POR QUE A M3" : "FINANCIAMENTO"}
            title={
              trade
                ? "Uma nova fase para você e seu veículo."
                : "Clareza em cada escolha."
            }
            description={
              trade
                ? "Informação, atenção e uma avaliação que respeita a história do seu veículo."
                : "Mais importante que a parcela é entender a proposta completa."
            }
          />
          <div className="benefits-body">
            <div className="benefits-grid">
              {benefits.map(([title, copy], i) => (
                <div key={title}>
                  <span className="benefit-icon">
                    {i % 3 === 0 ? (
                      <BadgeCheck />
                    ) : i % 3 === 1 ? (
                      <Handshake />
                    ) : (
                      <ClipboardCheck />
                    )}
                  </span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              ))}
            </div>
            <Photo
              src={trade ? media.keys : media.financing}
              alt={
                trade
                  ? "Entrega de chaves — fotografia ilustrativa"
                  : "Chave de um veículo — fotografia ilustrativa"
              }
            />
          </div>
        </section>
        <section id="formulario" className="lead-panel">
          <div className="container lead-panel-grid">
            <div>
              <p className="eyebrow">
                {trade ? "AVALIE SEU VEÍCULO" : "FALE COM A EQUIPE"}
              </p>
              <h2>
                {trade
                  ? "Vamos descobrir o próximo passo do seu veículo?"
                  : "Vamos conversar sobre o seu financiamento?"}
              </h2>
              <p>
                {trade
                  ? "Preencha as informações e revise sua mensagem. A avaliação final depende de inspeção e análise da documentação."
                  : "Comece pelo essencial. Depois de revisar, você pode abrir uma conversa com a M3 pelo WhatsApp."}
              </p>
              <CTA href="/contato">Outras formas de contato</CTA>
            </div>
            <LeadForm kind={kind} />
          </div>
        </section>
        <FAQ />
      </div>
    </>
  );
}
