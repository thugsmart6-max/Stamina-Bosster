"use client";

import { BrandWordmark } from "@/components/brand-wordmark";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { AuthUser } from "@/lib/types";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

export function DashboardShell({
  user,
  children,
}: {
  user: AuthUser;
  children: ReactNode;
}) {
  const t = useTranslations("dashboard");

  return (
    <div
      data-dashboard-shell="true"
      className="start-app start-shell relative min-h-[100dvh] bg-[var(--paper)]"
    >
      <div className="relative mx-auto flex min-h-[100dvh] max-w-[90rem] flex-col lg:flex-row">
        <aside className="hidden w-64 shrink-0 border-r border-foreground/10 bg-[var(--paper)] p-6 lg:flex lg:flex-col">
          <BrandWordmark className="mb-10" />
          <DashboardNav />
          <div className="mt-auto border-t border-foreground/10 pt-6">
            <p className="start-kicker">{t("profileLabel")}</p>
            <p className="mt-3 truncate text-sm font-semibold text-foreground">
              {user.fullName}
            </p>
            <p className="truncate text-xs text-muted">{user.email}</p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 bg-[var(--paper)]/92 px-4 py-4 backdrop-blur-md md:px-8">
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <div className="min-w-0 lg:hidden">
                <BrandWordmark />
              </div>
              <p className="hidden start-kicker lg:block">{t("eyebrow")}</p>
              <LanguageSwitcher />
            </div>
            <div className="mt-4 border-t border-foreground/10 pt-3 lg:hidden">
              <DashboardNav compact />
            </div>
            <div className="mt-4 h-px w-full bg-foreground/15" />
          </header>

          <main className="flex-1 px-4 py-8 md:px-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
