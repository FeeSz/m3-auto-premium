import type { MetadataRoute } from "next";
import { dealership } from "@/lib/dealership";
import { getPublicVehicles } from "@/data/vehicles";
import { getArticles } from "@/lib/articles";
import { publicVehiclePaths } from "@/domain/vehicle-publication";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [vehicles, articles] = await Promise.all([
    getPublicVehicles(),
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
    ...publicVehiclePaths(vehicles),
  ].map((path) => ({
    url: new URL(path || "/", dealership.siteUrl).href,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
