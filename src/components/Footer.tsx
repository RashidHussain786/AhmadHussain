import Link from "next/link";
import type { Category, Shop } from "@/lib/content/types";
import { getDictionary } from "@/lib/dictionary";
import { localePath, type Locale } from "@/lib/i18n";
import { callLink } from "@/lib/links";
import { Logo } from "./Logo";

export function Footer({ locale, shop, categories }: { locale: Locale; shop: Shop; categories: Category[] }) {
  const t = getDictionary(locale);
  return (
    <footer className="bg-ink pb-24 text-stone-300 md:pb-10">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-14 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="flex items-center gap-2 text-lg font-extrabold text-white">
            <Logo size={32} />
            {shop.name[locale]}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-stone-400">{shop.tagline[locale]}</p>
          <p className="mt-4 text-sm text-stone-400">{shop.address[locale]}</p>
          <a href={callLink(shop)} className="mt-1 block text-sm font-semibold text-white hover:text-brand-200">
            {shop.phone}
          </a>
          <Link href={localePath(locale, "/about")} className="mt-4 inline-block text-sm font-semibold text-brand-200 hover:text-white">
            {t.nav.about} →
          </Link>
        </div>
        <div className="lg:col-span-2">
          <p className="text-xs font-bold tracking-[0.14em] text-stone-500 uppercase">{t.nav.products}</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm lg:grid-cols-3">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={localePath(locale, `/${c.slug}`)} className="text-stone-300 hover:text-white">
                  {c.name[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-6xl border-t border-white/10 px-4 pt-6 text-xs text-stone-500">
        © {shop.name[locale]} · {t.footer.rights}
      </p>
    </footer>
  );
}
