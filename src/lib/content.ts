export const whatsapp = (
  message = "Olá! Quero conhecer os seminovos da M3 Auto Premium.",
) => `https://wa.me/5511930055771?text=${encodeURIComponent(message)}`;
export const address =
  "Rua Manoel de Castilho, 404 — Itaim Paulista, São Paulo/SP";
export const maps =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent("M3 Auto Premium " + address);
// Models supplied in the brief. These are examples, not verified active listings.
export type Vehicle = {
  brand: string;
  model: string;
  category: string;
  year?: number;
  km?: number;
  price?: number;
  photos?: { src: string; alt: string }[];
};
export const vehicles: Vehicle[] = [
  { brand: "Volkswagen", model: "Nivus", category: "SUV" },
  { brand: "Toyota", model: "Corolla", category: "Sedan" },
  { brand: "Hyundai", model: "HB20", category: "Hatch" },
  { brand: "Honda", model: "HR-V", category: "SUV" },
  { brand: "Jeep", model: "Compass", category: "SUV" },
  { brand: "Fiat", model: "Argo", category: "Hatch" },
];
// Enable only after the compressed files and posters have been supplied and checked.
export const media = {
  enabled: false,
  base: "/media",
  heroFrames: [] as string[],
};
