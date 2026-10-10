export const LOCALES = ["en", "hi"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export type Localized = Record<Locale, string>;

export const isLocale = (value: string): value is Locale =>
  (LOCALES as readonly string[]).includes(value);

/** English lives at "/", Hindi at "/hi". */
export function localePath(locale: Locale, path = "/") {
  const clean = path === "/" ? "" : path;
  return locale === DEFAULT_LOCALE ? clean || "/" : `/${locale}${clean}`;
}
