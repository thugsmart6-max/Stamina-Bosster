"use client";

import { BrandWordmark } from "@/components/brand-wordmark";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function SiteNotFound() {
  const t = useTranslations("notFound");

  return (
    <section
      className="start-shell site-404 relative w-full"
      role="alert"
      aria-labelledby="site-404-title"
    >
      <div className="start-split start-grid min-h-[min(80vh,42rem)]">
        <div className="start-dark flex flex-col justify-end px-8 py-12 md:px-12">
          <BrandWordmark className="mb-10 text-white" />
          <p className="display-heading text-6xl text-primary md:text-8xl">404</p>
        </div>
        <div className="flex flex-col justify-center bg-[#fffbf6] px-8 py-12 md:px-12">
          <p className="start-kicker">01</p>
          <h1
            id="site-404-title"
            className="display-heading mt-4 max-w-lg text-3xl tracking-tight text-foreground md:text-4xl"
          >
            {t("title")}
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted md:text-base">
            {t("body")}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/" className="start-pill bg-accent text-accent-foreground">
              {t("home")}
            </Link>
            <Link href="/signup" className="start-pill">
              {t("start")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
