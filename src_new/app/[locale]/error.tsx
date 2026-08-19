"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function LocaleError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("notFound");
  const c = useTranslations("common");

  return (
    <div className="start-shell style-paper mx-auto flex min-h-[min(70vh,36rem)] w-full max-w-3xl flex-col justify-center px-6 py-20">
      <p className="start-kicker text-primary">{c("brand")}</p>
      <h1 className="display-heading mt-4 text-3xl text-foreground md:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">{t("body")}</p>
      <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row">
        <button type="button" className="start-pill start-pill--invert" onClick={reset}>
          {t("home")}
        </button>
        <Link href="/" className="start-pill">
          {t("start")}
        </Link>
      </div>
    </div>
  );
}
