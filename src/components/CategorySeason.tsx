"use client";

import type { Category } from "@/lib/content/types";
import { getDictionary } from "@/lib/dictionary";
import { countdownText, formatDate } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import { DAYS_BEFORE, nextFestival } from "@/lib/season";
import { useToday } from "@/lib/use-today";

/** Next festival date + countdown for one category, computed in the browser. */
export function CategorySeason({
  category,
  locale,
}: {
  category: Pick<Category, "dates" | "dateLabel">;
  locale: Locale;
}) {
  const today = useToday();
  if (!today || !category.dates?.length) return null;

  const next = nextFestival(category, today);
  if (!next) return null;
  const t = getDictionary(locale);
  const soon = next.daysLeft <= DAYS_BEFORE;

  return (
    <p className="mt-5 inline-flex flex-wrap items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white">
      <span>📅 {t.category.nextDate(category.dateLabel?.[locale] ?? "", formatDate(next.date, locale))}</span>
      {soon && (
        <span className="rounded-full bg-brand-600 px-2.5 py-0.5 text-xs font-bold text-white">
          {countdownText(t, next.daysLeft)}
        </span>
      )}
    </p>
  );
}
