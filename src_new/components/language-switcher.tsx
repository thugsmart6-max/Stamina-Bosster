"use client";

import { localeLabels, locales, type Locale } from "@/i18n/routing";
import { usePathname, Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();

  return (
    <div
      className="flex rounded-full border border-soft/20 bg-surface-elevated/95 p-1 shadow-lg backdrop-blur-md"
      role="navigation"
      aria-label="Language"
    >
      {locales.map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
            l === locale
              ? "bg-primary text-foreground"
              : "text-muted hover:text-foreground"
          )}
        >
          {localeLabels[l]}
        </Link>
      ))}
    </div>
  );
}
