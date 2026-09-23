import { LegalPage } from "@/components/m3/legal-page";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Termos de Uso",
  "Termos de Uso da M3 Auto Premium: informações sobre esta versão do site.",
  "/termos",
);
export default function Page() {
  return <LegalPage kind="terms" />;
}
