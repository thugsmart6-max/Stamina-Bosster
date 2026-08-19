"use client";

import { AppIcon } from "@/components/app-icon";
import { useTranslations } from "next-intl";

export function DemoCheckoutBanner() {
  const t = useTranslations("checkout");

  return (
    <div
      role="status"
      className="flex items-start gap-3 rounded-2xl border border-warning/40 bg-warning/10 px-4 py-3 text-warning"
    >
      <AppIcon name="warning" size={22} className="mt-0.5 shrink-0" />
      <div>
        <p className="font-bold uppercase tracking-wide">{t("demoBannerTitle")}</p>
        <p className="text-sm text-white/80">{t("demoBannerBody")}</p>
      </div>
    </div>
  );
}
