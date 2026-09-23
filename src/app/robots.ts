import type { MetadataRoute } from "next";
import { dealership } from "@/lib/dealership";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      ...(dealership.siteUrl ? { allow: "/" } : { disallow: "/" }),
    },
    ...(dealership.siteUrl
      ? { sitemap: new URL("/sitemap.xml", dealership.siteUrl).href }
      : {}),
  };
}
