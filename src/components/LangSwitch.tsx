"use client";

import Link from "next/link";
import { useParams, useSelectedLayoutSegments } from "next/navigation";
import { GlobeIcon } from "./Icons";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, localePath, type Locale } from "@/lib/i18n";

/** Switches between the English and Hindi version of the current page. */
export function LangSwitch() {
  const params = useParams<{ lang: string }>();
  // Path below the language, e.g. ["durga-puja"] or ["about"]
  const segments = useSelectedLayoutSegments().filter((s) => !s.startsWith("("));
  const current: Locale = isLocale(params.lang) ? params.lang : "en";
  const other: Locale = current === "en" ? "hi" : "en";
  const t = getDictionary(current);
  const href = localePath(other, segments.length ? `/${segments.join("/")}` : "/");

  return (
    <Link
      href={href}
      hrefLang={other}
      aria-label={t.switchLabel}
      className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-ink transition hover:border-brand-200 hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-brand-500"
    >
      <GlobeIcon width={16} height={16} />
      {t.switchTo}
    </Link>
  );
}
