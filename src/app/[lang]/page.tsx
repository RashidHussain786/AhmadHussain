import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ComingSoon } from "@/components/ComingSoon";
import { ArrowRightIcon, CheckIcon, ClockIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from "@/components/Icons";
import { ProductExplorer } from "@/components/ProductExplorer";
import { SectionHeading } from "@/components/Section";
import { getContent } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, localePath } from "@/lib/i18n";
import { callLink, directionsLink, mapEmbedLink, whatsappLink } from "@/lib/links";
import { HERO_IMAGE, SITE_URL } from "@/lib/site";

const WHOLESALE_ICONS = ["🎪", "🎨", "🏪", "💍"];

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  return {
    alternates: {
      canonical: isLocale(lang) ? localePath(lang, "/") : "/",
      languages: { en: "/", hi: "/hi" },
    },
  };
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const { shop, categories } = await getContent();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: shop.name.en,
    alternateName: shop.name.hi,
    description: shop.tagline.en,
    telephone: callLink(shop).replace("tel:", ""),
    url: SITE_URL,
    image: `${SITE_URL}${HERO_IMAGE.src}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Main Bazar",
      addressLocality: "Dalsinghsarai",
      addressRegion: "Bihar",
      postalCode: "848114",
      addressCountry: "IN",
    },
    openingHours: "Mo-Su 08:00-21:00",
    foundingDate: "1990",
    areaServed: "Samastipur, Bihar",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-soft">
        {/* One photo: on top on phones, on the right half on desktop — fading into the background */}
        <div className="relative h-56 sm:h-72 lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[55%]">
          <Image
            src={HERO_IMAGE.src}
            alt={HERO_IMAGE.alt[lang]}
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-soft via-soft/20 to-transparent lg:bg-gradient-to-r lg:via-soft/60" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pt-2 pb-12 sm:pb-16 lg:py-24">
          <div className="max-w-xl animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 sm:text-sm">
              <span className="size-1.5 rounded-full bg-brand-500" />
              {t.hero.eyebrow} · {t.hero.points[0]}
            </p>
            <h1 className="mt-5 text-[2.4rem] leading-[1.1] font-extrabold sm:text-6xl">
              {t.hero.titleStart} <span className="text-brand-600">{t.hero.titleHighlight}</span> {t.hero.titleEnd}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-body sm:text-lg">{t.hero.subtitle}</p>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:flex">
              <a
                href={whatsappLink(shop, t.wa.hello(shop.name[lang]))}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-3 py-3 text-sm font-bold whitespace-nowrap text-white shadow-sm transition hover:bg-brand-700 sm:px-5 sm:text-base"
              >
                <WhatsAppIcon width={18} height={18} /> {t.hero.whatsapp}
              </a>
              <a
                href="#products"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-white px-3 py-3 text-sm font-bold whitespace-nowrap text-ink transition hover:border-brand-200 hover:text-brand-700 sm:px-5 sm:text-base"
              >
                {t.hero.explore} <ArrowRightIcon width={18} height={18} className="hidden min-[360px]:block" />
              </a>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-body">
              {t.hero.points.map((p) => (
                <li key={p} className="flex items-center gap-1.5">
                  <CheckIcon width={16} height={16} className="text-brand-600" /> {p}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      <ComingSoon locale={lang} categories={categories} />

      {/* Products */}
      <section id="products" className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <SectionHeading center label={t.products.label} title={t.products.title} subtitle={t.products.subtitle} />
        <div className="mt-10">
          <ProductExplorer locale={lang} shop={shop} categories={categories} />
        </div>
      </section>

      {/* Wholesale */}
      <section id="wholesale" className="border-y border-line bg-soft">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:py-20 lg:grid-cols-2">
          <div>
            <SectionHeading label={t.wholesale.label} title={t.wholesale.title} subtitle={t.wholesale.text} />
            <div className="mt-8 grid grid-cols-2 gap-3 sm:flex">
              <a
                href={whatsappLink(shop, t.wa.bulk)}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-3 py-3 text-center text-sm leading-tight font-bold text-white transition hover:bg-brand-700 sm:px-5 sm:text-base"
              >
                <WhatsAppIcon width={18} height={18} className="shrink-0" /> {t.wholesale.cta}
              </a>
              <a
                href={callLink(shop)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-white px-3 py-3 text-center text-sm leading-tight font-bold text-ink transition hover:border-brand-200 hover:text-brand-700 sm:px-5 sm:text-base"
              >
                <PhoneIcon width={18} height={18} className="shrink-0" /> {t.wholesale.call}
              </a>
            </div>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {t.wholesale.who.map((w, i) => (
              <li key={w} className="rounded-xl border border-line bg-white p-5">
                <span className="grid size-10 place-items-center rounded-lg bg-brand-50 text-xl ring-1 ring-brand-100">
                  {WHOLESALE_ICONS[i]}
                </span>
                <p className="mt-3 font-bold text-ink">{w}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How to buy */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <SectionHeading center label={t.steps.label} title={t.steps.title} />
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {t.steps.items.map((s, i) => (
            <li key={s.title} className="rounded-xl border border-line bg-white p-6 text-center">
              <span className="mx-auto grid size-11 place-items-center rounded-full bg-brand-50 text-lg font-extrabold text-brand-700 ring-1 ring-brand-100">
                {i + 1}
              </span>
              <p className="mt-4 text-lg font-bold text-ink">{s.title}</p>
              <p className="mt-1 text-sm text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Visit */}
      <section id="visit" className="border-t border-line bg-soft">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <div className="grid overflow-hidden rounded-2xl border border-line bg-white md:grid-cols-[1fr_1.4fr]">
            <div className="p-6 sm:p-8">
              <SectionHeading label={t.visit.label} title={t.visit.title} />
              <dl className="mt-6 space-y-5">
                <InfoRow icon={<MapPinIcon />} label={t.visit.address} value={shop.address[lang]} />
                <InfoRow icon={<ClockIcon />} label={t.visit.hours} value={shop.hours[lang]} />
                <InfoRow
                  icon={<PhoneIcon />}
                  label={t.visit.phone}
                  value={
                    <a href={callLink(shop)} className="hover:text-brand-600">
                      {shop.phone}
                    </a>
                  }
                />
              </dl>
              <a
                href={directionsLink(shop)}
                target="_blank"
                rel="noopener"
                className="mt-7 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-3 font-bold text-white transition hover:bg-brand-700"
              >
                <MapPinIcon width={18} height={18} /> {t.visit.directions}
              </a>
            </div>
            <iframe
              title={t.visit.title}
              src={mapEmbedLink(shop)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-72 w-full border-0 md:h-full md:min-h-96"
            />
          </div>
        </div>
      </section>
    </>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">{icon}</span>
      <div>
        <dt className="text-sm text-muted">{label}</dt>
        <dd className="font-semibold text-ink">{value}</dd>
      </div>
    </div>
  );
}
