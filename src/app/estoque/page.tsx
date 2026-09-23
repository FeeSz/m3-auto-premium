import { toVehicleView } from "@/lib/vehicles";
import { getVehicles } from "@/data/vehicles";
import { Inventory } from "@/components/m3/inventory";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Veículos à venda no Itaim Paulista",
  "Consulte o estoque da M3 Auto Premium: fotos reais, preços e detalhes. Filtre por marca, ano, preço e quilometragem.",
  "/estoque",
);
export default async function Page() {
  const vehicles = (await getVehicles()).map(toVehicleView);
  return (
    <>
      <div className="container inventory-heading">
        <p className="eyebrow">ESTOQUE M3</p>
        <h1>Seu próximo veículo está aqui.</h1>
        <p>Compare as opções. Escolha os detalhes que importam.</p>
      </div>
      <Inventory
        vehicles={vehicles.map((v) => ({
          ...v,
          images: v.images.slice(0, 1),
          gallery: [],
          features: [],
          notes: [],
        }))}
      />
    </>
  );
}
