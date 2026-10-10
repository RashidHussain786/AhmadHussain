# Ahmad Hussain — Shop Website

Website for the Ahmad Hussain shop in Main Bazar, Dalsinghsarai (since 1990): Shaadi, Puja and festival items, wholesale and retail.

Built with **Next.js 16**, **Tailwind CSS v4** and **TypeScript**. Hosted on **Vercel**.

- English: `/` (default) · Hindi: `/hi`
- Admin panel: `/admin` (password protected, not linked anywhere, hidden from Google)

## How it works

```
Visitors ──► pre-built pages (fast, cached)
                  ▲ refreshed a few seconds after every save
Admin ──► /admin (password) ──► data.json + uploaded photos in Vercel Blob
```

- All shop content (shop details, categories, items, festival dates) lives in **one file, `data.json`**.
  - On Vercel it is stored in **Vercel Blob**.
  - On your computer it is stored in `.data/data.json` (not committed).
  - Until the first save, the starting data in `src/lib/content/seed.ts` is used.
- Photos that came with the project are in `public/photos/`. Photos uploaded from the admin go to Vercel Blob (or `public/uploads/` locally). Uploads are shrunk in the browser first (about 200 KB each).

## Admin panel (`/admin`)

| Screen | What you can do |
|---|---|
| **Categories** | Add, edit, delete, reorder (↑ ↓) festival categories |
| **Category** | Name, description, season, festival dates, cover photo, who buys, and all **items** (add / edit / delete / reorder / upload photo) |
| **Shop details** | Phone, WhatsApp number, address, opening hours, Google Maps search |

Names can be filled in **English, Hindi or both**. If one is empty, the website shows the other in both languages.

## Run on your computer

```bash
npm install
npm run dev
```

Open http://localhost:3000 (website) and http://localhost:3000/admin (admin).
The local admin password is in `.env.local` (`ADMIN_PASSWORD`). See `.env.example` for all settings.

## Deploy on Vercel (first time)

1. Push this project to GitHub.
2. Go to https://vercel.com → **Add New → Project** → import the repository → **Deploy**.
3. In the project: **Storage → Create → Blob** → create a store and **connect it to this project**.
   This adds `BLOB_READ_WRITE_TOKEN` automatically.
4. **Settings → Environment Variables**, add:
   - `ADMIN_PASSWORD` — the admin password you choose
   - `ADMIN_SECRET` — a long random text. Generate one with:
     `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - `NEXT_PUBLIC_SITE_URL` — your website address, e.g. `https://ahmad-hussain.vercel.app`
5. **Deployments → Redeploy** so the new settings are used.
6. Open `https://your-site/admin` and log in.

To change the admin password later: update `ADMIN_PASSWORD` in Vercel and redeploy.
To log everyone out: change `ADMIN_SECRET` and redeploy.

## Where things are in the code

| What | Where |
|---|---|
| Starting content (used until the first save) | `src/lib/content/seed.ts` |
| Reading / saving content and photos | `src/lib/content/store.ts` |
| Checking what the admin saves | `src/lib/content/validate.ts` |
| Admin login | `src/lib/auth.ts` |
| Admin pages and actions | `src/app/admin/` |
| Website text (English + Hindi) | `src/lib/dictionary.ts` |
| Colours and fonts | `src/app/globals.css` |
| Home page photo | `public/photos/hero.jpg` |

## Festival dates ("Coming soon")

Each festival category has a list of dates (one per year). The website shows it under "Coming soon" from **45 days before** until **3 days after**. This is checked in the visitor's browser, so it is always up to date. Add new years' dates in the admin before they run out (filled until 2030).

## Photos

The starting photos are free stock photos from [Pexels](https://www.pexels.com) (free to use, no credit needed). Replace them with real shop photos from the admin panel.
