import Link from "next/link";
import { SHOP } from "@/data/shop";
import { getDictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { callLink, whatsappLink } from "@/lib/links";
import { PhoneIcon, WhatsAppIcon } from "./Icons";

export type Crumb = { name: string; href?: string };

/** "Home › Products › Durga Puja Items" — light text, for dark heroes. */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-stone-400">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((c, i) => (
          <li key={c.name} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden>›</span>}
            {c.href ? (
              <Link href={c.href} className="hover:text-white">
                {c.name}
              </Link>
            ) : (
              <span aria-current="page" className="text-stone-200">
                {c.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export type Faq = { q: string; a: string };

/** Accordion of questions — works without JavaScript. */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="mx-auto mt-8 max-w-3xl space-y-3">
      {faqs.map((f, i) => (
        <details
          key={f.q}
          open={i === 0}
          className="group rounded-xl border border-line border-l-4 border-l-brand-500 bg-white px-5 py-4 open:shadow-sm"
        >
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-bold text-ink [&::-webkit-details-marker]:hidden">
            {f.q}
            <span
              aria-hidden
              className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700 transition group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-3 text-[15px] leading-relaxed text-body">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

/** Full-width saffron gradient band with WhatsApp + Call buttons. */
export function CtaBand({
  locale,
  title,
  text,
  message,
}: {
  locale: Locale;
  title: string;
  text: string;
  message?: string;
}) {
  const t = getDictionary(locale);
  return (
    <section className="bg-cta text-white">
      <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:py-16">
        <h2 className="text-2xl leading-tight font-extrabold text-white sm:text-4xl">{title}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-white/90">{text}</p>
        <div className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-3">
          <a
            href={whatsappLink(message ?? t.wa.hello(SHOP.name[locale]))}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-3 py-3 text-sm font-bold text-brand-700 transition hover:bg-brand-50 sm:text-base"
          >
            <WhatsAppIcon width={18} height={18} className="shrink-0" /> WhatsApp
          </a>
          <a
            href={callLink}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/40 px-3 py-3 text-sm font-bold text-white transition hover:bg-white/10 sm:text-base"
          >
            <PhoneIcon width={18} height={18} className="shrink-0" /> {t.bar.call}
          </a>
        </div>
      </div>
    </section>
  );
}

/** Structured data for Google (breadcrumbs, FAQs, etc.). */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
