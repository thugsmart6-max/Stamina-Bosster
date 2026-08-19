import { z } from "zod";

export const goalSchema = z.enum([
  "stamina",
  "energy",
  "confidence",
  "general_fitness",
  "weight_loss",
]);

export type ActivityLevel = z.infer<typeof activitySchema>;

export const activitySchema = z.enum([
  "sedentary",
  "light",
  "moderate",
  "active",
]);

export const alcoholSchema = z.enum(["rarely", "weekly", "daily"]);

export const redFlagSchema = z.enum([
  "chest_pain",
  "persistent_ed",
  "new_meds",
  "severe_fatigue",
  "none",
]);

export const dietPreferenceSchema = z.enum(["none", "vegetarian", "vegan"]);
export const sleepHoursSchema = z.enum(["under_6", "6_7", "7_8", "over_8"]);
export const stressLevelSchema = z.enum(["low", "medium", "high"]);
export const exerciseMinutesSchema = z.enum(["under_20", "20_40", "over_40"]);
export const erectionQualitySchema = z.enum(["firm", "mixed", "soft"]);

export const intakeSchema = z.object({
  name: z.string().min(2).max(80),
  age: z.coerce.number().int().min(18).max(75),
  weight: z.coerce.number().positive().max(500),
  weightUnit: z.enum(["kg", "lb"]),
  height: z.coerce.number().positive().max(300),
  heightUnit: z.enum(["cm", "ft"]),
  sex: z.preprocess(() => "male" as const, z.literal("male")),
  goal: goalSchema,
  activity: activitySchema,
  smoking: z.boolean(),
  alcohol: alcoholSchema,
  redFlags: z.array(redFlagSchema).min(1),
  dietPreference: dietPreferenceSchema.default("none"),
  sleepHours: sleepHoursSchema.default("7_8"),
  stressLevel: stressLevelSchema.default("medium"),
  exerciseMinutes: exerciseMinutesSchema.default("20_40"),
  erectionQuality: erectionQualitySchema.default("mixed"),
});

export type IntakeData = z.infer<typeof intakeSchema>;

export type BmiCategory =
  | "underweight"
  | "normal"
  | "overweight"
  | "obese";

export interface PlanResult {
  bmi: number;
  bmiCategory: BmiCategory;
  readinessScore: number;
  exerciseIds: string[];
  eatFoodIds: string[];
  limitFoodIds: string[];
  dietVariantKey: "underweight" | "normal" | "overweight";
  timelineKey: "range_4_8_weeks";
  medicalBlock: boolean;
  introParagraph: string;
}

export interface SessionRecord {
  sessionId: string;
  userId?: string;
  intake: IntakeData;
  plan: PlanResult;
  locale?: string;
  createdAt: string;
}

export type OrderStatus = "pending" | "paid" | "failed";

export interface OrderRecord {
  orderId: string;
  sessionId: string;
  userId?: string;
  planSessionId?: string;
  stripeSessionId?: string;
  name: string;
  email?: string;
  status?: OrderStatus;
  createdAt: string;
  pdfBuffer?: Buffer;
  blobUrl?: string;
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  locale: string;
}
