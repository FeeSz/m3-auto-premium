import { LegalPage } from "@/components/m3/legal-page";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Política de Privacidade",
  "Política de Privacidade da M3 Auto Premium: informações sobre esta versão do site.",
  "/privacidade",
);
export default function Page() {
  return <LegalPage kind="privacy" />;
}
