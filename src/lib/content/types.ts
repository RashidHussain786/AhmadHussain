import type { Localized } from "@/lib/i18n";

export type Photo = { src: string; alt: Localized };

export type Item = {
  id: string;
  name: Localized;
  /** Photo URL: "/photos/items/x.jpg" (in the project) or an uploaded Blob URL */
  photo?: string;
};

export type Buyer = { icon: string; name: Localized };

export type Category = {
  slug: string;
  icon: string;
  name: Localized;
  description: Localized;
  /** When people buy it, shown as a chip on the category page */
  season: Localized;
  /** Who usually buys these items */
  buyers: Buyer[];
  image: Photo;
  items: Item[];
  allYear?: boolean;
  /** Main festival day for each year (YYYY-MM-DD) — drives "Coming soon" */
  dates?: string[];
  dateLabel?: Localized;
};

export type Shop = {
  name: Localized;
  tagline: Localized;
  /** Shown on the website, e.g. "+91 88776 99552" */
  phone: string;
  /** WhatsApp number: country code + number, digits only */
  whatsapp: string;
  address: Localized;
  hours: Localized;
  /** What Google Maps should search for */
  mapQuery: string;
};

export type Content = {
  shop: Shop;
  categories: Category[];
};
