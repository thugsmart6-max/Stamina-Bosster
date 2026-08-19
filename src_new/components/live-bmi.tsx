"use client";

import { calculateBmi, getBmiCategory } from "@/lib/rules-engine";
import type { IntakeData } from "@/lib/types";

export function LiveBmi({ form }: { form: Pick<IntakeData, "weight" | "weightUnit" | "height" | "heightUnit"> }) {
  if (!form.weight || !form.height) return null;

  try {
    const bmi = calculateBmi(form as IntakeData);
    const cat = getBmiCategory(bmi);
    return (
      <div className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">
          Live estimate
        </p>
        <p className="display-heading text-2xl text-white">
          BMI {bmi}{" "}
          <span className="text-sm font-normal text-muted">({cat})</span>
        </p>
      </div>
    );
  } catch {
    return null;
  }
}
