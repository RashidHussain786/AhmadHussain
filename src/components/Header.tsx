import Link from "next/link";
import type { Shop } from "@/lib/content/types";
import { getDictionary } from "@/lib/dictionary";
import { localePath, type Locale } from "@/lib/i18n";
import { whatsappLink } from "@/lib/links";
import { WhatsAppIcon } from "./Icons";
import { LangSwitch } from "./LangSwitch";
import { Logo } from "./Logo";

export function Header({ locale, shop }: { locale: Locale; shop: Shop }) {
  const t = getDictionary(locale);
  const home = localePath(locale, "/");

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Link href={home} className="flex min-w-0 items-center gap-2.5">
          <Logo size={38} />
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[17px] font-extrabold text-ink">{shop.name[locale]}</span>
            <span className="block truncate text-xs text-muted">{t.hero.eyebrow}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-body md:flex">
          <a href={`${home}#products`} className="hover:text-brand-600">
            {t.nav.products}
          </a>
          <a href={`${home}#wholesale`} className="hover:text-brand-600">
            {t.nav.wholesale}
          </a>
          <Link href={localePath(locale, "/about")} className="hover:text-brand-600">
            {t.nav.about}
          </Link>
          <a href={`${home}#visit`} className="hover:text-brand-600">
            {t.nav.visit}
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <LangSwitch />
          <a
            href={whatsappLink(shop, t.wa.hello(shop.name[locale]))}
            target="_blank"
            rel="noopener"
            className="hidden items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-700 md:inline-flex"
          >
            <WhatsAppIcon width={16} height={16} /> {t.hero.whatsapp}
          </a>
        </div>
      </div>
    </header>
  );
}
