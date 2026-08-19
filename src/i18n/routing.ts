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

/** Strip one or more leading `/en|hi|ta` segments so language links stay locale-free. */
export function stripLocalePrefixes(pathname: string): string {
  let path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  let changed = true;
  while (changed) {
    changed = false;
    for (const locale of locales) {
      if (path === `/${locale}` || path === `/${locale}/`) return "/";
      if (path.startsWith(`/${locale}/`)) {
        path = path.slice(locale.length + 1);
        if (!path.startsWith("/")) path = `/${path}`;
        changed = true;
        break;
      }
    }
  }
  return path || "/";
}
