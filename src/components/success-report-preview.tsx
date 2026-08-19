"use client";

import { DownloadReportButton } from "@/components/download-report-button";
import { GuideLanguageSwitcher } from "@/components/guide-language-switcher";
import { PerformanceGuideHtml } from "@/components/performance-guide-html";
import { UserProfileSummary } from "@/components/user-profile-summary";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { IntakeData, PlanResult } from "@/lib/types";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { SuccessOrderConfirm } from "@/components/success-client";
import { PaymentCelebrate } from "@/components/payment-celebrate";

type ReportPayload = {
  orderId: string;
  name: string;
  intake: IntakeData;
  plan: PlanResult;
};

function languageLabel(locale: Locale) {
  if (locale === "hi") return "हिंदी";
  if (locale === "ta") return "தமிழ்";
  return "English";
}

export function SuccessReportPreview({
  orderId,
  showDemoNotice = false,
}: {
  orderId: string;
  showDemoNotice?: boolean;
}) {
  const uiLocale = useLocale() as Locale;
  const t = useTranslations("success");
  const [guideLocale, setGuideLocale] = useState<Locale>(uiLocale);
  const [data, setData] = useState<ReportPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/reports/${orderId}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((payload: ReportPayload) => setData(payload))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [orderId]);

  const langLabel = languageLabel(guideLocale);

  return (
    <div className="success-page start-shell">
      <PaymentCelebrate orderId={orderId} />
      <SuccessOrderConfirm orderId={orderId} />

      <section className="style-night">
        <div className="start-split start-grid">
          <header className="px-4 py-10 sm:px-8 md:px-10 md:py-16 lg:sticky lg:top-[4.75rem] lg:min-h-[calc(100dvh-4.75rem)]">
            <p className="start-kicker flex items-center gap-3 text-primary">
              <span aria-hidden>01</span>
              {t("previewBadge")}
            </p>
            <h1 className="display-heading mt-5 max-w-[12ch] text-balance text-[clamp(2.4rem,7vw,5.6rem)] leading-[0.88] text-[var(--paper)]">
              {t("title")}
            </h1>
            <p className="mt-5 max-w-sm text-pretty text-sm leading-relaxed text-white/65 md:text-base">
              {t("subtitle")}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <DownloadReportButton
                orderId={orderId}
                locale={guideLocale}
                label={t("downloadInLanguage", { language: langLabel })}
                look="start"
                redirectToDashboard
              />
              <Link href="/dashboard" className="start-pill inline-flex justify-center">
                {t("openDashboard")}
              </Link>
            </div>
          </header>

          <div className="flex flex-col justify-end border-t border-white/10 px-5 py-12 sm:px-8 md:px-10 md:py-16 lg:border-t-0">
            <p className="start-kicker text-white/45">{t("orderRef")}</p>
            <p className="mt-4 break-all font-mono text-sm leading-relaxed text-[var(--paper)]">
              {orderId}
            </p>
            <p className="mt-8 start-kicker text-white/45">{t("previewTitle")}</p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/65">
              {t("previewBody")}
            </p>
            <div className="mt-6">
              <GuideLanguageSwitcher
                locale={guideLocale}
                onChange={setGuideLocale}
                variant="start"
              />
            </div>
            {showDemoNotice ? (
              <p className="mt-8 text-xs leading-relaxed text-white/45">{t("demoNotice")}</p>
            ) : null}
          </div>
        </div>
      </section>

      {loading ? (
        <p className="style-paper px-5 py-20 text-sm text-muted md:px-10">
          {t("loadingPreview")}
        </p>
      ) : data ? (
        <>
          <UserProfileSummary
            intake={data.intake}
            plan={data.plan}
            locale={guideLocale}
            variant="start"
          />
          <PerformanceGuideHtml locale={guideLocale} variant="start" />
        </>
      ) : (
        <p className="style-paper px-5 py-20 text-sm text-muted md:px-10">
          {t("previewUnavailable")}
        </p>
      )}

      <div className="style-paper start-grid">
        <div className="start-cell flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="start-pill inline-flex justify-center">
            {t("backHome")}
          </Link>
          <Link href="/preview" className="start-pill inline-flex justify-center">
            {t("openPreview")}
          </Link>
        </div>
      </div>

      <div className="success-report__mobile-cta sticky bottom-0 z-20 border-t border-white/10 bg-[var(--night)] p-3 md:hidden">
        <DownloadReportButton
          orderId={orderId}
          locale={guideLocale}
          label={t("downloadInLanguage", { language: langLabel })}
          look="start"
          className="w-full"
          redirectToDashboard
        />
      </div>
    </div>
  );
}
