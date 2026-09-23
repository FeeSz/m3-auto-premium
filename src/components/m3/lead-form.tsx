"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { whatsappUrl, dealership } from "@/lib/dealership";
import { prepareLead } from "@/lib/lead";
type Kind = "contact" | "trade" | "finance";
type FieldFormat = "name" | "phone" | "currency";
type FinanceVehicleOption = { label: string; price: number };

function formatFieldValue(value: string, format?: FieldFormat) {
  if (format === "phone") {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits ? `(${digits}` : "";
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (format === "currency") {
    const digits = value.replace(/\D/g, "").slice(0, 12);
    return digits ? `R$ ${Number(digits).toLocaleString("pt-BR")}` : "";
  }
  if (format === "name") {
    return value.replace(/(^|\s)(\p{L})/gu, (match) => match.toLocaleUpperCase("pt-BR"));
  }
  return value;
}

function Field({
  label,
  type = "text",
  required = true,
  placeholder,
  full = false,
  min,
  max,
  format,
}: {
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  full?: boolean;
  min?: number;
  max?: number;
  format?: FieldFormat;
}) {
  return (
    <label className={`field ${full ? "field-full" : ""}`}>
      {label}
      <input
        name={label}
        type={type}
        required={required}
        placeholder={placeholder}
        min={min}
        max={max}
        maxLength={type === "number" ? undefined : 120}
        autoComplete={
          label === "Nome"
            ? "given-name"
            : label === "Sobrenome"
              ? "family-name"
              : type === "email"
                ? "email"
                : type === "tel"
                  ? "tel"
                  : "off"
        }
        inputMode={format === "currency" || format === "phone" ? "numeric" : undefined}
        onInput={(event) => {
          if (format) event.currentTarget.value = formatFieldValue(event.currentTarget.value, format);
        }}
        {...(type === "tel"
          ? {
              title: "Informe um telefone com DDD, entre 10 e 20 caracteres.",
            }
          : {})}
      />
    </label>
  );
}
function Select({
  label,
  options,
  required = true,
}: {
  label: string;
  options: string[];
  required?: boolean;
}) {
  return (
    <label className="field">
      {label}
      <select name={label} required={required} defaultValue="">
        <option value="" disabled>
          Selecione…
        </option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
export function LeadForm({
  kind = "contact",
  financeVehicles = [],
}: {
  kind?: Kind;
  financeVehicles?: readonly FinanceVehicleOption[];
}) {
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const review = useRef<HTMLDivElement>(null);
  const title =
    kind === "trade"
      ? "Avaliação do meu veículo"
      : kind === "finance"
        ? "Conversa sobre financiamento"
        : "Contato pelo site";
  return (
    <form
      className={`lead-form lead-form-${kind}`}
      onChange={() => {
        if (draft) setDraft("");
      }}
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (!form.reportValidity()) return;
        const values = new FormData(form);
        setBusy(true);
        setError("");
        const lines = [
          `Olá, M3 Auto Premium! ${title}.`,
          ...Array.from(values.entries())
            .filter(
              ([key, value]) =>
                key !== "ciência" && key !== "website" && String(value).trim(),
            )
            .map(([key, value]) => `${key}: ${value}`),
        ];
        try {
          const result = await prepareLead(
            {
              name: String(values.get("Nome") || ""),
              phone: String(values.get("Telefone") || ""),
              email: String(values.get("E-mail") || ""),
              type:
                kind === "trade"
                  ? "trade_in"
                  : kind === "finance"
                    ? "financing"
                    : "contact",
              consent: values.has("ciência"),
              createdAt: new Date().toISOString(),
            },
            lines.join("\n"),
            String(values.get("website") || ""),
          );
          setDraft(result.draft);
          requestAnimationFrame(() => review.current?.focus());
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Não foi possível preparar a mensagem. Tente novamente.",
          );
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="sr-only" aria-hidden="true">
        <label>
          Deixe vazio
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="form-grid">
        <Field label="Nome" placeholder="Seu nome" format="name" />
        {kind === "contact" ? (
          <Select
            label="Interesse"
            options={[
              "Comprar um veículo",
              "Agendar visita ou test drive",
              "Vender ou trocar meu veículo",
              "Financiamento",
              "Outra dúvida",
            ]}
          />
        ) : (
          kind === "trade" && <Field label="Sobrenome" placeholder="Seu sobrenome" />
        )}
        <Field
          label="E-mail"
          type="email"
          placeholder="Seu e-mail"
          required={false}
        />
        <Field label="Telefone" type="tel" placeholder="(11) 99999-9999" format="phone" />
        {kind === "trade" && (
          <>
            <Field label="Marca" placeholder="Marca do veículo" />
            <Field
              label="Ano"
              type="number"
              min={1950}
              max={new Date().getFullYear() + 1}
              placeholder="Ano-modelo"
            />
            <Field label="Modelo" placeholder="Modelo do veículo" />
            <Field label="Versão" placeholder="Versão" required={false} />
            <Field
              label="Quilometragem"
              type="number"
              min={0}
              max={2000000}
              placeholder="Em km"
            />
            <Select
              label="Condição"
              options={[
                "Excelente",
                "Boa",
                "Regular",
                "Preciso de uma avaliação",
              ]}
            />
          </>
        )}
        {kind === "finance" && (
          <>
            <label className="field field-vehicle-picker">
              Veículo de interesse
              <select
                name="Veículo de interesse"
                required
                defaultValue=""
                onChange={(event) => {
                  const option = event.currentTarget.selectedOptions[0];
                  const priceField = event.currentTarget.form?.elements.namedItem("Valor do veículo (R$)");
                  if (priceField instanceof HTMLInputElement && option?.dataset.price) {
                    priceField.value = formatFieldValue(option.dataset.price, "currency");
                    priceField.dispatchEvent(new Event("input", { bubbles: true }));
                  }
                }}
              >
                <option value="" disabled>Selecione no estoque…</option>
                {financeVehicles.map((vehicle) => (
                  <option key={vehicle.label} value={vehicle.label} data-price={vehicle.price}>
                    {vehicle.label}
                  </option>
                ))}
                <option>Ainda não decidi</option>
              </select>
              <span className="field-helper">Ao selecionar, o valor anunciado é preenchido automaticamente.</span>
            </label>
            <Field
              label="Valor do veículo (R$)"
              placeholder="Valor anunciado"
              format="currency"
            />
            <Field
              label="Entrada prevista (R$)"
              placeholder="Valor de entrada"
              required={false}
              format="currency"
            />
            <Select
              label="Prazo desejado"
              options={[
                "12 meses",
                "24 meses",
                "36 meses",
                "48 meses",
                "60 meses",
                "Quero orientação",
              ]}
              required={false}
            />
          </>
        )}
        {kind !== "finance" && (
          <label className="field field-full">
            Mensagem
            <textarea
              name="Mensagem"
              placeholder="Conte como podemos ajudar"
              maxLength={1200}
              rows={kind === "contact" ? 9 : 5}
            />
          </label>
        )}
        <label className="consent field-full">
          <input type="checkbox" name="ciência" required />
          <span>
            Li a{" "}
            <Link href="/privacidade" target="_blank">
              Política de Privacidade
            </Link>{" "}
            e autorizo a M3 a usar estes dados para atender minha solicitação.
          </span>
        </label>
      </div>
      {error && <p role="alert">{error}</p>}
      <button
        type="submit"
        className="form-submit"
        disabled={busy}
        aria-busy={busy}
      >
        {busy ? "Preparando…" : kind === "finance" ? "Continuar simulação" : "Revisar e continuar"} <ArrowRight size={19} />
      </button>
      {kind === "finance" && (
        <p className="form-note">
          Simulação sem compromisso. Condições sujeitas à análise da instituição financeira.
        </p>
      )}
      {draft && (
        <div
          className="form-review"
          ref={review}
          tabIndex={-1}
          role="region"
          aria-label="Revise sua mensagem"
        >
          <p role="status">
            Mensagem preparada. Revise antes de abrir o WhatsApp.
          </p>
          <h3>Revise sua mensagem</h3>
          <pre>{draft}</pre>
          <p>
            Destino: M3 Auto Premium · {dealership.phone}. O envio será
            confirmado por você no WhatsApp.
          </p>
          <a
            className="cta"
            href={whatsappUrl(draft)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Abrir no WhatsApp</span>
            <i>
              <ArrowRight size={20} />
            </i>
          </a>
          <button
            type="button"
            className="text-button"
            onClick={() => setDraft("")}
          >
            Voltar e editar
          </button>
        </div>
      )}
    </form>
  );
}
