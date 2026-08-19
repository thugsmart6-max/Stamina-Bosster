"use client";

import { calculateBmi, getBmiCategory } from "@/lib/rules-engine";
import type { IntakeData } from "@/lib/types";
import { useTranslations } from "next-intl";
import type { BmiCategory } from "@/lib/types";

const BMI_SLOTS: BmiCategory[] = [
  "underweight",
  "normal",
  "overweight",
  "obese",
];

export function LiveBmi({
  form,
}: {
  form: Pick<IntakeData, "weight" | "weightUnit" | "height" | "heightUnit">;
}) {
  const t = useTranslations("intake");
  const bmiT = useTranslations("bmiCategories");

  if (!form.weight || !form.height) return null;

  try {
    const bmi = calculateBmi(form as IntakeData);
    const cat = getBmiCategory(bmi) as BmiCategory;
    const activeIndex = BMI_SLOTS.indexOf(cat);

    return (
      <div className="start-cell border-x-0">
        <p className="start-kicker text-primary">{t("liveBmiTitle")}</p>
        <p className="display-heading mt-4 text-5xl leading-none text-foreground md:text-6xl">
          {bmi}
        </p>
        <p className="mt-3 text-sm text-muted">{bmiT(cat)}</p>
        <p className="mt-2 text-xs leading-relaxed text-muted">{t("bmiRangeHint")}</p>
        <div
          className="mt-6 grid grid-cols-4 gap-px bg-foreground/10"
          role="group"
          aria-label={t("bmiRangeHint")}
        >
          {BMI_SLOTS.map((slot, i) => (
            <div
              key={slot}
              className={i === activeIndex ? "h-2 bg-primary" : "h-2 bg-[var(--paper)]"}
              title={bmiT(slot)}
            />
          ))}
        </div>
      </div>
    );
  } catch {
    return null;
  }
}
