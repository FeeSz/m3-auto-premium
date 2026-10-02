"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Check, Pencil } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { whatsappUrl } from "@/lib/dealership";
import {
  calculateFinancing,
  DEFAULT_ENTRY_PERCENT,
  DEFAULT_MONTHLY_RATE,
  entryPercentFromValues,
  entryFromPercent,
  FINANCE_TERMS,
  matchingEntryPreset,
} from "@/lib/finance-simulator";
import { money } from "@/lib/vehicle-format";

type FinanceVehicleOption = {
  slug: string;
  label: string;
  price: number;
  modelYear: number;
  mileageKm: number;
};
const entryPresets = [20, 30, 40, 50] as const;

const formatInteger = (value: number) =>
  value
    ? new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(value)
    : "";

const parseCurrencyInput = (value: string) => Number(value.replace(/\D/g, ""));

const parseRateInput = (value: string) => {
  const normalized = value.replace(/[^\d,]/g, "").replace(",", ".");
  return Math.min(9.99, Math.max(0, Number(normalized) || 0));
};

export function FinanceSimulator({
  vehicles,
}: {
  vehicles: readonly FinanceVehicleOption[];
}) {
  const [selectedSlug, setSelectedSlug] = useState("");
  const [price, setPrice] = useState(0);
  const [entry, setEntry] = useState(0);
  const [months, setMonths] = useState<number>(48);
  const [monthlyRate, setMonthlyRate] = useState(DEFAULT_MONTHLY_RATE);
  const [editingValues, setEditingValues] = useState(false);
  const [rateInput, setRateInput] = useState(
    DEFAULT_MONTHLY_RATE.toFixed(2).replace(".", ","),
  );

  const selectedVehicle = vehicles.find(
    (vehicle) => vehicle.slug === selectedSlug,
  );
  const entryPercent = entryPercentFromValues(price, entry);
  const activeEntryPreset = matchingEntryPreset(entryPercent, entryPresets);
  const result = useMemo(
    () => calculateFinancing({ price, entry, months, monthlyRate }),
    [entry, monthlyRate, months, price],
  );
  const hasFullEntry = price > 0 && entry >= price;
  const canCalculate = price > 0 && entry >= 0 && !hasFullEntry;

  const selectVehicle = (slug: string) => {
    const vehicle = vehicles.find((item) => item.slug === slug);
    const nextPrice = vehicle?.price ?? 0;
    setSelectedSlug(slug);
    setPrice(nextPrice);
    setEntry(Math.round(entryFromPercent(nextPrice, DEFAULT_ENTRY_PERCENT)));
    setEditingValues(false);
  };

  const scenarioMessage = selectedVehicle
    ? `Olá! Simulei o ${selectedVehicle.label} no site da M3 com ${money(entry)} de entrada e prazo de ${months} meses. A parcela indicativa foi de ${money(result.installment)}. Gostaria de entender as possibilidades de análise com as instituições financeiras.`
    : "Olá! Fiz uma simulação indicativa no site da M3 e gostaria de entender as possibilidades de financiamento.";

  return (
    <div className="finance-simulator finance-simulator--editorial">
      <div className="finance-simulator-config">
        <div className="finance-control finance-control--vehicle">
          <label id="finance-vehicle-label">Veículo do estoque</label>
          <Select value={selectedSlug} onValueChange={selectVehicle}>
            <SelectTrigger aria-labelledby="finance-vehicle-label">
              <SelectValue placeholder="Selecione um veículo" />
            </SelectTrigger>
            <SelectContent>
              {vehicles.map((vehicle) => (
                <SelectItem key={vehicle.slug} value={vehicle.slug}>
                  <span>{vehicle.label}</span>
                  <small>{money(vehicle.price)}</small>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="finance-edit-action">
          <button
            type="button"
            aria-pressed={editingValues}
            onClick={() => setEditingValues((editing) => !editing)}
          >
            {editingValues ? (
              <Check size={15} aria-hidden="true" />
            ) : (
              <Pencil size={14} aria-hidden="true" />
            )}
            <span>{editingValues ? "Concluir" : "Editar valores"}</span>
          </button>
        </div>

        <div className="finance-values">
          <div>
            <span>Valor do veículo</span>
            <strong>{price ? money(price) : "—"}</strong>
            <small>Preço anunciado no estoque</small>
          </div>
          <label>
            <span>Valor de entrada</span>
            <span className="finance-currency-input">
              <i>R$</i>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={formatInteger(entry)}
                disabled={!price || !editingValues}
                placeholder="0"
                aria-label="Valor da entrada"
                onChange={(event) =>
                  setEntry(parseCurrencyInput(event.currentTarget.value))
                }
              />
            </span>
            <small>
              {!price
                ? "Selecione o veículo"
                : hasFullEntry
                  ? "Sem necessidade de financiamento"
                  : activeEntryPreset === null
                    ? "Valor personalizado"
                    : `${activeEntryPreset}% do valor do veículo`}
            </small>
          </label>
        </div>

        <div className="finance-choice-row">
          <div>
            <strong>Entrada</strong>
            <small>20% é a referência inicial</small>
          </div>
          <div
            className="finance-choice-group"
            aria-label="Percentual de entrada"
          >
            {entryPresets.map((percent) => (
              <button
                key={percent}
                type="button"
                disabled={!price}
                aria-pressed={activeEntryPreset === percent}
                onClick={() =>
                  setEntry(Math.round(entryFromPercent(price, percent)))
                }
              >
                {percent}%
              </button>
            ))}
          </div>
        </div>

        <div className="finance-choice-row">
          <div>
            <strong>Prazo</strong>
            <small>Quantidade de parcelas</small>
          </div>
          <div
            className="finance-choice-group"
            aria-label="Prazo do financiamento"
          >
            {FINANCE_TERMS.map((term) => (
              <button
                key={term}
                type="button"
                aria-pressed={months === term}
                onClick={() => setMonths(term)}
              >
                {term}x
              </button>
            ))}
          </div>
        </div>

        <label className="finance-rate-row">
          <span>
            <strong>Taxa de referência</strong>
            <small>Use a taxa informada na proposta, se já tiver uma.</small>
          </span>
          <span className="finance-rate-input">
            <input
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={rateInput}
              readOnly={!editingValues}
              aria-label="Taxa mensal de referência"
              onChange={(event) => {
                const value = event.currentTarget.value
                  .replace(".", ",")
                  .replace(/[^\d,]/g, "");
                if (!/^\d{0,1}(,\d{0,2})?$/.test(value)) return;
                setRateInput(value);
                setMonthlyRate(parseRateInput(value));
              }}
              onBlur={() =>
                setRateInput(monthlyRate.toFixed(2).replace(".", ","))
              }
            />
            <i>% a.m.</i>
          </span>
        </label>
      </div>

      <section
        className="finance-simulator-result finance-result-editorial"
        aria-live="polite"
      >
        <div className="finance-result-kicker">
          <p className="eyebrow">SEU CENÁRIO</p>
          <span>Estimativa</span>
        </div>

        {canCalculate ? (
          <>
            <p className="finance-result-vehicle">{selectedVehicle?.label}</p>
            <strong className="finance-installment">
              {money(result.installment)}
              <small>por mês</small>
            </strong>
            <p className="finance-installment-caption">
              em {months} parcelas estimadas
            </p>

            <dl className="finance-result-breakdown">
              <div>
                <dt>Entrada</dt>
                <dd>{money(entry)}</dd>
              </div>
              <div>
                <dt>Valor financiado</dt>
                <dd>{money(result.financedAmount)}</dd>
              </div>
              <div>
                <dt>Total estimado</dt>
                <dd>{money(result.purchaseTotal)}</dd>
              </div>
            </dl>
          </>
        ) : hasFullEntry ? (
          <div className="finance-result-empty">
            <strong>Sem necessidade de financiamento.</strong>
            <p>A entrada informada cobre integralmente o valor do veículo.</p>
          </div>
        ) : (
          <div className="finance-result-empty">
            <strong>Comece pelo veículo.</strong>
            <p>Ao selecionar uma opção do estoque, o cenário aparece aqui.</p>
          </div>
        )}

        <div className="finance-result-note">
          <strong>Simulação, não aprovação.</strong>
          <p>
            Não há consulta a bancos. CET, IOF, seguros, tarifas e condições
            finais dependem da análise da instituição financeira.
          </p>
        </div>

        <a
          className="finance-result-contact"
          href={whatsappUrl(scenarioMessage)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Levar este cenário para a M3</span>
          <i>
            <ArrowUpRight size={18} aria-hidden="true" />
          </i>
        </a>
        <small className="finance-result-privacy">
          Simule sem enviar dados. O contato é opcional.
        </small>
      </section>
    </div>
  );
}
