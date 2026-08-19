"use client";

import { AppIcon } from "@/components/app-icon";
import { BrandWordmark } from "@/components/brand-wordmark";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { AuthUser } from "@/lib/types";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export function SiteHeaderShell({ user }: { user: AuthUser | null }) {
  const t = useTranslations("nav");
  const c = useTranslations("common");
  const pathname = usePathname();
  const ctaHref = user ? "/start" : "/signup";
  const [open, setOpen] = useState(false);
  const [onDark, setOnDark] = useState(true);

  useEffect(() => {
    const hero = document.getElementById("studio-hero");
    if (!hero) {
      setOnDark(false);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setOnDark(Boolean(entry?.isIntersecting)),
      { threshold: 0.35 }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-300 pt-[env(safe-area-inset-top)]",
          onDark && !open ? "start-header--dark text-white" : "bg-[var(--paper)]/92 text-foreground backdrop-blur-md"
        )}
      >
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-3 py-2.5 sm:grid-cols-[1fr_auto_1fr] sm:gap-3 sm:px-4 sm:py-3 md:px-8">
          <BrandWordmark className="min-w-0 justify-self-start" onClick={close} />

          <Link href="/#faq" className="start-pill hidden min-w-0 max-w-md justify-between lg:inline-flex lg:min-w-[18rem] xl:min-w-[22rem]">
            <span>{t("ask")}</span>
            <AppIcon name="email" size={14} />
          </Link>

          <div className="flex items-center justify-end gap-2 sm:col-start-3">
            <Link href={ctaHref} className="start-pill hidden md:inline-flex">
              {c("getPlan")}
            </Link>
            <button
              type="button"
              className="start-pill shrink-0"
              aria-expanded={open}
              aria-controls="studio-menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? `× ${c("close")}` : `+ ${c("menu")}`}
            </button>
          </div>
        </div>
        <div className="h-px w-full bg-current opacity-15" />
      </header>

      {open ? (
        <div
          id="studio-menu"
          className="fixed inset-0 z-40 overflow-y-auto bg-[var(--paper)] pt-24 text-foreground"
        >
          <div className="mx-auto grid max-w-6xl gap-px border-y border-foreground/10 bg-foreground/10 md:grid-cols-3">
            <nav className="bg-[var(--paper)] p-5 sm:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">01</p>
              <p className="display-heading mt-2 text-2xl">{t("colMove")}</p>
              <ul className="mt-6 space-y-0 text-sm">
                <li className="border-t border-foreground/10 py-3">
                  <Link href="/#studio-hero" onClick={close}>{t("guide")}</Link>
                </li>
                <li className="border-t border-foreground/10 py-3">
                  <Link href="/#how" onClick={close}>{t("how")}</Link>
                </li>
                <li className="border-t border-b border-foreground/10 py-3">
                  <Link href="/#trap" onClick={close}>{t("gap")}</Link>
                </li>
              </ul>
            </nav>
            <nav className="bg-[var(--paper)] p-5 sm:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">02</p>
              <p className="display-heading mt-2 text-2xl">{t("colFuel")}</p>
              <ul className="mt-6 space-y-0 text-sm">
                <li className="border-t border-foreground/10 py-3">
                  <Link href="/#faq" onClick={close}>{t("ask")}</Link>
                </li>
                <li className="border-t border-b border-foreground/10 py-3">
                  <Link href={ctaHref} onClick={close}>
                    {c("getPlan")}
                  </Link>
                </li>
              </ul>
            </nav>
            <nav className="bg-[var(--paper)] p-5 sm:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">03</p>
              <p className="display-heading mt-2 text-2xl">{t("colAccount")}</p>
              <ul className="mt-6 space-y-0 text-sm">
                {user ? (
                  <li className="border-t border-foreground/10 py-3">
                    <Link href="/dashboard" onClick={close}>{t("dashboard")}</Link>
                  </li>
                ) : (
                  <li className="border-t border-foreground/10 py-3">
                    <Link href="/login" onClick={close}>{t("login")}</Link>
                  </li>
                )}
                <li className="border-t border-b border-foreground/10 py-3">
                  <Link href="/privacy" onClick={close}>{t("account")}</Link>
                </li>
              </ul>
              <div className="mt-8">
                <LanguageSwitcher />
              </div>
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}
