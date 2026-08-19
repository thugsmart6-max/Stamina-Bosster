"use client";

import { AppIcon } from "@/components/app-icon";
import { useTranslations } from "next-intl";

/** Shown when `PAYMENT_MODE=demo` — informational, not an error. */
export function DemoCheckoutBanner() {
  const t = useTranslations("checkout");

  return (
    <div
      role="status"
      className="flex items-start gap-3 rounded-2xl border border-accent/25 bg-accent/[0.07] px-4 py-3.5 text-foreground/90"
    >
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
        <AppIcon name="shield" size={18} />
      </span>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">{t("demoBannerTitle")}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{t("demoBannerBody")}</p>
      </div>
    </div>
  );
}
