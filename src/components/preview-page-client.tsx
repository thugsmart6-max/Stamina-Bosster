"use client";

import { GuideLanguageSwitcher } from "@/components/guide-language-switcher";
import { PerformanceGuideHtml } from "@/components/performance-guide-html";
import { UserProfileSummary } from "@/components/user-profile-summary";
import type { Locale } from "@/i18n/routing";
import { PdfShowcase } from "@/components/pdf-showcase";
import { PlanPreviewCards } from "@/components/plan-preview-cards";
import { ReadyReportView } from "@/components/ready-report-view";
import { ReadinessRing } from "@/components/readiness-ring";
import { Link } from "@/i18n/navigation";
import { track } from "@/lib/analytics";
import type { IntakeData, PlanResult } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState, type ReactNode } from "react";

function PreviewBand({
  num,
  eyebrow,
  title,
  description,
  tone = "paper",
  children,
}: {
  num: string;
  eyebrow: string;
  title: string;
  description?: string;
  tone?: "paper" | "field" | "night";
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "start-shell",
        tone === "night" ? "style-night" : tone === "field" ? "style-field" : "style-paper"
      )}
    >
      <header className="px-4 py-10 md:px-10 md:py-14">
        <p className={cn("start-kicker flex items-center gap-3", tone === "night" && "text-primary")}>
          <span aria-hidden>{num}</span>
          {eyebrow}
        </p>
        <h2 className="display-heading mt-4 max-w-3xl text-3xl md:text-5xl">{title}</h2>
        {description ? (
          <p
            className={cn(
              "mt-4 max-w-xl text-sm leading-relaxed",
              tone === "night" ? "text-white/60" : "text-muted"
            )}
          >
            {description}
          </p>
        ) : null}
      </header>
      <div className={tone === "night" ? "border-t border-white/10" : "border-t border-foreground/10"}>
        {children}
      </div>
    </section>
  );
}

export function PreviewPageClient({ unlocked = true }: { unlocked?: boolean }) {
  const uiLocale = useLocale() as Locale;
  const t = useTranslations("preview");
  const planPreviewT = useTranslations("planPreview");
  const bmiT = useTranslations("bmiCategories");
  const [plan, setPlan] = useState<PlanResult | null>(null);
  const [intake, setIntake] = useState<IntakeData | null>(null);
  const [guideLocale, setGuideLocale] = useState<Locale>(uiLocale);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [intakeActivity, setIntakeActivity] = useState<IntakeData["activity"] | undefined>();

  useEffect(() => {
    let cancelled = false;

    const loadFromStorage = () => {
      try {
        const raw = sessionStorage.getItem("vp_plan");
        if (raw) setPlan(JSON.parse(raw) as PlanResult);

        const intakeRaw = sessionStorage.getItem("vp_intake");
        if (intakeRaw) {
          const parsedIntake = JSON.parse(intakeRaw) as IntakeData;
          setIntake(parsedIntake);
          setIntakeActivity(parsedIntake.activity);
        }
      } catch {
        setIntakeActivity(undefined);
      }
    };

    loadFromStorage();
    track("preview_viewed");

    const loadFromApi = async () => {
      if (sessionStorage.getItem("vp_plan")) return;
      try {
        const res = await fetch("/api/intake/latest");
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as {
          session?: { plan?: PlanResult; intake?: IntakeData } | null;
        };
        if (!data.session?.plan) return;
        setPlan(data.session.plan);
        sessionStorage.setItem("vp_plan", JSON.stringify(data.session.plan));
        if (data.session.intake) {
          setIntake(data.session.intake);
          setIntakeActivity(data.session.intake.activity);
          sessionStorage.setItem("vp_intake", JSON.stringify(data.session.intake));
        }
      } catch {
        /* ignore */
      }
    };

    void (async () => {
      await loadFromApi();
      if (cancelled) return;

      const planRaw = sessionStorage.getItem("vp_plan");
      const intakeRaw = sessionStorage.getItem("vp_intake");
      const sessionId = sessionStorage.getItem("vp_session");
      const payload =
        planRaw && intakeRaw
          ? {
              plan: JSON.parse(planRaw) as PlanResult,
              intake: JSON.parse(intakeRaw),
              sessionId: sessionId ?? undefined,
            }
          : {};

      if (!unlocked) {
        if (!cancelled) setPdfLoading(false);
        return;
      }

      fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(async (res) => {
          if (!res.ok) return;
          const blob = await res.blob();
          setPreviewUrl(URL.createObjectURL(blob));
        })
        .catch(() => {})
        .finally(() => setPdfLoading(false));
    })();

    return () => {
      cancelled = true;
    };
  }, [unlocked]);

  if (!plan) {
    return (
      <div className="start-split start-grid min-h-[70vh]">
        <div className="style-night flex flex-col justify-end px-8 py-14 md:px-12">
          <p className="start-kicker">01</p>
          <h1 className="display-heading mt-4 text-4xl md:text-6xl">{t("noPlan")}</h1>
        </div>
        <div className="style-paper flex flex-col justify-center px-8 py-14 md:px-12">
          <p className="max-w-sm text-sm leading-relaxed text-muted">{t("completeFirst")}</p>
          <Link href="/start" className="start-pill mt-8 inline-flex w-fit">
            {t("start")}
          </Link>
        </div>
      </div>
    );
  }

  const categoryLabel =
    bmiT(plan.bmiCategory as "underweight" | "normal" | "overweight" | "obese") ??
    plan.bmiCategory;

  const readinessBandLabel =
    plan.readinessScore <= 4
      ? t("readinessBandLow")
      : plan.readinessScore <= 7
        ? t("readinessBandMid")
        : t("readinessBandHigh");

  const wellnessIndex = Math.round(Math.min(100, Math.max(0, plan.readinessScore * 10)));

  const habitBar =
    intakeActivity === "sedentary"
      ? 42
      : intakeActivity === "light"
        ? 55
        : intakeActivity === "moderate"
          ? 72
          : intakeActivity === "active"
            ? 88
            : 58;

  const nutritionBar =
    plan.dietVariantKey === "normal" ? 82 : plan.dietVariantKey === "underweight" ? 68 : 74;

  if (!unlocked) {
    return (
      <ReadyReportView
        plan={plan}
        wellnessIndex={wellnessIndex}
        categoryLabel={categoryLabel}
        readinessBandLabel={readinessBandLabel}
      />
    );
  }

  const pillars = [
    { label: t("pillarReadiness"), pct: wellnessIndex, style: "pillar-move" },
    { label: t("pillarHabits"), pct: habitBar, style: "pillar-fuel" },
    { label: t("pillarNutrition"), pct: nutritionBar, style: "pillar-recover" },
  ];

  return (
    <div className="start-shell">
      <header className="style-night px-4 pb-16 pt-10 md:px-10 md:pb-24 md:pt-16">
        <Link href="/dashboard" className="start-link text-white/80">
          {t("backToDashboard")} ↗
        </Link>
        <p className="start-kicker mt-10">01</p>
        <h1 className="display-heading mt-4 max-w-3xl text-4xl leading-[0.95] md:text-6xl lg:text-7xl">
          {t("title1")}
        </h1>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-white/60 md:text-base">
          {t("subtitle")}
        </p>
      </header>

      <PreviewBand
        num="02"
        eyebrow={t("wellnessIndexTitle")}
        title={t("wellnessIndexTitle")}
        description={t("wellnessIndexHint")}
      >
        <div className="start-split">
          <div className="px-4 py-10 md:px-10 md:py-14">
            <p className="display-heading text-7xl md:text-8xl">{wellnessIndex}</p>
            <p className="mt-3 text-sm text-muted">{readinessBandLabel}</p>
          </div>
          <div>
            {pillars.map((row, i) => (
              <div
                key={row.label}
                className={cn(
                  "grid grid-cols-[3rem_1fr] gap-4 border-b border-foreground/10 px-4 py-6 md:px-8",
                  row.style
                )}
              >
                <span className="pillar-num text-[11px] font-bold tracking-[0.16em]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span>{row.label}</span>
                    <span className="tabular-nums text-muted">{row.pct}</span>
                  </div>
                  <div className="h-px bg-foreground/10">
                    <div
                      className="h-px bg-current transition-all duration-700"
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PreviewBand>

      <PreviewBand num="03" eyebrow={t("bmi")} title={t("title1")} description={plan.introParagraph}>
        <div className="grid md:grid-cols-2">
          <div className="start-cell flex items-center gap-6">
            <ReadinessRing score={plan.readinessScore} bandLabel={readinessBandLabel} />
            <div>
              <p className="start-kicker">{readinessBandLabel}</p>
              <p className="display-heading mt-3 text-5xl">{plan.readinessScore}</p>
            </div>
          </div>
          <div className="start-cell">
            <p className="start-kicker">
              {t("bmi")} · {categoryLabel}
            </p>
            <p className="display-heading mt-4 text-6xl">{plan.bmi}</p>
            {plan.medicalBlock ? (
              <p className="mt-4 border border-warning/30 bg-warning/10 px-3 py-2 text-sm text-warning">
                {t("medicalNotice")}
              </p>
            ) : null}
          </div>
        </div>
      </PreviewBand>

      <PreviewBand
        num="04"
        eyebrow={planPreviewT("exercises")}
        title={t("sectionPlanTitle")}
        description={t("sectionPlanBody")}
      >
        <div className="px-4 py-8 md:px-10 md:py-12">
          <PlanPreviewCards plan={plan} />
        </div>
      </PreviewBand>

      <PreviewBand
        num="05"
        eyebrow={t("performanceGuideBadge")}
        title={t("performanceGuideTitle")}
        description={t("performanceGuideNote")}
        tone="field"
      >
        <div className="border-b border-foreground/10 px-4 py-5 md:px-10">
          <GuideLanguageSwitcher locale={guideLocale} onChange={setGuideLocale} />
        </div>
        <div className="space-y-0">
          {intake && plan ? (
            <UserProfileSummary
              intake={intake}
              plan={plan}
              locale={guideLocale}
              className="rounded-none border-0 border-b border-foreground/10 bg-transparent"
            />
          ) : null}
          <div className="px-4 py-8 md:px-10">
            <PerformanceGuideHtml locale={guideLocale} className="border-0 shadow-none" />
          </div>
        </div>
      </PreviewBand>

      <PreviewBand
        num="06"
        eyebrow={t("pdfTeaserTitle")}
        title={t("pdfPreview")}
        description={t("pdfShowcaseBody")}
        tone="night"
      >
        <PdfShowcase
          plan={plan}
          intake={intake}
          previewUrl={previewUrl}
          loading={pdfLoading}
          wellnessIndex={wellnessIndex}
          categoryLabel={categoryLabel}
        />
        <div className="border-t border-white/10 px-4 py-10 md:px-10">
          <p className="display-heading text-2xl md:text-4xl">{t("unlockedSectionTitle")}</p>
          <p className="mt-3 max-w-xl text-sm text-white/60">{t("unlockedSectionSubtitle")}</p>
          <Link href="/dashboard" className="start-pill start-pill--invert mt-8 inline-flex">
            {t("goToDashboard")}
          </Link>
        </div>
      </PreviewBand>
    </div>
  );
}
