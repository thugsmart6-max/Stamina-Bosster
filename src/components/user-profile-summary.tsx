"use client";

import type { Locale } from "@/i18n/routing";
import { getLocalizedGuideContent } from "@/lib/performance-guide-locale";
import {
  formatBmiLine,
  formatSexLabel,
  getProfileWarnings,
} from "@/lib/profile-summary";
import { erectionQualityLabel, goalLabel } from "@/lib/pdf/copy";
import type { IntakeData, PlanResult } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function UserProfileSummary({
  intake,
  plan,
  locale,
  className,
  variant = "default",
}: {
  intake: IntakeData;
  plan: PlanResult;
  locale: Locale;
  className?: string;
  variant?: "default" | "start";
}) {
  const guide = getLocalizedGuideContent(locale);
  const t = useTranslations("intake");
  const warnings = getProfileWarnings(intake, guide.profile);
  const quality = erectionQualityLabel(locale, intake.erectionQuality ?? "mixed");
  const goal = goalLabel(locale, intake.goal);

  if (variant === "start") {
    const cells = [
      { label: guide.profile.name, value: intake.name },
      { label: guide.profile.age, value: String(intake.age) },
      { label: guide.profile.gender, value: formatSexLabel(intake.sex, guide.profile) },
      { label: guide.profile.bmi, value: formatBmiLine(plan) },
      { label: t("goal"), value: goal },
      { label: t("erectionQuality"), value: quality },
    ];

    return (
      <section className={cn("style-paper start-shell", className)}>
        <div className="grid border-b border-foreground/10 md:grid-cols-2">
          <div className="px-5 py-12 md:px-10">
            <p className="start-kicker flex items-center gap-3">
              <span aria-hidden>02</span>
              {guide.profile.title}
            </p>
            <h2 className="display-heading mt-4 max-w-lg text-3xl md:text-5xl">
              {guide.profile.title}
            </h2>
          </div>
          <div className="border-t border-foreground/10 px-5 py-12 md:border-l md:border-t-0 md:px-10">
            <p className="max-w-md text-sm leading-relaxed text-muted">
              {plan.introParagraph}
            </p>
          </div>
        </div>
        <div className="start-grid grid sm:grid-cols-2 lg:grid-cols-3">
          {cells.map((cell) => (
            <div key={cell.label} className="start-cell">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
                {cell.label}
              </p>
              <p className="mt-2 text-base font-medium text-foreground">{cell.value}</p>
            </div>
          ))}
        </div>
        {warnings.length > 0 ? (
          <ul className="start-grid">
            {warnings.map((w) => (
              <li key={w} className="start-cell text-sm leading-relaxed text-primary">
                {w}
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    );
  }

  return (
    <div
      className={cn(
        "border-b border-foreground/10 bg-transparent p-4 sm:p-5 md:p-6",
        className
      )}
    >
      <p className="start-kicker">{guide.profile.title}</p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ProfileRow label={guide.profile.name} value={intake.name} />
        <ProfileRow label={guide.profile.age} value={String(intake.age)} />
        <ProfileRow
          label={guide.profile.gender}
          value={formatSexLabel(intake.sex, guide.profile)}
        />
        <ProfileRow label={guide.profile.bmi} value={formatBmiLine(plan)} />
      </div>
      {warnings.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {warnings.map((w) => (
            <li
              key={w}
              className="rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning"
            >
              ⚠️ {w}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-foreground/10 px-0 py-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted">{label}</p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
