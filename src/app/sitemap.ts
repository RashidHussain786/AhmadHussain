import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/data/categories";
import { SHOP } from "@/data/shop";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/about", ...CATEGORIES.map((c) => `/${c.slug}`)];
  return paths.map((path) => ({
    url: `${SHOP.siteUrl}${path || "/"}`,
    alternates: {
      languages: {
        en: `${SHOP.siteUrl}${path || "/"}`,
        hi: `${SHOP.siteUrl}/hi${path}`,
      },
    },
  }));
}
