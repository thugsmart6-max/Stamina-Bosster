"use client";

import { AppIcon } from "@/components/app-icon";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function StickyPreviewCta({ medicalBlock }: { medicalBlock?: boolean }) {
  const t = useTranslations("preview");
  const c = useTranslations("common");
  const p = useTranslations("pricing");

  if (medicalBlock) {
    return (
      <div className="sticky bottom-0 z-40 border-t border-white/10 bg-background/95 px-4 py-4 backdrop-blur-md">
        <p className="mb-3 flex items-center justify-center gap-2 text-center text-sm text-warning">
          <AppIcon name="medical" size={18} />
          {t("medicalWarning")}
        </p>
        <Link href="/checkout" className="block">
          <Button variant="outline" className="w-full gap-2" size="lg">
            <AppIcon name="shield" size={18} />
            {t("continuePurchase")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="sticky bottom-0 z-40 border-t border-white/10 bg-background/95 px-4 py-4 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold text-white">
            <AppIcon name="pdf" size={18} className="text-primary" />
            {t("unlockCta", { price: p("price") })}
          </p>
          <ul className="mt-1 hidden space-y-1 text-xs text-muted sm:block">
            <li className="flex items-center gap-2">
              <AppIcon name="check" size={14} className="text-primary" />
              {t("noWatermark")}
            </li>
            <li className="flex items-center gap-2">
              <AppIcon name="email" size={14} className="text-primary" />
              {t("emailDelivery")}
            </li>
            <li className="flex items-center gap-2">
              <AppIcon name="exercise" size={14} className="text-primary" />
              {t("allPages")}
            </li>
          </ul>
        </div>
        <Link href="/checkout" className="shrink-0">
          <Button variant="pill" size="lg" className="w-full gap-2 sm:w-auto">
            {c("getPlan")}
            <AppIcon name="ctaArrow" size={18} className="text-accent-foreground" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
