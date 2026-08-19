import { defineRouting } from "next-intl/routing";

export const locales = ["en", "hi", "ta"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale: "en",
  localePrefix: "always",
});

export const localeLabels: Record<Locale, string> = {
  en: "English",
  hi: "हिंदी",
  ta: "தமிழ்",
};
