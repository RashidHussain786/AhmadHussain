import type { Metadata, Viewport } from "next";
import { Mukta, Plus_Jakarta_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { ContactBar } from "@/components/ContactBar";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SHOP } from "@/data/shop";
import { isLocale, LOCALES } from "@/lib/i18n";
import "../globals.css";

const mukta = Mukta({
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-mukta",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export async function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "en";
  return {
    metadataBase: new URL(SHOP.siteUrl),
    title: {
      default: `${SHOP.name[locale]} — ${SHOP.tagline[locale]}`,
      template: `%s | ${SHOP.name[locale]}, Dalsinghsarai`,
    },
    description: SHOP.tagline[locale],
  };
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html lang={lang} data-scroll-behavior="smooth" className={`${jakarta.variable} ${mukta.variable}`}>
      <body className="font-sans antialiased">
        <Header locale={lang} />
        <main>{children}</main>
        <Footer locale={lang} />
        <ContactBar locale={lang} />
      </body>
    </html>
  );
}
