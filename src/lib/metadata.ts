import type { Metadata } from "next";
import { dealership } from "./dealership";
export function pageMetadata(
  title: string,
  description: string,
  path: string,
  image = "/opengraph-image",
): Metadata {
  return {
    title: `${title} | M3 Auto Premium`,
    description,
    ...(dealership.siteUrl ? { alternates: { canonical: path } } : {}),
    openGraph: {
      title: `${title} | M3 Auto Premium`,
      description,
      type: "website",
      locale: "pt_BR",
      images: [{ url: image }],
      ...(dealership.siteUrl ? { url: path } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
