import { cacheLife, cacheTag } from "next/cache";
import type { Localized } from "@/lib/i18n";
import { readContent } from "./store";
import type { Category, Content } from "./types";

export type { Buyer, Category, Content, Item, Photo, Shop } from "./types";

/** Cache tag for all website content — refreshed by the admin after every save. */
export const CONTENT_TAG = "content";

/**
 * Website content for the public pages.
 * Cached until the admin saves (then updateTag(CONTENT_TAG) refreshes it).
 */
export async function getContent(): Promise<Content> {
  "use cache";
  cacheLife("max");
  cacheTag(CONTENT_TAG);
  return withFallbacks(await readContent());
}

export const findCategory = (content: Content, slug: string): Category | undefined =>
  content.categories.find((c) => c.slug === slug);

/** If only English or only Hindi is filled in, use it for both languages. */
const fill = (l: Localized | undefined): Localized => {
  const en = l?.en?.trim() ?? "";
  const hi = l?.hi?.trim() ?? "";
  return { en: en || hi, hi: hi || en };
};

function withFallbacks(content: Content): Content {
  const { shop } = content;
  return {
    shop: {
      ...shop,
      name: fill(shop.name),
      tagline: fill(shop.tagline),
      address: fill(shop.address),
      hours: fill(shop.hours),
    },
    categories: content.categories.map((c) => {
      const name = fill(c.name);
      return {
        ...c,
        name,
        description: fill(c.description),
        season: fill(c.season),
        dateLabel: c.dateLabel ? fill(c.dateLabel) : undefined,
        image: { src: c.image.src, alt: c.image.alt?.en || c.image.alt?.hi ? fill(c.image.alt) : name },
        buyers: c.buyers.map((b) => ({ ...b, name: fill(b.name) })),
        items: c.items.map((i) => ({ ...i, name: fill(i.name) })),
      };
    }),
  };
}
