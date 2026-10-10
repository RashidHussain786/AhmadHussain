import { SHOP } from "@/data/shop";

export const whatsappLink = (message: string) =>
  `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(message)}`;

export const callLink = `tel:${SHOP.phoneLink}`;

export const directionsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SHOP.mapQuery)}`;

export const mapEmbedLink = `https://www.google.com/maps?q=${encodeURIComponent(SHOP.mapQuery)}&output=embed`;
