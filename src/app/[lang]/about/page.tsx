import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon } from "@/components/Icons";
import { Logo } from "@/components/Logo";
import { Breadcrumb, CtaBand, JsonLd } from "@/components/PageParts";
import { SectionHeading } from "@/components/Section";
import { CATEGORIES } from "@/data/categories";
import { SHOP } from "@/data/shop";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, localePath } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    title: { absolute: `${t.about.metaTitle} | ${SHOP.name[lang]}` },
    description: t.about.metaDescription,
    alternates: {
      canonical: localePath(lang, "/about"),
      languages: { en: "/about", hi: "/hi/about" },
    },
  };
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const a = t.about;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: a.metaTitle,
          url: `${SHOP.siteUrl}${localePath(lang, "/about")}`,
          mainEntity: {
            "@type": "Store",
            name: SHOP.name.en,
            alternateName: SHOP.name.hi,
            foundingDate: "1990",
            telephone: SHOP.phoneLink,
            areaServed: "Samastipur, Bihar",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Main Bazar",
              addressLocality: "Dalsinghsarai",
              addressRegion: "Bihar",
              postalCode: "848114",
              addressCountry: "IN",
            },
          },
        }}
      />

      {/* Hero */}
      <section className="bg-hero-dark text-white">
        <div className="mx-auto max-w-4xl px-4 pt-10 pb-14 text-center sm:pt-14 sm:pb-20">
          <div className="flex justify-center">
            <Breadcrumb items={[{ name: t.nav.home, href: localePath(lang, "/") }, { name: t.nav.about }]} />
          </div>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand-500/40 bg-brand-500/15 px-3 py-1 text-xs font-bold tracking-wide text-brand-200 uppercase">
            {a.eyebrow}
          </p>
          <h1 className="mt-5 text-4xl leading-tight font-extrabold text-white sm:text-5xl">{a.title}</h1>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-stone-300 sm:text-lg">{a.intro}</p>

          <dl className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {a.stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 px-3 py-4">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block text-2xl font-extrabold text-white sm:text-3xl">{s.value}</span>
                  <span className="mt-1 block text-xs text-stone-400 sm:text-sm">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:py-20 lg:grid-cols-[1fr_1.2fr]">
        <div className="relative overflow-hidden rounded-2xl border border-line bg-soft p-8 sm:p-10">
          <div className="absolute -top-16 -right-16 size-56 rounded-full bg-brand-100/60 blur-3xl" />
          <div className="relative">
            <Logo size={64} />
            <p className="mt-6 text-sm font-bold tracking-[0.14em] text-brand-600 uppercase">{a.eyebrow}</p>
            <p className="mt-2 text-6xl font-extrabold text-ink sm:text-7xl">1990</p>
            <p className="mt-3 text-lg font-bold text-ink">{SHOP.name[lang]}</p>
            <p className="mt-1 text-muted">{SHOP.address[lang]}</p>
          </div>
        </div>
        <div>
          <SectionHeading label={a.storyLabel} title={a.storyTitle} />
          <div className="mt-6 space-y-4 leading-relaxed text-body">
            {a.story.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-line bg-soft">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <SectionHeading center label={a.valuesLabel} title={a.valuesTitle} />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {a.values.map((v) => (
              <li key={v.title} className="rounded-xl border border-line border-t-4 border-t-brand-500 bg-white p-6">
                <span className="grid size-11 place-items-center rounded-lg bg-brand-50 text-xl ring-1 ring-brand-100">
                  {v.icon}
                </span>
                <p className="mt-4 font-bold text-ink">{v.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <SectionHeading center label={a.productsLabel} title={a.productsTitle} />
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link
                href={localePath(lang, `/${c.slug}`)}
                className="group block overflow-hidden rounded-xl border border-line bg-white transition hover:border-brand-200 hover:shadow-lg hover:shadow-stone-900/5"
              >
                <span className="relative block aspect-[4/3] overflow-hidden bg-soft">
                  <Image
                    src={c.image.src}
                    alt={c.image.alt[lang]}
                    fill
                    sizes="(min-width: 1024px) 270px, 50vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </span>
                <span className="flex items-center justify-between gap-2 px-3 py-3 sm:px-4">
                  <span className="text-sm leading-tight font-bold text-ink group-hover:text-brand-600 sm:text-base">
                    {c.icon} {c.name[lang]}
                  </span>
                  <ArrowRightIcon width={16} height={16} className="shrink-0 text-muted group-hover:text-brand-600" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand locale={lang} title={a.ctaTitle} text={a.ctaText} />
    </>
  );
}
