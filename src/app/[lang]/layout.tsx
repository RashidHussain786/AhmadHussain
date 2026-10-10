import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { ContactBar } from "@/components/ContactBar";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getContent } from "@/lib/content";
import { jakarta, mukta } from "@/lib/fonts";
import { isLocale, LOCALES } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

export async function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "en";
  const { shop } = await getContent();
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${shop.name[locale]} — ${shop.tagline[locale]}`,
      template: `%s | ${shop.name[locale]}, Dalsinghsarai`,
    },
    description: shop.tagline[locale],
  };
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { shop, categories } = await getContent();

  return (
    <html lang={lang} data-scroll-behavior="smooth" className={`${jakarta.variable} ${mukta.variable}`}>
      <body className="font-sans antialiased">
        <Header locale={lang} shop={shop} />
        <main>{children}</main>
        <Footer locale={lang} shop={shop} categories={categories} />
        <ContactBar locale={lang} shop={shop} />
      </body>
    </html>
  );
}
