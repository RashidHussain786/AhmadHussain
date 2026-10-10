import type { MetadataRoute } from "next";
import { SHOP } from "@/data/shop";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SHOP.siteUrl}/sitemap.xml`,
  };
}
