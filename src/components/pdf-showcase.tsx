"use client";

import { getMediaUrl } from "@/lib/content";
import { getExercise, getFood } from "@/lib/i18n-content";
import type { Locale } from "@/i18n/routing";
import type { IntakeData, PlanResult } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useMemo, useState } from "react";

type PageKey = "cover" | "profile" | "move" | "fuel" | "tracker";

const PAGE_KEYS: PageKey[] = ["cover", "profile", "move", "fuel", "tracker"];

export function PdfShowcase({
  plan,
  intake,
  previewUrl,
  loading,
  wellnessIndex,
  categoryLabel,
}: {
  plan: PlanResult;
  intake: IntakeData | null;
  previewUrl: string | null;
  loading: boolean;
  wellnessIndex: number;
  categoryLabel: string;
}) {
  const t = useTranslations("preview");
  const locale = useLocale() as Locale;
  const [active, setActive] = useState<PageKey>("cover");

  const exercises = useMemo(
    () => plan.exerciseIds.map((id) => getExercise(id, locale)).filter(Boolean).slice(0, 2),
    [plan.exerciseIds, locale]
  );
  const eatFoods = useMemo(
    () =>
      plan.eatFoodIds
        .map((id) => getFood(id, locale))
        .filter((f) => f?.type === "eat")
        .slice(0, 3),
    [plan.eatFoodIds, locale]
  );

  const viewerSrc = previewUrl
    ? `${previewUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`
    : null;

  return (
    <div>
      <div className="grid items-start gap-8 px-4 py-10 md:grid-cols-12 md:px-10 md:py-14">
        <div className="md:col-span-7">
          <PdfSheet
            page={active}
            plan={plan}
            intake={intake}
            wellnessIndex={wellnessIndex}
            categoryLabel={categoryLabel}
            exercises={exercises}
            eatFoods={eatFoods}
            large
          />
        </div>
        <ol className="md:col-span-5">
          {PAGE_KEYS.map((key, i) => (
            <li key={key}>
              <button
                type="button"
                onClick={() => setActive(key)}
                className={cn(
                  "grid w-full grid-cols-[3rem_1fr] gap-4 border-b border-white/10 py-5 text-left transition-colors",
                  active === key ? "text-white" : "text-white/50 hover:text-white/80"
                )}
              >
                <span className="text-[11px] font-bold tracking-[0.16em] text-white/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="block text-base font-medium">{t(`pdfPages.${key}`)}</span>
                  <span className="mt-1 block text-sm text-white/45">
                    {t(`pdfPages.${key}Hint`)}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="border-t border-white/10 px-4 py-10 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="start-kicker">{t("pdfDocument")}</p>
            <p className="mt-2 max-w-md text-sm text-white/55">{t("pdfDocumentHint")}</p>
          </div>
          {previewUrl ? (
            <div className="flex flex-wrap gap-3">
              <a
                href={viewerSrc ?? previewUrl}
                target="_blank"
                rel="noreferrer"
                className="start-pill border-white/35 text-white"
              >
                {t("pdfOpen")}
              </a>
              <a
                href={previewUrl}
                download="vitalitypath-report.pdf"
                className="start-pill start-pill--invert"
              >
                {t("pdfDownload")}
              </a>
            </div>
          ) : null}
        </div>

        <div className="pdf-stage mt-8">
          {loading && !previewUrl ? (
            <div className="flex h-[min(68vh,780px)] items-center justify-center">
              <p className="animate-pulse text-sm text-white/45">{t("buildingPdf")}</p>
            </div>
          ) : viewerSrc ? (
            <iframe
              title={t("pdfPreview")}
              src={viewerSrc}
              className="pdf-stage__frame"
            />
          ) : (
            <div className="flex h-48 items-center justify-center">
              <p className="text-sm text-white/45">{t("unavailable")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PdfSheet({
  page,
  plan,
  intake,
  wellnessIndex,
  categoryLabel,
  exercises,
  eatFoods,
  large,
}: {
  page: PageKey;
  plan: PlanResult;
  intake: IntakeData | null;
  wellnessIndex: number;
  categoryLabel: string;
  exercises: ReturnType<typeof getExercise>[];
  eatFoods: ReturnType<typeof getFood>[];
  large?: boolean;
}) {
  const t = useTranslations("preview");
  const locale = useLocale();
  const name = intake?.name?.trim() || t("pdfReader");
  const date = new Date().toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <article
      className={cn(
        "pdf-sheet mx-auto",
        page === "cover" && "pdf-sheet--cover",
        large && "pdf-sheet--large"
      )}
      aria-label={t(`pdfPages.${page}`)}
    >
      {page === "cover" ? (
        <div className="flex h-full flex-col justify-between p-[8%]">
          <div>
            <p className="text-[0.65rem] font-bold tracking-[0.28em]">STAMINA</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium tracking-[0.12em]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
              BOOSTER
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">{t("pdfFor")}</p>
            <p className="display-heading mt-2 text-[clamp(1.4rem,3.2vw,2.4rem)] leading-[0.95]">
              {name}
            </p>
            <p className="mt-3 text-[10px] text-white/45">{date}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/40">
              {t("wellnessIndexTitle")}
            </p>
            <p className="display-heading mt-1 text-5xl md:text-6xl">{wellnessIndex}</p>
          </div>
        </div>
      ) : null}

      {page === "profile" ? (
        <div className="flex h-full flex-col p-[8%]">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--primary)]">
            02 · {t("pdfPages.profile")}
          </p>
          <div className="mt-6 grid flex-1 grid-cols-2 gap-px bg-foreground/10">
            {[
              [t("pdfLabelName"), name],
              [t("pdfLabelAge"), intake ? String(intake.age) : "—"],
              [t("bmi"), `${plan.bmi} · ${categoryLabel}`],
              [t("wellnessIndexTitle"), String(wellnessIndex)],
            ].map(([label, value]) => (
              <div key={label} className="bg-[var(--paper)] p-3">
                <p className="text-[9px] uppercase tracking-[0.14em] text-muted">{label}</p>
                <p className="mt-1 text-xs font-medium">{value}</p>
              </div>
            ))}
          </div>
          {plan.introParagraph ? (
            <p className="mt-4 line-clamp-4 text-[10px] leading-relaxed text-muted">
              {plan.introParagraph}
            </p>
          ) : null}
        </div>
      ) : null}

      {page === "move" ? (
        <div className="flex h-full flex-col p-[8%]">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--primary)]">
            03 · {t("pdfPages.move")}
          </p>
          <div className="mt-4 grid flex-1 grid-rows-2 gap-2">
            {exercises.map((ex) =>
              ex ? (
                <div key={ex.id} className="relative min-h-0 overflow-hidden bg-[var(--night)]">
                  <Image
                    src={getMediaUrl(ex.imageKey)}
                    alt=""
                    fill
                    className="object-cover opacity-90"
                    sizes="(max-width: 768px) 80vw, 40vw"
                  />
                  <span className="absolute bottom-2 left-2 right-2 text-[10px] font-medium text-white">
                    {ex.title}
                  </span>
                </div>
              ) : null
            )}
          </div>
        </div>
      ) : null}

      {page === "fuel" ? (
        <div className="flex h-full flex-col p-[8%]">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
            04 · {t("pdfPages.fuel")}
          </p>
          <ul className="mt-4 flex-1">
            {eatFoods.map((food) =>
              food ? (
                <li
                  key={food.id}
                  className="grid grid-cols-[2.75rem_1fr] items-center gap-3 border-t border-foreground/10 py-2.5"
                >
                  <span className="relative h-11 w-11 overflow-hidden bg-[var(--night)]">
                    <Image
                      src={getMediaUrl(food.imageKey)}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </span>
                  <span>
                    <p className="text-[11px] font-medium">{food.title}</p>
                    <p className="text-[9px] text-muted">{food.portion}</p>
                  </span>
                </li>
              ) : null
            )}
          </ul>
        </div>
      ) : null}

      {page === "tracker" ? (
        <div className="flex h-full flex-col p-[8%]">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#b8862a]">
            05 · {t("pdfPages.tracker")}
          </p>
          <div className="mt-6 grid flex-1 grid-rows-4 gap-3">
            {[1, 2, 3, 4].map((week) => (
              <div key={week}>
                <p className="mb-1.5 text-[9px] uppercase tracking-[0.14em] text-muted">
                  {t("pdfWeek", { n: week })}
                </p>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 7 }).map((_, d) => (
                    <span
                      key={d}
                      className="aspect-square border border-foreground/15 bg-white"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}
