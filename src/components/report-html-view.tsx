"use client";

import { AppIcon } from "@/components/app-icon";
import { getExercise, getFood } from "@/lib/i18n-content";
import type { Locale } from "@/i18n/routing";
import type { IntakeData, PlanResult } from "@/lib/types";
import { getMediaUrl } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import copyData from "../../data/copy.json";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

export function ReportHtmlView({
  intake,
  plan,
  orderId,
  watermark = false,
}: {
  intake: IntakeData;
  plan: PlanResult;
  orderId?: string;
  watermark?: boolean;
}) {
  const locale = useLocale() as Locale;
  const t = useTranslations("reportHtml");
  const bmiT = useTranslations("bmiCategories");

  const dietText =
    copyData.dietVariants[plan.dietVariantKey] ?? copyData.dietVariants.normal;
  const timeline = copyData.timeline[plan.timelineKey];
  const exercises = plan.exerciseIds
    .map((id) => getExercise(id, locale))
    .filter(Boolean);
  const eatFoods = plan.eatFoodIds
    .map((id) => getFood(id, locale))
    .filter((f) => f?.type === "eat");
  const limitFoods = plan.limitFoodIds
    .map((id) => getFood(id, locale))
    .filter((f) => f?.type === "limit");

  const categoryLabel =
    bmiT(plan.bmiCategory as "underweight" | "normal" | "overweight" | "obese") ??
    plan.bmiCategory;

  const habits = [
    t("habitSleep"),
    t("habitExercise"),
    t("habitAlcohol"),
    t("habitMood"),
  ];

  return (
    <article className="report-html relative overflow-hidden rounded-2xl border border-foreground/10 bg-surface">
      {watermark ? (
        <div
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
          aria-hidden
        >
          <span className="-rotate-[24deg] select-none text-5xl font-black uppercase tracking-[0.35em] text-foreground/[0.06] sm:text-7xl">
            {t("watermark")}
          </span>
        </div>
      ) : null}

      <header className="relative border-b border-foreground/10 bg-gradient-to-br from-primary/20 via-surface to-background px-6 py-10 md:px-10 md:py-12">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#c4921a]">
          {copyData.brand}
        </p>
        <h1 className="display-heading mt-2 text-3xl text-foreground md:text-4xl">
          {t("coverTitle")}
        </h1>
        <p className="mt-1 text-sm text-muted">{t("coverSubtitle")}</p>
        <dl className="mt-6 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted">{t("preparedFor")}</dt>
            <dd className="font-semibold text-foreground">{intake.name}</dd>
          </div>
          <div>
            <dt className="text-muted">{t("date")}</dt>
            <dd className="font-semibold text-foreground">{formatDate()}</dd>
          </div>
        </dl>
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-foreground/85">
          {plan.introParagraph}
        </p>
      </header>

      <section className="border-b border-foreground/10 px-6 py-8 md:px-10">
        <h2 className="report-section-title">{t("profileTitle")}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: t("age"), value: String(intake.age) },
            { label: t("bmi"), value: `${plan.bmi} (${categoryLabel})` },
            { label: t("goal"), value: intake.goal.replace(/_/g, " ") },
            {
              label: t("readiness"),
              value: `${plan.readinessScore}/10`,
            },
            { label: t("activity"), value: intake.activity.replace(/_/g, " ") },
          ].map((row) => (
            <div
              key={row.label}
              className="rounded-xl border border-foreground/10 bg-foreground/[0.03] px-4 py-3"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted">
                {row.label}
              </p>
              <p className="mt-1 text-sm font-semibold capitalize text-foreground">{row.value}</p>
            </div>
          ))}
        </div>

        {plan.medicalBlock ? (
          <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-4">
            <p className="text-sm font-bold text-amber-900">{copyData.medicalBlock.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-amber-800">
              {copyData.medicalBlock.body}
            </p>
          </div>
        ) : null}
      </section>

      <section className="border-b border-foreground/10 px-6 py-8 md:px-10">
        <h2 className="report-section-title flex items-center gap-2">
          <AppIcon name="exercise" size={20} className="text-primary" />
          {t("exerciseTitle")}
        </h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {exercises.map((ex) =>
            ex ? (
              <div
                key={ex.id}
                className="overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/[0.03]"
              >
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={getMediaUrl(ex.imageKey)}
                    alt={ex.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-foreground">{ex.title}</h3>
                  <ul className="mt-2 space-y-1 text-sm text-foreground/80">
                    {ex.steps.map((step, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-primary">•</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[#c4921a]">
                    {ex.frequency}
                  </p>
                </div>
              </div>
            ) : null
          )}
        </div>
      </section>

      <section className="border-b border-foreground/10 px-6 py-8 md:px-10">
        <h2 className="report-section-title flex items-center gap-2">
          <AppIcon name="nutrition" size={20} className="text-accent" />
          {t("nutritionTitle")}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">{dietText}</p>

        <h3 className="mt-8 text-xs font-bold uppercase tracking-widest text-primary">
          {t("eatMore")}
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {eatFoods.map((food) =>
            food ? (
              <div
                key={food.id}
                className="flex gap-3 rounded-xl border border-foreground/10 bg-foreground/[0.03] p-3"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={getMediaUrl(food.imageKey)}
                    alt={food.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div>
                  <p className="font-bold text-foreground">{food.title}</p>
                  <p className="mt-1 text-xs text-muted">{food.why}</p>
                  <p className="mt-1 text-[11px] text-foreground/55">{food.portion}</p>
                </div>
              </div>
            ) : null
          )}
        </div>

        <h3 className="mt-8 text-xs font-bold uppercase tracking-widest text-warning">
          {t("limitAvoid")}
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {limitFoods.map((food) =>
            food ? (
              <div
                key={food.id}
                className="flex gap-3 rounded-xl border border-foreground/10 bg-foreground/[0.03] p-3"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={getMediaUrl(food.imageKey)}
                    alt={food.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div>
                  <p className="font-bold text-foreground">{food.title}</p>
                  <p className="mt-1 text-xs text-muted">{food.why}</p>
                </div>
              </div>
            ) : null
          )}
        </div>
      </section>

      <section className="border-b border-foreground/10 px-6 py-8 md:px-10">
        <h2 className="report-section-title">{t("sampleDayTitle")}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {(
            [
              ["breakfast", copyData.sampleDay.breakfast],
              ["lunch", copyData.sampleDay.lunch],
              ["dinner", copyData.sampleDay.dinner],
              ["snacks", copyData.sampleDay.snacks],
            ] as const
          ).map(([key, value]) => (
            <div
              key={key}
              className="rounded-xl border border-foreground/10 bg-foreground/[0.03] px-4 py-3"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted">
                {t(`meal.${key}`)}
              </p>
              <p className="mt-1 text-sm text-foreground/85">{value}</p>
            </div>
          ))}
        </div>

        <h2 className="report-section-title mt-10">{t("timelineTitle")}</h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/85">
          <p>{timeline}</p>
          <p>{copyData.timeline.weeks_1_2}</p>
          <p>{copyData.timeline.weeks_3_6}</p>
          <p>{copyData.timeline.weeks_6_8}</p>
        </div>
      </section>

      <section className="px-6 py-8 md:px-10">
        <h2 className="report-section-title">{t("trackerTitle")}</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-foreground/10">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-foreground/10 bg-foreground/[0.03]">
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted">
                  {t("trackerHabit")}
                </th>
                {[1, 2, 3, 4].map((w) => (
                  <th
                    key={w}
                    className="px-3 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-muted"
                  >
                    {t("week", { n: w })}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {habits.map((habit) => (
                <tr key={habit} className="border-b border-white/5">
                  <td className="px-4 py-3 font-medium text-foreground/90">{habit}</td>
                  {[1, 2, 3, 4].map((w) => (
                    <td key={w} className="px-3 py-3 text-center text-foreground/25">
                      ☐ ☐ ☐ ☐ ☐ ☐ ☐
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orderId ? (
          <p className="mt-6 text-xs text-muted">
            {copyData.demoNotice} {t("orderRef")}: {orderId}
          </p>
        ) : null}

        <p className="mt-6 rounded-xl border border-foreground/10 bg-foreground/[0.03] px-4 py-3 text-xs leading-relaxed text-muted">
          {copyData.disclaimer}
        </p>
      </section>
    </article>
  );
}
