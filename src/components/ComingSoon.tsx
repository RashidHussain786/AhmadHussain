"use client";

import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/content/types";
import { getDictionary } from "@/lib/dictionary";
import { countdownText, formatDate } from "@/lib/format";
import { localePath, type Locale } from "@/lib/i18n";
import { inSeason } from "@/lib/season";
import { useToday } from "@/lib/use-today";

/** Festivals within the next 45 days, with a countdown. Calculated in the browser. */
export function ComingSoon({ locale, categories }: { locale: Locale; categories: Category[] }) {
  const today = useToday();
  const t = getDictionary(locale);
  if (!today) return null;

  const upcoming = categories.flatMap((c) => {
    const next = inSeason(c, today);
    return next ? [{ c, next }] : [];
  }).sort((a, b) => a.next.daysLeft - b.next.daysLeft);

  if (upcoming.length === 0) return null;

  return (
    <section aria-labelledby="coming-soon" className="mx-auto max-w-6xl px-4 pt-10 animate-fade-up">
      <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-4 sm:p-5">
        <div className="mb-3 flex items-center gap-2">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-500 opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-brand-500" />
          </span>
          <h2 id="coming-soon" className="text-base font-bold">
            {t.season.title}
          </h2>
          <span className="hidden text-sm text-muted sm:inline">· {t.season.subtitle}</span>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map(({ c, next }) => (
            <li key={c.slug}>
              <Link
                href={localePath(locale, `/${c.slug}`)}
                className="group flex items-center gap-3 rounded-xl border border-line bg-white p-2.5 pr-4 transition hover:border-brand-200 hover:shadow-sm"
              >
                <Image
                  src={c.image.src}
                  alt=""
                  width={56}
                  height={56}
                  className="size-14 shrink-0 rounded-lg object-cover"
                />
                <span className="min-w-0 flex-1">
                  <span className="block leading-tight font-bold text-ink">{c.name[locale]}</span>
                  <span className="block text-xs text-muted">
                    {c.dateLabel?.[locale]} · {formatDate(next.date, locale)}
                  </span>
                </span>
                <span className="shrink-0 rounded-full bg-brand-600 px-2.5 py-1 text-xs font-bold text-white">
                  {countdownText(t, next.daysLeft)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
