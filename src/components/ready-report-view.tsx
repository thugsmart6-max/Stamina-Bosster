"use client";

import { AppIcon } from "@/components/app-icon";
import { ReadinessRing } from "@/components/readiness-ring";
import { Link } from "@/i18n/navigation";
import type { IconName } from "@/lib/icons";
import type { PlanResult } from "@/lib/types";
import { useTranslations } from "next-intl";

const INCLUDE_ICONS: IconName[] = ["exercise", "nutrition", "practice"];

export function ReadyReportView({
  plan,
  wellnessIndex,
  categoryLabel,
  readinessBandLabel,
}: {
  plan: PlanResult;
  wellnessIndex: number;
  categoryLabel: string;
  readinessBandLabel: string;
}) {
  const t = useTranslations("preview");
  const p = useTranslations("pricing");
  const includes = [0, 1, 2].map((i) => ({
    title: t(`readyIncludes.${i}.title`),
    body: t(`readyIncludes.${i}.body`),
    icon: INCLUDE_ICONS[i],
  }));

  return (
    <div className="preview-page pb-[max(6.5rem,env(safe-area-inset-bottom))]">
      <div className="start-split start-grid">
        <header className="style-night flex flex-col justify-end px-6 py-10 md:px-10 md:py-14">
          <p className="start-kicker">{t("readyEyebrow")}</p>
          <h1 className="display-heading mt-4 text-balance text-[clamp(2rem,5vw,3.5rem)] leading-[0.95]">
            {t("readyTitle")}
          </h1>
          <p className="mt-4 max-w-md text-pretty text-sm leading-relaxed text-white/65 md:text-base">
            {t("readyBody")}
          </p>
          <Link href="/checkout" className="start-link mt-8 hidden text-white sm:inline-flex">
            {t("readyCta")} ↗
          </Link>
        </header>

        <div className="style-paper">
          <div className="grid sm:grid-cols-2">
            <div className="start-cell">
              <p className="start-kicker">{t("wellnessIndexTitle")}</p>
              <p className="display-heading mt-4 text-6xl text-foreground">{wellnessIndex}</p>
              <p className="mt-2 text-sm text-muted">{readinessBandLabel}</p>
            </div>
            <div className="start-cell flex flex-col gap-4 sm:flex-row sm:items-start">
              <ReadinessRing score={plan.readinessScore} bandLabel={readinessBandLabel} />
              <div>
                <p className="start-kicker">
                  {t("bmi")} · {categoryLabel}
                </p>
                <p className="display-heading mt-3 text-5xl text-foreground">{plan.bmi}</p>
                {plan.medicalBlock ? (
                  <p className="mt-3 border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-warning">
                    {t("medicalNotice")}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          {plan.introParagraph ? (
            <p className="border-t border-foreground/10 px-6 py-5 text-sm leading-relaxed text-foreground/80 md:px-8">
              {plan.introParagraph}
            </p>
          ) : null}

          <div className="border-t border-foreground/10 px-6 py-8 md:px-8">
            <h2 className="display-heading text-2xl text-foreground">{t("readyIncludesTitle")}</h2>
            <ol className="mt-4">
              {includes.map((item, i) => (
                <li
                  key={item.title}
                  className="grid grid-cols-[3rem_1fr] gap-4 border-b border-foreground/10 py-5"
                >
                  <span className="text-[11px] font-bold tracking-[0.16em] text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="flex items-center gap-2 font-semibold text-foreground">
                      <AppIcon name={item.icon} size={16} className="text-primary" />
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="style-night px-6 py-10 md:px-8">
            <p className="display-heading text-4xl">{p("price")}</p>
            <p className="mt-2 text-sm text-white/65">{t("readyPriceNote")}</p>
            <Link href="/checkout" className="start-pill start-pill--invert mt-6 hidden sm:inline-flex">
              {t("readyCta")}
            </Link>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-foreground/10 bg-[var(--paper)]/95 px-4 py-3 backdrop-blur-md sm:hidden">
        <Link href="/checkout" className="btn-pill flex w-full items-center justify-center gap-2">
          {t("readyCta")}
          <span>· {p("price")}</span>
        </Link>
      </div>
    </div>
  );
}
