import type { Locale } from "@/i18n/routing";
import type { BmiCategory, IntakeData } from "./types";
import en from "../../messages/en.json";
import hi from "../../messages/hi.json";
import ta from "../../messages/ta.json";

const catalogs = { en, hi, ta } as const;

export function buildIntro(
  intake: IntakeData,
  bmi: number,
  category: BmiCategory,
  locale: Locale = "en"
): string {
  const m = catalogs[locale];
  const goal =
    m.introGoals[intake.goal as keyof typeof m.introGoals] ?? intake.goal;
  const cat =
    m.bmiCategories[category as keyof typeof m.bmiCategories] ?? category;

  return m.introTemplate
    .replace("{name}", intake.name)
    .replace("{goal}", goal)
    .replace("{age}", String(intake.age))
    .replace("{bmi}", String(bmi))
    .replace("{category}", cat);
}
