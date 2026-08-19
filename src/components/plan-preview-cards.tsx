"use client";

import { getExercise, getFood } from "@/lib/i18n-content";
import type { Locale } from "@/i18n/routing";
import type { PlanResult } from "@/lib/types";
import { getMediaUrl } from "@/lib/content";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

export function PlanPreviewCards({ plan }: { plan: PlanResult }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("planPreview");

  const exercises = plan.exerciseIds.map((id) => getExercise(id, locale)).filter(Boolean);
  const eatFoods = plan.eatFoodIds
    .map((id) => getFood(id, locale))
    .filter((f) => f?.type === "eat");
  const limitFoods = plan.limitFoodIds
    .map((id) => getFood(id, locale))
    .filter((f) => f?.type === "limit");

  return (
    <div className="space-y-12">
      <div>
        <p className="start-kicker">{t("exercises")}</p>
        <div className="mt-6 grid gap-px bg-foreground/10 sm:grid-cols-2">
          {exercises.map((ex) =>
            ex ? (
              <article key={ex.id} className="start-work relative aspect-[4/5] min-h-[14rem] !rounded-none bg-[var(--night)]">
                <Image
                  src={getMediaUrl(ex.imageKey)}
                  alt={ex.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="start-work__label">{ex.title}</span>
                <p className="absolute bottom-3 left-3 right-3 text-xs text-white/80">{ex.frequency}</p>
              </article>
            ) : null
          )}
        </div>
      </div>

      <div className="grid gap-px bg-foreground/10 md:grid-cols-2">
        <div className="bg-[var(--paper)] px-0 py-2 md:pr-8">
          <p className="start-kicker pillar-fuel">{t("eatMore")}</p>
          <ul className="mt-4">
            {eatFoods.map((food) =>
              food ? (
                <li
                  key={food.id}
                  className="grid grid-cols-[4.5rem_1fr] items-center gap-4 border-t border-foreground/10 py-4"
                >
                  <span className="relative h-16 w-[4.5rem] overflow-hidden bg-[var(--night)]">
                    <Image
                      src={getMediaUrl(food.imageKey)}
                      alt={food.title}
                      fill
                      className="object-cover"
                      sizes="72px"
                    />
                  </span>
                  <span>
                    <p className="text-sm font-medium">{food.title}</p>
                    <p className="mt-1 text-xs text-muted">{food.portion}</p>
                  </span>
                </li>
              ) : null
            )}
          </ul>
        </div>
        <div className="bg-[var(--paper)] px-0 py-2 md:pl-8">
          <p className="start-kicker pillar-move">{t("limit")}</p>
          <ul className="mt-4">
            {limitFoods.map((food) =>
              food ? (
                <li
                  key={food.id}
                  className="grid grid-cols-[4.5rem_1fr] items-center gap-4 border-t border-foreground/10 py-4"
                >
                  <span className="relative h-16 w-[4.5rem] overflow-hidden bg-[var(--night)]">
                    <Image
                      src={getMediaUrl(food.imageKey)}
                      alt={food.title}
                      fill
                      className="object-cover"
                      sizes="72px"
                    />
                  </span>
                  <span>
                    <p className="text-sm font-medium">{food.title}</p>
                    <p className="mt-1 text-xs text-muted">{food.why}</p>
                  </span>
                </li>
              ) : null
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
