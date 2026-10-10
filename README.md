# Ahmad Hussain — Shop Website

Website for the Ahmad Hussain shop in Dalsinghsarai, Bihar: Shaadi, Puja and festival items, sold wholesale and retail.

Built with **Next.js 16**, **Tailwind CSS v4** and **TypeScript**. Deploy on **Vercel**.

- English: `/` (default)
- Hindi: `/hi`

## Run on your computer

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Where to edit things

| What | File |
|---|---|
| Phone, WhatsApp, address, timings | `src/data/shop.ts` |
| Categories, items, photos, festival dates | `src/data/categories.ts` |
| Website text (English + Hindi) | `src/lib/dictionary.ts` |
| Colours and fonts | `src/app/globals.css` |

### Before going live
1. Put the **real phone and WhatsApp number** in `src/data/shop.ts` (the current ones are dummy numbers).
2. Put the **exact shop address**, and set `mapQuery` to the shop's name as it appears on Google Maps.
3. Replace the stock photos with **real photos of your goods**. Put them in `public/photos/` and use `src: "/photos/your-photo.jpg"`.

### Festival dates ("Coming soon")
Each festival category has a `dates` list (one date per year, 2026–2030).
The site shows it under "Coming soon" from **45 days before** the date until **3 days after**.
This is checked in the visitor's browser every time the page opens, so it stays correct without rebuilding.
**Add the next years' dates before 2030.**

## Deploy on Vercel

1. Push this folder to a GitHub repository.
2. Go to https://vercel.com → **Add New Project** → import the repository → **Deploy**.
3. After deploying, add an environment variable `NEXT_PUBLIC_SITE_URL` with your website address
   (e.g. `https://ahmad-hussain.vercel.app`) and redeploy. It is used for Google (sitemap, links).

## Photos

The current photos are free stock photos from [Pexels](https://www.pexels.com) (free to use, no attribution needed).
