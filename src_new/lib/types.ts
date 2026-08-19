import { z } from "zod";

export const goalSchema = z.enum([
  "stamina",
  "energy",
  "confidence",
  "general_fitness",
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

export const intakeSchema = z.object({
  name: z.string().min(2).max(80),
  age: z.coerce.number().int().min(18).max(100),
  weight: z.coerce.number().positive().max(500),
  weightUnit: z.enum(["kg", "lb"]),
  height: z.coerce.number().positive().max(300),
  heightUnit: z.enum(["cm", "ft"]),
  sex: z.enum(["male", "female", "prefer_not"]).optional(),
  goal: goalSchema,
  activity: activitySchema,
  smoking: z.boolean(),
  alcohol: alcoholSchema,
  redFlags: z.array(redFlagSchema).min(1),
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
  intake: IntakeData;
  plan: PlanResult;
  locale?: string;
  createdAt: string;
}

export interface OrderRecord {
  orderId: string;
  sessionId: string;
  name: string;
  email?: string;
  createdAt: string;
  pdfBuffer?: Buffer;
  blobUrl?: string;
}
