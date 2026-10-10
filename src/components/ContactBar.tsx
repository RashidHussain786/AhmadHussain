import type { Shop } from "@/lib/content/types";
import { getDictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { callLink, directionsLink, whatsappLink } from "@/lib/links";
import { MapPinIcon, PhoneIcon, WhatsAppIcon } from "./Icons";

/** Phones: fixed bar at the bottom. Desktop: floating WhatsApp button. */
export function ContactBar({ locale, shop }: { locale: Locale; shop: Shop }) {
  const t = getDictionary(locale);
  const wa = whatsappLink(shop, t.wa.hello(shop.name[locale]));

  return (
    <>
      <nav
        aria-label="Contact"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgb(0_0_0/0.08)] backdrop-blur md:hidden"
      >
        <a href={callLink(shop)} className="flex flex-col items-center gap-0.5 py-2.5 text-xs font-semibold text-ink">
          <PhoneIcon width={22} height={22} />
          {t.bar.call}
        </a>
        <a
          href={wa}
          target="_blank"
          rel="noopener"
          className="-mt-4 mx-2 flex flex-col items-center gap-0.5 rounded-2xl bg-whatsapp py-2.5 text-xs font-semibold text-white shadow-lg shadow-whatsapp/30"
        >
          <WhatsAppIcon width={24} height={24} />
          {t.bar.whatsapp}
        </a>
        <a
          href={directionsLink(shop)}
          target="_blank"
          rel="noopener"
          className="flex flex-col items-center gap-0.5 py-2.5 text-xs font-semibold text-ink"
        >
          <MapPinIcon width={22} height={22} />
          {t.bar.map}
        </a>
      </nav>

      <a
        href={wa}
        target="_blank"
        rel="noopener"
        aria-label={t.hero.whatsapp}
        className="fixed right-6 bottom-6 z-40 hidden size-14 place-items-center rounded-full bg-whatsapp text-white shadow-xl shadow-whatsapp/40 transition hover:scale-105 hover:bg-whatsapp-dark md:grid"
      >
        <WhatsAppIcon width={28} height={28} />
      </a>
    </>
  );
}
