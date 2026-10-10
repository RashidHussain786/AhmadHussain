import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { categories } = await getContent();
  const paths = ["", "/about", ...categories.map((c) => `/${c.slug}`)];
  return paths.map((path) => ({
    url: `${SITE_URL}${path || "/"}`,
    alternates: {
      languages: {
        en: `${SITE_URL}${path || "/"}`,
        hi: `${SITE_URL}/hi${path}`,
      },
    },
  }));
}
