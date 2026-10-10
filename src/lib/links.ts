import type { Shop } from "@/lib/content/types";

export const whatsappLink = (shop: Shop, message: string) =>
  `https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(message)}`;

export const callLink = (shop: Shop) => `tel:${shop.phone.replace(/[^\d+]/g, "")}`;

export const directionsLink = (shop: Shop) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.mapQuery)}`;

export const mapEmbedLink = (shop: Shop) =>
  `https://www.google.com/maps?q=${encodeURIComponent(shop.mapQuery)}&output=embed`;
