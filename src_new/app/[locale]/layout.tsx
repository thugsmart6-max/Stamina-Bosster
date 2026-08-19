import { AgeGate } from "@/components/age-gate";
import { ToastProvider } from "@/components/ui/toast";
import { routing, type Locale } from "@/i18n/routing";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import {
  Inter,
  Noto_Sans_Devanagari,
  Noto_Sans_Tamil,
  Space_Grotesk,
} from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const grotesk = Space_Grotesk({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoTamil = Noto_Sans_Tamil({
  variable: "--font-tamil",
  subsets: ["tamil"],
  weight: ["400", "500", "600", "700"],
});

const notoDevanagari = Noto_Sans_Devanagari({
  variable: "--font-hindi",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(appUrl),
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `${appUrl}/${locale}`,
      languages: {
        en: `${appUrl}/en`,
        hi: `${appUrl}/hi`,
        ta: `${appUrl}/ta`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${appUrl}/${locale}`,
      siteName: "Stamina Booster",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: t("title"),
      description: t("description"),
    },
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const skipT = await getTranslations({ locale, namespace: "common" });

  const fontClass =
    locale === "ta"
      ? `${notoTamil.variable} ${inter.variable} ${grotesk.variable}`
      : locale === "hi"
        ? `${notoDevanagari.variable} ${inter.variable} ${grotesk.variable}`
        : `${grotesk.variable} ${inter.variable}`;

  const bodyFont =
    locale === "en"
      ? "font-[family-name:var(--font-sora)]"
      : locale === "ta"
        ? "font-[family-name:var(--font-tamil)]"
        : "font-[family-name:var(--font-hindi)]";

  const displayFont =
    locale === "en"
      ? "font-[family-name:var(--font-sora)]"
      : locale === "ta"
        ? "font-[family-name:var(--font-tamil)]"
        : "font-[family-name:var(--font-hindi)]";

  return (
    <html lang={locale} className={`${fontClass} h-full`} data-scroll-behavior="smooth">
      <body
        className={`flex min-h-full flex-col bg-background text-foreground ${bodyFont}`}
        data-display-font={displayFont}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-foreground"
        >
          {skipT("skipToContent")}
        </a>
        <NextIntlClientProvider messages={messages}>
          <ToastProvider>
            <AgeGate />
            {children}
          </ToastProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
