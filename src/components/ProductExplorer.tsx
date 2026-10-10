"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CATEGORIES, type Category } from "@/data/categories";
import { getDictionary } from "@/lib/dictionary";
import { countdownText } from "@/lib/format";
import { localePath, type Locale } from "@/lib/i18n";
import { whatsappLink } from "@/lib/links";
import { inSeason } from "@/lib/season";
import { useToday } from "@/lib/use-today";
import { ArrowRightIcon, SearchIcon, WhatsAppIcon } from "./Icons";

const PREVIEW_ITEMS = 4;

/** Searchable, filterable grid of all categories. Search matches English and Hindi. */
export function ProductExplorer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const today = useToday();
  const [active, setActive] = useState("all");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const matches = (c: Category) =>
    !q ||
    [c.name.en, c.name.hi, c.description.en, c.description.hi, ...c.items.flatMap((i) => [i.name.en, i.name.hi])]
      .join(" ")
      .toLowerCase()
      .includes(q);

  // Festivals in season first, then all-year items, then the rest
  const rank = (c: Category) => (today && inSeason(c, today) ? 0 : c.allYear ? 1 : 2);
  const list = CATEGORIES.filter((c) => (active === "all" || c.slug === active) && matches(c)).sort(
    (a, b) => rank(a) - rank(b),
  );

  const chips = [{ slug: "all", icon: "", label: t.products.all }].concat(
    CATEGORIES.map((c) => ({ slug: c.slug, icon: c.icon, label: c.name[locale] })),
  );

  return (
    <div>
      <label className="relative mx-auto block max-w-2xl">
        <span className="sr-only">{t.products.search}</span>
        <SearchIcon className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.products.search}
          className="w-full rounded-xl border border-line bg-white py-3.5 pr-4 pl-12 text-base text-ink outline-none placeholder:text-muted/70 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
        />
      </label>

      <div className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 lg:flex-wrap lg:justify-center">
        {chips.map((chip) => (
          <button
            key={chip.slug}
            type="button"
            onClick={() => setActive(chip.slug)}
            aria-pressed={active === chip.slug}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition ${
              active === chip.slug
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-line bg-white text-body hover:border-brand-200 hover:text-brand-700"
            }`}
          >
            {chip.icon && `${chip.icon} `}
            {chip.label.replace(/ Items$/, "")}
          </button>
        ))}
      </div>

      {list.length > 0 ? (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <li key={c.slug}>
              <CategoryCard category={c} locale={locale} today={today} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 rounded-xl bg-soft p-6 text-center text-muted">{t.products.empty}</p>
      )}
    </div>
  );
}

function CategoryCard({ category: c, locale, today }: { category: Category; locale: Locale; today: string | null }) {
  const t = getDictionary(locale);
  const season = today ? inSeason(c, today) : null;
  const href = localePath(locale, `/${c.slug}`);
  const extra = c.items.length - PREVIEW_ITEMS;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-stone-900/5">
      <Link href={href} className="relative block aspect-[16/10] overflow-hidden bg-soft">
        <Image
          src={c.image.src}
          alt={c.image.alt[locale]}
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3">
          {c.allYear ? (
            <Badge className="bg-white text-whatsapp-dark">{t.products.allYear}</Badge>
          ) : season ? (
            <Badge className="bg-brand-600 text-white">{countdownText(t, season.daysLeft)}</Badge>
          ) : (
            <Badge className="bg-white text-muted">{t.products.seasonal}</Badge>
          )}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="flex items-center gap-2 text-lg leading-tight font-bold">
          <span aria-hidden>{c.icon}</span>
          <Link href={href} className="hover:text-brand-600">
            {c.name[locale]}
          </Link>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{c.description[locale]}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {c.items.slice(0, PREVIEW_ITEMS).map((i) => (
            <li key={i.id} className="rounded-md bg-soft px-2 py-1 text-xs text-body ring-1 ring-line">
              {i.name[locale]}
            </li>
          ))}
          {extra > 0 && (
            <li className="rounded-md bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700">
              {t.products.more(extra)}
            </li>
          )}
        </ul>

        <div className="mt-auto flex gap-2 pt-5">
          <Link
            href={href}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-line px-4 py-2.5 text-sm font-bold text-ink transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
          >
            {t.products.view}
            <ArrowRightIcon width={16} height={16} />
          </Link>
          <a
            href={whatsappLink(t.wa.category(c.name[locale]))}
            target="_blank"
            rel="noopener"
            className="flex items-center justify-center gap-1.5 rounded-lg bg-whatsapp px-4 py-2.5 text-sm font-bold text-white transition hover:bg-whatsapp-dark"
          >
            <WhatsAppIcon width={18} height={18} />
            {t.products.ask}
          </a>
        </div>
      </div>
    </article>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className: string }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-bold shadow-sm ${className}`}>{children}</span>;
}
