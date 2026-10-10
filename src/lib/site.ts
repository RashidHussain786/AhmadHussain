import type { Photo } from "@/lib/content/types";

/** The live website address (set NEXT_PUBLIC_SITE_URL in Vercel after deploying) */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ahmad-hussain.vercel.app";

/** Home page photo — replace public/photos/hero.jpg to change it */
export const HERO_IMAGE: Photo = {
  src: "/photos/hero.jpg",
  alt: { en: "Market stall with marigold garlands", hi: "गेंदे की मालाओं वाली दुकान" },
};
