"use client";

import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function SiteFooter() {
  const t = useTranslations("footer");
  const legal = useTranslations("legal");
  const common = useTranslations("common");
  const nav = useTranslations("nav");
  const router = useRouter();
  const [email, setEmail] = useState("");

  function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    const next = email.trim()
      ? `/signup?email=${encodeURIComponent(email.trim())}`
      : "/signup";
    router.push(next);
  }

  return (
    <footer className="style-night start-shell mt-auto">
      <div className="border-t border-white/10 px-4 py-12 md:px-10 md:py-24">
        <Link
          href="/signup"
          className="display-heading block max-w-3xl text-3xl sm:text-4xl md:text-6xl lg:text-7xl"
        >
          {t("letsStart")}
        </Link>
        <form
          onSubmit={submitEmail}
          className="mt-10 flex max-w-xl flex-col gap-4 sm:flex-row sm:items-end"
        >
          <label className="block min-w-0 flex-1">
            <span className="sr-only">{t("emailLabel")}</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
              className="footer-cta"
              autoComplete="email"
            />
          </label>
          <button type="submit" className="start-pill start-pill--invert">
            {t("submit")}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 border-t border-white/10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="start-cell">
          <h4 className="text-sm font-medium">{nav("colMove")}</h4>
          <ul className="mt-6">
            <li><Link href="/#studio-hero" className="footer-link">{nav("guide")}</Link></li>
            <li><Link href="/#how" className="footer-link">{common("howItWorks")}</Link></li>
            <li><Link href="/#trap" className="footer-link">{nav("gap")}</Link></li>
          </ul>
        </div>
        <div className="start-cell">
          <h4 className="text-sm font-medium">{nav("colFuel")}</h4>
          <ul className="mt-6">
            <li><Link href="/signup" className="footer-link">{t("start")}</Link></li>
            <li><Link href="/#faq" className="footer-link">{nav("ask")}</Link></li>
          </ul>
        </div>
        <div className="start-cell">
          <h4 className="text-sm font-medium">{nav("colAccount")}</h4>
          <ul className="mt-6">
            <li><Link href="/login" className="footer-link">{nav("login")}</Link></li>
            <li><Link href="/dashboard" className="footer-link">{nav("dashboard")}</Link></li>
            <li><Link href="/privacy" className="footer-link">{t("privacy")}</Link></li>
            <li><Link href="/terms" className="footer-link">{t("terms")}</Link></li>
          </ul>
        </div>
        <div className="start-cell">
          <h4 className="text-sm font-medium">{t("studio")}</h4>
          <p className="mt-6 text-xs leading-relaxed text-white/55">{t("tagline")}</p>
          <p className="mt-6 text-xs leading-relaxed text-white/45">{t("ageNote")}</p>
        </div>
      </div>

      <div className="grid border-t border-white/10 md:grid-cols-2">
        <p className="start-cell text-xs leading-relaxed text-white/45">{legal("disclaimer")}</p>
        <p className="start-cell text-xs text-white/35">
          {t("copyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
