"use client";

import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const OPTIONS: { id: Locale; label: string }[] = [
  { id: "en", label: "English" },
  { id: "hi", label: "हिंदी" },
  { id: "ta", label: "தமிழ்" },
];

export function GuideLanguageSwitcher({
  locale,
  onChange,
  className,
  label = "Language",
  variant = "default",
}: {
  locale: Locale;
  onChange: (locale: Locale) => void;
  className?: string;
  label?: string;
  variant?: "default" | "start";
}) {
  return (
    <div className={cn("guide-lang-switcher w-full min-w-0", className)}>
      <span
        className={cn(
          "mb-2 block text-[10px] font-bold uppercase tracking-widest",
          variant === "start" ? "text-white/45" : "text-muted"
        )}
      >
        {label}
      </span>
      <div
        className={cn(
          "flex w-full items-center",
          variant === "start" ? "flex-wrap gap-2" : "gap-4"
        )}
        role="group"
        aria-label={label}
      >
        {OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={
              variant === "start"
                ? cn("start-pill", locale === opt.id && "start-pill--invert")
                : cn(
                    "text-[11px] font-bold uppercase tracking-[0.16em] transition-colors",
                    locale === opt.id ? "text-primary" : "text-muted hover:text-foreground"
                  )
            }
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
