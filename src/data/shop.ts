// ============================================================
//  SHOP DETAILS — change these when you have the real values.
// ============================================================

export const SHOP = {
  name: { en: "Ahmad Hussain", hi: "अहमद हुसैन" },
  tagline: {
    en: "Shaadi, Puja & Festival Items — Wholesale & Retail",
    hi: "शादी, पूजा एवं त्योहार का सामान — थोक एवं खुदरा",
  },

  phone: "+91 88776 99552", // shown on the website
  phoneLink: "+918877699552", // used for the "Call" button (no spaces)
  whatsapp: "918877699552", // WhatsApp number: country code + number, digits only

  address: {
    en: "Main Bazar, Dalsinghsarai, Samastipur, Bihar 848114, India",
    hi: "मेन बाज़ार, दलसिंहसराय, समस्तीपुर, बिहार 848114, भारत",
  },
  hours: {
    en: "Every day · 8:00 AM – 9:00 PM",
    hi: "रोज़ · सुबह 8:00 – रात 9:00",
  },

  // What Google Maps should search for. Once the shop is on Google Maps,
  // put the exact shop name here, e.g. "Ahmad Hussain Store Dalsinghsarai".
  mapQuery: "Main Bazar, Dalsinghsarai, Samastipur, Bihar 848114",

  // The live website address (change after deploying to Vercel)
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ahmad-hussain.vercel.app",
} as const;
