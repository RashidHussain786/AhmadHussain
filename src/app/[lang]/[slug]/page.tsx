import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CategorySeason } from "@/components/CategorySeason";
import { PhoneIcon, WhatsAppIcon } from "@/components/Icons";
import { Breadcrumb, CtaBand, FaqList, JsonLd, type Faq } from "@/components/PageParts";
import { SectionHeading } from "@/components/Section";
import { findCategory, getContent, type Category, type Shop } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { callLink, whatsappLink } from "@/lib/links";
import { SITE_URL } from "@/lib/site";

export async function generateStaticParams() {
  const { categories } = await getContent();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const c = findCategory(await getContent(), slug);
  if (!c || !isLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    title: { absolute: `${c.name[lang]} — ${t.category.titleSuffix}` },
    description: `${c.description[lang]} ${t.category.subtitle}.`,
    alternates: {
      canonical: localePath(lang, `/${slug}`),
      languages: { en: `/${slug}`, hi: `/hi/${slug}` },
    },
    openGraph: { images: [c.image.src] },
  };
}

/** FAQs built only from real shop facts (items, address, wholesale, phone). */
function categoryFaqs(c: Category, shop: Shop, locale: Locale): Faq[] {
  const t = getDictionary(locale);
  const name = c.name[locale];
  return [
    { q: t.faq.wholesaleQ(name), a: t.faq.wholesaleA },
    { q: t.faq.itemsQ(name), a: t.faq.itemsA(c.items.map((i) => i.name[locale]).join(", ")) },
    { q: t.faq.areaQ, a: t.faq.areaA(shop.address[locale]) },
    { q: t.faq.priceQ, a: t.faq.priceA(shop.phone) },
  ];
}

type Params = PageProps<"/[lang]/[slug]">["params"];

// The URL (params) is read inside <Suspense>, so navigating between
// categories can show the skeleton instantly while the page streams in.
export default function CategoryPage({ params }: PageProps<"/[lang]/[slug]">) {
  return (
    <Suspense fallback={<CategorySkeleton />}>
      <CategoryContent params={params} />
    </Suspense>
  );
}

async function CategoryContent({ params }: { params: Params }) {
  const { lang, slug } = await params;
  const { shop, categories } = await getContent();
  const c = findCategory({ shop, categories }, slug);
  if (!c || !isLocale(lang)) notFound();

  const t = getDictionary(lang);
  const others = categories.filter((x) => x.slug !== c.slug);
  const faqs = categoryFaqs(c, shop, lang);
  const home = localePath(lang, "/");
  const productsHref = lang === "en" ? "/#products" : `${home}#products`;
  const url = (path: string) => `${SITE_URL}${localePath(lang, path)}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: t.nav.home, item: url("/") },
            { "@type": "ListItem", position: 2, name: t.nav.products, item: `${url("/")}#products` },
            { "@type": "ListItem", position: 3, name: c.name[lang], item: url(`/${c.slug}`) },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />

      {/* Hero */}
      <section className="bg-hero-dark text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-10 sm:py-14 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <Breadcrumb
              items={[
                { name: t.nav.home, href: home },
                { name: t.nav.products, href: productsHref },
                { name: c.name[lang] },
              ]}
            />
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand-500/40 bg-brand-500/15 px-3 py-1 text-xs font-bold tracking-wide text-brand-200 uppercase">
              {c.icon} {c.allYear ? t.products.allYear : t.products.seasonal}
            </p>
            <h1 className="mt-4 text-4xl leading-tight font-extrabold text-white sm:text-5xl">{c.name[lang]}</h1>
            <p className="mt-2 text-lg font-semibold text-brand-200">{t.category.subtitle}</p>
            <p className="mt-4 max-w-xl leading-relaxed text-stone-300">{c.description[lang]}</p>

            <ul className="mt-6 flex flex-wrap gap-2 text-xs sm:text-sm">
              <li className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-stone-300">
                {t.category.chipSeason}: <span className="font-bold text-white">{c.season[lang]}</span>
              </li>
              <li className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 font-bold text-white">
                {t.category.chipSale}
              </li>
              <li className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 font-bold text-white">
                📍 {t.category.chipArea}
              </li>
            </ul>

            <CategorySeason category={{ dates: c.dates, dateLabel: c.dateLabel }} locale={lang} />

            <div className="mt-8 grid max-w-md grid-cols-2 gap-3">
              <a
                href={whatsappLink(shop, t.wa.category(c.name[lang]))}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-3 py-3 text-sm font-bold text-white transition hover:bg-brand-700 sm:text-base"
              >
                <WhatsAppIcon width={18} height={18} className="shrink-0" /> {t.products.ask}
              </a>
              <a
                href={callLink(shop)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/25 px-3 py-3 text-sm font-bold text-white transition hover:bg-white/10 sm:text-base"
              >
                <PhoneIcon width={18} height={18} className="shrink-0" /> {t.hero.call}
              </a>
            </div>
          </div>
          <div className="relative aspect-[16/11] overflow-hidden rounded-2xl ring-1 ring-white/10">
            <Image
              src={c.image.src}
              alt={c.image.alt[lang]}
              fill
              priority
              sizes="(min-width: 1024px) 480px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Items with photos */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
        <SectionHeading label={t.products.label} title={t.category.items} subtitle={t.products.subtitle} />
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {c.items.map((item) => {
            const photo = item.photo;
            return (
              <li
                key={item.id}
                className="flex flex-col overflow-hidden rounded-xl border border-line bg-white transition hover:shadow-lg hover:shadow-stone-900/5"
              >
                <div className="relative aspect-square bg-soft">
                  {photo ? (
                    <Image
                      src={photo}
                      alt={item.name[lang]}
                      fill
                      sizes="(min-width: 1024px) 270px, (min-width: 640px) 33vw, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 p-3 text-center">
                      <span className="text-4xl opacity-60">{c.icon}</span>
                      <span className="text-xs font-medium text-muted">{t.category.photoSoon}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
                  <p className="text-sm leading-snug font-bold text-ink sm:text-[15px]">{item.name[lang]}</p>
                  <a
                    href={whatsappLink(shop, t.wa.item(item.name[lang], c.name[lang]))}
                    target="_blank"
                    rel="noopener"
                    aria-label={`${t.products.ask}: ${item.name[lang]}`}
                    className="mt-auto flex items-center justify-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm font-bold text-whatsapp-dark transition hover:border-whatsapp hover:bg-whatsapp hover:text-white"
                  >
                    <WhatsAppIcon width={16} height={16} /> {t.products.ask}
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Who buys */}
      <section className="border-y border-line bg-soft">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
          <SectionHeading center label={t.category.buyersLabel} title={t.category.buyersTitle(c.name[lang])} />
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {c.buyers.map((b) => (
              <li key={b.name.en} className="flex items-center gap-4 rounded-xl border border-line bg-white p-5">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-2xl ring-1 ring-brand-100">
                  {b.icon}
                </span>
                <span className="font-bold text-ink">{b.name[lang]}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQs */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
        <SectionHeading center label={t.category.faqLabel} title={t.category.faqTitle} />
        <FaqList faqs={faqs} />
      </section>

      {/* Other categories */}
      <section className="border-t border-line bg-soft">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
          <SectionHeading title={t.category.others} />
          <ul className="no-scrollbar -mx-4 mt-6 flex gap-3 overflow-x-auto px-4 pb-2">
            {others.map((o) => (
              <li key={o.slug} className="shrink-0">
                <Link
                  href={localePath(lang, `/${o.slug}`)}
                  className="group block w-40 overflow-hidden rounded-xl border border-line bg-white transition hover:border-brand-200"
                >
                  <span className="relative block aspect-[4/3] overflow-hidden">
                    <Image src={o.image.src} alt="" fill sizes="160px" className="object-cover transition group-hover:scale-105" />
                  </span>
                  <span className="block px-3 py-2.5 text-sm leading-tight font-bold text-ink group-hover:text-brand-600">
                    {o.icon} {o.name[lang]}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        locale={lang}
        shop={shop}
        title={t.category.ctaTitle(c.name[lang])}
        text={t.category.ctaText}
        message={t.wa.category(c.name[lang])}
      />
    </>
  );
}

function CategorySkeleton() {
  return (
    <div aria-hidden className="animate-pulse">
      <div className="bg-hero-dark h-96" />
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-4 py-12 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="aspect-[3/4] rounded-xl bg-stone-100" />
        ))}
      </div>
    </div>
  );
}
