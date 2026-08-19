"use client";

import { AppIcon } from "@/components/app-icon";
import type { IconName } from "@/lib/icons";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const NAV_ITEMS: { href: string; icon: IconName; key: string }[] = [
  { href: "/dashboard", icon: "stepPreview", key: "home" },
  { href: "/dashboard/reports", icon: "pdf", key: "reports" },
  { href: "/dashboard/settings", icon: "lock", key: "settings" },
];

export function DashboardNav({ compact }: { compact?: boolean }) {
  const pathname = usePathname();
  const t = useTranslations("dashboard.nav");

  return (
    <nav
      className={cn(
        "flex gap-1",
        compact ? "flex-row flex-wrap" : "flex-col"
      )}
      aria-label={t("label")}
    >
      {NAV_ITEMS.map((item, i) => {
        const active =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 border-b border-foreground/10 py-3 text-sm transition-colors",
              compact && "shrink-0 border-b-0 px-2.5 py-2 sm:px-3",
              active ? "text-primary" : "text-muted hover:text-foreground"
            )}
          >
            {!compact ? (
              <span className="w-7 text-[10px] font-bold tracking-[0.16em] text-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
            ) : null}
            <AppIcon name={item.icon} size={16} />
            <span className={compact ? "text-xs" : undefined}>{t(item.key)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
