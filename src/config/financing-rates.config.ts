export type FinancingTariffPayment = "financed" | "upfront";

export type FinancingTariff = {
  label: string;
  amount: number;
  payment: FinancingTariffPayment;
};

/**
 * PLACEHOLDERS A CALIBRAR.
 *
 * Estes valores não representam oferta, aprovação ou condição oficial de
 * nenhuma instituição. A manutenção é manual, usando como referência dados
 * públicos agregados do Banco Central do Brasil.
 */
export const financingRatesConfig = {
  calibration: {
    status: "placeholder-a-calibrar",
    source:
      "Referência sugerida: taxas médias de aquisição de veículos publicadas pelo Banco Central do Brasil; calibração manual pendente.",
    updatedAt: null as string | null,
  },
  vehicleAgeBands: [
    { maxAgeYears: 3, monthlyRate: 1.8 },
    { maxAgeYears: 7, monthlyRate: 2.0 },
    { maxAgeYears: 11, monthlyRate: 2.4 },
    { maxAgeYears: null, monthlyRate: 2.9 },
  ],
  adjustments: {
    entry: {
      high: { minPercent: 50, delta: -0.2 },
      low: { belowPercent: 20, delta: 0.3 },
    },
    term: { fromMonths: 48, delta: 0.15 },
    // A regra existe no motor, mas fica neutra até valor e ajuste serem calibrados.
    lowFinancedAmount: {
      belowAmount: null as number | null,
      delta: 0,
    },
  },
  range: {
    optimisticDelta: -0.3,
    conservativeDelta: 0.5,
  },
  costs: {
    iof: {
      fixedPercent: 0.38,
      dailyPercent: 0.0082,
      maxDays: 365,
    },
    /**
     * Tarifas com payment="financed" entram no principal e são recebidas pela
     * instituição no fluxo inicial da TIR. Tarifas "upfront" são pagas à vista:
     * não aumentam o principal, mas reduzem o valor líquido recebido pelo
     * cliente no fluxo da TIR. Valores zerados são placeholders a calibrar.
     */
    tariffs: {
      contractRegistration: {
        label: "Registro de contrato e gravame",
        amount: 0,
        payment: "financed",
      },
      customerRegistration: {
        label: "Cadastro",
        amount: 0,
        payment: "upfront",
      },
      vehicleAssessment: {
        label: "Avaliação do veículo",
        amount: 0,
        payment: "upfront",
      },
    } satisfies Record<string, FinancingTariff>,
  },
} as const;

