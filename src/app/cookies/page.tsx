import { LegalPage } from "@/components/m3/legal-page";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Política de Cookies",
  "Política de Cookies da M3 Auto Premium: informações sobre esta versão do site.",
  "/cookies",
);
export default function Page() {
  return <LegalPage kind="cookies" />;
}
