export const dealership = {
  name: "M3 Auto Premium",
  phone: "(11) 93005-5771",
  phoneHref: "tel:+5511930055771",
  whatsapp: "5511930055771",
  address: "Rua Manoel de Castilho, 404 — Itaim Paulista, São Paulo/SP",
  street: "Rua Manoel de Castilho, 404",
  neighborhood: "Itaim Paulista",
  city: "São Paulo",
  state: "SP",
  email: "",
  instagram: "https://www.instagram.com/m3_autopremium/",
  openingHours: "",
  legalName: "",
  cnpj: "",
  privacyEmail: "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "",
  demoInventory: false,
  team: [],
};
export const whatsappUrl = (
  message = "Olá! Gostaria de conversar com a M3 Auto Premium.",
) => `https://wa.me/${dealership.whatsapp}?text=${encodeURIComponent(message)}`;
export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dealership.name + " " + dealership.address)}`;
export const media = {
  hero: "/reference/QT1UEFL8QJPutAvTj9StqpyLY.webp",
  inspection: "/reference/ePT9kuMpmdFFmnCqOllNvONQys.webp",
  detailing: "/reference/WyhRtolqAtg9ZPTE92NjlKjv0.webp",
  keys: "/reference/TcgsebcRv5iSa7dvNbl6PMQECA.webp",
  financing: "/reference/DKYMPBTwzZsENhq8F0kqQLKshtw.jpg",
  experience: "/reference/QVQrGh9tqm2W6ZvQRBcTx9x4AEo.png",
  cta: "/reference/Uo8cUllDqyVPZ0KESUwPobILA.png",
  blogCar: "/reference/dEDaBu6jRucTUjCOt5t3puBWQ.webp",
  interior: "/reference/pqjYMD23nKJ7cqAxEQtMACgpNUI.png",
  wheel: "/reference/plEyu7TH68VDPzjMAXNxgPQNM.webp",
};
export const navigation = [
  ["/estoque", "Estoque"],
  ["/estoque?minYear=2025", "Novos"],
  ["/estoque?maxYear=2024", "Seminovos"],
  ["/financiamento", "Financiamento"],
  ["/estoque?configuration=modified", "Modificados"],
] as const;
