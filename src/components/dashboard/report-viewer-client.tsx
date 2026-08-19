"use client";

import { DownloadReportButton } from "@/components/download-report-button";
import { GuideLanguageSwitcher } from "@/components/guide-language-switcher";
import { PerformanceGuideHtml } from "@/components/performance-guide-html";
import { UserProfileSummary } from "@/components/user-profile-summary";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { IntakeData, PlanResult } from "@/lib/types";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type ReportPayload = {
  orderId: string;
  name: string;
  createdAt: string;
  intake: IntakeData;
  plan: PlanResult;
};

export function ReportViewerClient({ orderId }: { orderId: string }) {
  const uiLocale = useLocale() as Locale;
  const t = useTranslations("reportHtml");
  const listT = useTranslations("dashboard.reports");
  const authT = useTranslations("auth");
  const [guideLocale, setGuideLocale] = useState<Locale>(uiLocale);
  const [data, setData] = useState<ReportPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/reports/${orderId}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((payload: ReportPayload) => setData(payload))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-[480px] w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-foreground/10 p-8 text-center">
        <p className="text-sm text-muted">{t("loadError")}</p>
        <Link href="/dashboard/reports" className="mt-6 inline-block">
          <Button variant="outline">{listT("backToList")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/dashboard/reports"
            className="text-xs font-bold uppercase tracking-widest text-primary hover:underline"
          >
            ← {listT("backToList")}
          </Link>
          <h1 className="display-heading mt-2 text-2xl text-foreground md:text-3xl">
            {data.name}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {new Date(data.createdAt).toLocaleDateString()} · {t("fullReport")}
          </p>
        </div>
        <DownloadReportButton
          orderId={orderId}
          locale={guideLocale}
          label={authT("download")}
          size="lg"
          className="shrink-0"
        />
      </div>

      <GuideLanguageSwitcher locale={guideLocale} onChange={setGuideLocale} />

      <UserProfileSummary
        intake={data.intake}
        plan={data.plan}
        locale={guideLocale}
      />

      <div className="space-y-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#c4921a]">
          {t("completeGuide")}
        </p>
        <PerformanceGuideHtml locale={guideLocale} />
      </div>
    </div>
  );
}
