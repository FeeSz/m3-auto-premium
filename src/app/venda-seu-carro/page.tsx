import { ServicePage } from "@/components/m3/service-page";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Venda ou troque seu veículo",
  "Solicite uma avaliação do seu veículo na M3 Auto Premium, no Itaim Paulista, São Paulo.",
  "/venda-seu-carro",
);
export default function Page() {
  return <ServicePage kind="trade" />;
}
