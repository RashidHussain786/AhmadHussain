import type { Localized } from "@/lib/i18n";
import type { Buyer, Category, Item, Shop } from "./types";

/** Page addresses that categories must not use. */
const RESERVED_SLUGS = new Set(["admin", "about", "hi", "en", "api", "uploads", "photos", "sitemap", "robots"]);

export class InvalidInput extends Error {}

const text = (value: unknown, max = 300) => (typeof value === "string" ? value.trim().slice(0, max) : "");

const localized = (value: unknown, max = 300): Localized => {
  const v = (value ?? {}) as Partial<Localized>;
  return { en: text(v.en, max), hi: text(v.hi, max) };
};

const hasText = (l: Localized) => Boolean(l.en || l.hi);

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

const isSlug = (s: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s) && s.length <= 60;

/** Only photos from the project, local uploads, or this site's Vercel Blob store are allowed. */
export function isAllowedPhoto(src: unknown): src is string {
  return (
    typeof src === "string" &&
    (/^\/(photos|uploads)\/[\w./-]+$/.test(src) ||
      /^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\/[\w./-]+$/.test(src))
  );
}

const randomId = () => Math.random().toString(36).slice(2, 10);

function sanitizeItems(value: unknown): Item[] {
  const list = Array.isArray(value) ? value.slice(0, 200) : [];
  const seen = new Set<string>();
  const items: Item[] = [];
  for (const raw of list) {
    const r = (raw ?? {}) as Partial<Item>;
    const name = localized(r.name, 120);
    if (!hasText(name)) continue; // skip empty rows
    let id = typeof r.id === "string" && isSlug(r.id) ? r.id : slugify(name.en) || randomId();
    while (seen.has(id)) id = `${id}-${randomId().slice(0, 4)}`;
    seen.add(id);
    items.push({ id, name, ...(isAllowedPhoto(r.photo) ? { photo: r.photo } : {}) });
  }
  return items;
}

function sanitizeBuyers(value: unknown): Buyer[] {
  const list = Array.isArray(value) ? value.slice(0, 12) : [];
  return list
    .map((raw) => {
      const r = (raw ?? {}) as Partial<Buyer>;
      return { icon: text(r.icon, 8) || "👥", name: localized(r.name, 80) };
    })
    .filter((b) => hasText(b.name));
}

function sanitizeDates(value: unknown): string[] {
  const list = Array.isArray(value) ? value : [];
  const valid = list.filter(
    (d): d is string => typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d) && !Number.isNaN(Date.parse(d)),
  );
  return [...new Set(valid)].sort().slice(0, 30);
}

/**
 * Cleans a category sent from the admin form.
 * @param existingSlugs slugs of the other categories (to keep page addresses unique)
 * @param fixedSlug     the current slug when editing (the page address never changes)
 */
export function sanitizeCategory(input: unknown, existingSlugs: string[], fixedSlug?: string): Category {
  const r = (input ?? {}) as Partial<Category>;
  const name = localized(r.name, 80);
  if (!hasText(name)) throw new InvalidInput("Please enter the category name (English or Hindi).");

  let slug = fixedSlug;
  if (!slug) {
    slug = slugify(text(r.slug, 60) || name.en);
    if (!slug) throw new InvalidInput("Please enter a page address in English letters (for example: holi-items).");
    if (RESERVED_SLUGS.has(slug)) throw new InvalidInput(`The page address "${slug}" is reserved. Please choose another.`);
    if (existingSlugs.includes(slug)) throw new InvalidInput(`A category with the page address "${slug}" already exists.`);
  }

  const allYear = Boolean(r.allYear);
  const dates = allYear ? [] : sanitizeDates(r.dates);
  const dateLabel = localized(r.dateLabel, 60);

  return {
    slug,
    icon: text(r.icon, 8) || "🛍️",
    name,
    description: localized(r.description, 400),
    season: localized(r.season, 80),
    buyers: sanitizeBuyers(r.buyers),
    image: {
      src: isAllowedPhoto(r.image?.src) ? r.image.src : "/photos/hero.jpg",
      alt: name,
    },
    items: sanitizeItems(r.items),
    ...(allYear ? { allYear: true } : {}),
    ...(dates.length ? { dates } : {}),
    ...(hasText(dateLabel) ? { dateLabel } : {}),
  };
}

export function sanitizeShop(input: unknown): Shop {
  const r = (input ?? {}) as Partial<Shop>;
  const name = localized(r.name, 80);
  if (!hasText(name)) throw new InvalidInput("Please enter the shop name.");
  const phone = text(r.phone, 30);
  if (!/\d{6,}/.test(phone.replace(/\D/g, ""))) throw new InvalidInput("Please enter a valid phone number.");
  const whatsapp = text(r.whatsapp, 20).replace(/\D/g, "");
  if (whatsapp.length < 10 || whatsapp.length > 15)
    throw new InvalidInput("WhatsApp number must be digits with country code, e.g. 918877699552.");
  return {
    name,
    tagline: localized(r.tagline, 160),
    phone,
    whatsapp,
    address: localized(r.address, 200),
    hours: localized(r.hours, 100),
    mapQuery: text(r.mapQuery, 200) || text(r.address?.en, 200),
  };
}
