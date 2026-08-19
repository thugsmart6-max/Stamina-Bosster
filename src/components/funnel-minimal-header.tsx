"use client";

import { BrandWordmark } from "@/components/brand-wordmark";
import { LanguageSwitcher } from "@/components/language-switcher";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function FunnelMinimalHeader({
  variant = "paper",
}: {
  variant?: "paper" | "night";
}) {
  const c = useTranslations("common");
  const night = variant === "night";

  return (
    <header
      data-studio-header="true"
      className={cn(
        "sticky top-0 z-50 backdrop-blur-md",
        night ? "start-header--dark" : "bg-[var(--paper)]/92 text-foreground"
      )}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-3 py-3 sm:grid-cols-[1fr_auto_1fr] sm:gap-3 sm:px-4 md:px-8">
        <BrandWordmark className="min-w-0 justify-self-start" />
        <p className="start-pill hidden sm:inline-flex sm:justify-self-center">{c("funnelTrust")}</p>
        <div className="justify-self-end">
          <LanguageSwitcher tone={night ? "night" : "paper"} />
        </div>
      </div>
      <div className={cn("h-px w-full", night ? "bg-white/15" : "bg-foreground/15")} />
    </header>
  );
}
