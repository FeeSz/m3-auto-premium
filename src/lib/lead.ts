export type Lead = {
  name: string;
  phone: string;
  email?: string;
  type: "contact" | "trade_in" | "financing" | "vehicle_interest";
  vehicleId?: string;
  message?: string;
  consent: boolean;
  createdAt: string;
};
export function validateLead(lead: Lead) {
  if (lead.name.trim().length < 2) return "Informe seu nome.";
  const phone = lead.phone.replace(/\D/g, "");
  if (!/^(?:55)?\d{10,11}$/.test(phone))
    return "Informe um telefone válido com DDD.";
  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email))
    return "Confira o e-mail informado.";
  if (!lead.consent)
    return "Confirme que deseja atendimento antes de continuar.";
  return null;
}
// Adapter boundary: a future CRM can implement the same input without changing forms.
export async function prepareLead(
  lead: Lead,
  details: string,
  honeypot: string,
) {
  if (honeypot) throw Error("Não foi possível preparar a mensagem.");
  const error = validateLead(lead);
  if (error) throw Error(error);
  return { draft: details };
}
