"use client";

import {
  localeLabels,
  locales,
  stripLocalePrefixes,
  type Locale,
} from "@/i18n/routing";
import { usePathname, Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({
  tone = "paper",
}: {
  tone?: "paper" | "night";
}) {
  const locale = useLocale() as Locale;
  const t = useTranslations("nav");
  const pathname = stripLocalePrefixes(usePathname());

  return (
    <div
      className="flex items-center gap-2 sm:gap-3"
      role="navigation"
      aria-label={t("language")}
    >
      {locales.map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          className={cn(
            "text-[11px] font-bold uppercase tracking-[0.16em] transition-colors",
            l === locale
              ? "text-primary"
              : tone === "night"
                ? "text-white/45 hover:text-white"
                : "text-muted hover:text-foreground"
          )}
        >
          {localeLabels[l]}
        </Link>
      ))}
    </div>
  );
}
