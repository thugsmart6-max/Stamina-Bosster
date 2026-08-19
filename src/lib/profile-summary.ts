import type { LocalizedGuideContent } from "@/lib/performance-guide-locale";
import type { IntakeData, PlanResult } from "@/lib/types";

export function formatSexLabel(
  sex: IntakeData["sex"],
  profile: LocalizedGuideContent["profile"]
): string {
  if (sex === "male") return profile.male;
  if (sex === "female") return profile.female;
  return profile.preferNot;
}

export function getProfileWarnings(
  intake: IntakeData,
  profile: LocalizedGuideContent["profile"]
): string[] {
  const warnings: string[] = [];
  if (intake.smoking) warnings.push(profile.smokingWarn);
  if (intake.alcohol === "weekly") warnings.push(profile.alcoholWarnWeekly);
  if (intake.alcohol === "daily") warnings.push(profile.alcoholWarnDaily);
  return warnings;
}

export function formatBmiLine(plan: PlanResult): string {
  return `${plan.bmi} (${plan.bmiCategory.replace(/_/g, " ")})`;
}
