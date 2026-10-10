import type { Dictionary } from "./dictionary";
import type { Locale } from "./i18n";

export function countdownText(t: Dictionary, daysLeft: number) {
  if (daysLeft > 0) return t.season.daysLeft(daysLeft);
  if (daysLeft === 0) return t.season.today;
  return t.season.ongoing;
}

export function formatDate(iso: string, locale: Locale) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(locale === "hi" ? "hi-IN" : "en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}
