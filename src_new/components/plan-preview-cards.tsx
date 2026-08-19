"use client";

import { AppIcon } from "@/components/app-icon";
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
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
          <AppIcon name="exercise" size={18} />
          {t("exercises")}
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {exercises.map((ex) =>
            ex ? (
              <div
                key={ex.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-surface-elevated"
              >
                <div className="relative h-36 w-full">
                  <Image
                    src={getMediaUrl(ex.imageKey)}
                    alt={ex.title}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
                <div className="p-4">
                  <p className="font-bold text-white">{ex.title}</p>
                  <p className="mt-1 text-xs text-muted">{ex.frequency}</p>
                </div>
              </div>
            ) : null
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent">
          <AppIcon name="nutrition" size={18} />
          {t("eatMore")}
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {eatFoods.map((food) =>
            food ? (
              <div
                key={food.id}
                className="flex gap-3 rounded-2xl border border-white/10 bg-surface-elevated p-3"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={getMediaUrl(food.imageKey)}
                    alt={food.title}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{food.title}</p>
                  <p className="mt-1 text-xs text-muted">{food.portion}</p>
                </div>
              </div>
            ) : null
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red">
          <AppIcon name="warning" size={18} />
          {t("limit")}
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {limitFoods.map((food) =>
            food ? (
              <div
                key={food.id}
                className="flex gap-3 rounded-2xl border border-red/20 bg-red/5 p-3"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={getMediaUrl(food.imageKey)}
                    alt={food.title}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{food.title}</p>
                  <p className="mt-1 text-xs text-muted">{food.why}</p>
                </div>
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}
