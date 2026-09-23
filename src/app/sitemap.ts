import type { MetadataRoute } from "next";
import { dealership } from "@/lib/dealership";
import { getVehicles } from "@/data/vehicles";
import { getArticles } from "@/lib/articles";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [vehicles, articles] = await Promise.all([
    getVehicles(),
    getArticles(),
  ]);
  if (!dealership.siteUrl) return [];
  return [
    "",
    "/estoque",
    "/venda-seu-carro",
    "/financiamento",
    "/sobre",
    "/contato",
    "/blog",
    "/privacidade",
    "/cookies",
    "/termos",
    ...articles.map((a) => "/blog/" + a.slug),
    ...vehicles.map((v) => "/estoque/" + v.slug),
  ].map((path) => ({
    url: new URL(path || "/", dealership.siteUrl).href,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
