import type { Locale } from "@/i18n/routing";
import exercisesData from "../../data/exercises.json";
import foodsData from "../../data/foods.json";
import { buildIntro } from "./i18n-plan";
import type { ActivityLevel } from "./types";
import type { BmiCategory, IntakeData, PlanResult } from "./types";

const ALL_EXERCISE_IDS = exercisesData.map((e) => e.id);
const EAT_FOODS = foodsData.filter((f) => f.type === "eat").map((f) => f.id);
const LIMIT_FOODS = foodsData.filter((f) => f.type === "limit").map((f) => f.id);

export function weightToKg(weight: number, unit: "kg" | "lb") {
  return unit === "kg" ? weight : weight * 0.453592;
}

export function heightToM(height: number, unit: "cm" | "ft") {
  if (unit === "cm") return height / 100;
  return height * 0.3048;
}

export function calculateBmi(intake: IntakeData): number {
  const kg = weightToKg(intake.weight, intake.weightUnit);
  const m = heightToM(intake.height, intake.heightUnit);
  if (m <= 0) return 0;
  return Math.round((kg / (m * m)) * 10) / 10;
}

export function getBmiCategory(bmi: number): BmiCategory {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obese";
}

function hasMedicalRedFlags(intake: IntakeData): boolean {
  return intake.redFlags.some((f) => f !== "none");
}

function pickExercises(
  bmi: number,
  activity: ActivityLevel,
  goal: IntakeData["goal"],
  medicalBlock: boolean,
  erectionQuality: IntakeData["erectionQuality"] = "mixed"
): string[] {
  if (medicalBlock) {
    return ["walk", "stretch"].filter((id) => ALL_EXERCISE_IDS.includes(id));
  }

  const ids: string[] = [];

  if (bmi >= 30 || activity === "sedentary") {
    ids.push("walk", "swim", "plank", "stretch");
  } else if (activity === "light") {
    ids.push("walk", "squat", "plank", "stretch");
  } else if (activity === "moderate") {
    ids.push("bike", "squat", "plank", "interval");
  } else {
    ids.push("interval", "bike", "squat", "plank");
  }

  const wantsPelvicFloor =
    goal === "stamina" ||
    goal === "confidence" ||
    erectionQuality === "mixed" ||
    erectionQuality === "soft";
  if (wantsPelvicFloor && !ids.includes("kegel")) ids.push("kegel");
  if (
    (erectionQuality === "soft" || erectionQuality === "mixed") &&
    !ids.includes("walk")
  ) {
    ids.unshift("walk");
  }

  return [...new Set(ids)].slice(0, 6);
}

const MEAT_IDS = new Set(["salmon", "chicken"]);
const DAIRY_EGG_IDS = new Set(["eggs", "yogurt"]);

function pickFoods(
  bmiCategory: BmiCategory,
  alcohol: IntakeData["alcohol"],
  smoking: boolean,
  dietPreference: IntakeData["dietPreference"] = "none"
): { eat: string[]; limit: string[] } {
  let eat = [...EAT_FOODS];
  if (dietPreference === "vegetarian") {
    eat = eat.filter((id) => !MEAT_IDS.has(id));
  } else if (dietPreference === "vegan") {
    eat = eat.filter((id) => !MEAT_IDS.has(id) && !DAIRY_EGG_IDS.has(id));
  }
  eat = eat.slice(0, 6);
  const limit = [...LIMIT_FOODS];

  if (alcohol === "daily" || alcohol === "weekly") {
    if (!limit.includes("alcohol")) limit.unshift("alcohol");
  }
  if (bmiCategory === "overweight" || bmiCategory === "obese") {
    if (!limit.includes("fried")) limit.push("fried");
    if (!limit.includes("soda")) limit.push("soda");
  }
  if (smoking) {
    if (!limit.includes("late_meal")) limit.push("late_meal");
  }

  return {
    eat,
    limit: [...new Set(limit)].slice(0, 5),
  };
}

function computeReadinessScore(
  intake: IntakeData,
  bmi: number,
  medicalBlock: boolean
): number {
  if (medicalBlock) return 4;
  let score = 7;
  if (intake.activity === "sedentary") score -= 2;
  if (intake.activity === "active") score += 1;
  if (intake.smoking) score -= 2;
  if (intake.alcohol === "daily") score -= 2;
  else if (intake.alcohol === "weekly") score -= 1;
  if (bmi >= 30) score -= 1;
  if (intake.age > 55) score -= 1;
  if (intake.sleepHours === "under_6") score -= 2;
  else if (intake.sleepHours === "6_7") score -= 1;
  else if (intake.sleepHours === "over_8") score += 1;
  if (intake.stressLevel === "high") score -= 2;
  else if (intake.stressLevel === "medium") score -= 1;
  if (intake.exerciseMinutes === "under_20" && intake.activity === "sedentary") {
    score -= 1;
  }
  if (intake.erectionQuality === "soft") score -= 1;
  return Math.max(1, Math.min(10, score));
}

/** Client-safe preview before full plan generation (same scoring as generatePlan). */
export function estimateReadinessPreview(intake: IntakeData): number {
  const bmi = calculateBmi(intake);
  return computeReadinessScore(intake, bmi, hasMedicalRedFlags(intake));
}

export function generatePlan(intake: IntakeData, locale: Locale = "en"): PlanResult {
  const bmi = calculateBmi(intake);
  const bmiCategory = getBmiCategory(bmi);
  const medicalBlock = hasMedicalRedFlags(intake);
  const exerciseIds = pickExercises(
    bmi,
    intake.activity,
    intake.goal,
    medicalBlock,
    intake.erectionQuality
  );
  const { eat, limit } = pickFoods(
    bmiCategory,
    intake.alcohol,
    intake.smoking,
    intake.dietPreference
  );

  let dietVariantKey: PlanResult["dietVariantKey"] = "normal";
  if (bmiCategory === "underweight") dietVariantKey = "underweight";
  else if (bmiCategory === "overweight" || bmiCategory === "obese")
    dietVariantKey = "overweight";

  return {
    bmi,
    bmiCategory,
    readinessScore: computeReadinessScore(intake, bmi, medicalBlock),
    exerciseIds,
    eatFoodIds: eat,
    limitFoodIds: limit,
    dietVariantKey,
    timelineKey: "range_4_8_weeks",
    medicalBlock,
    introParagraph: buildIntro(intake, bmi, bmiCategory, locale),
  };
}
