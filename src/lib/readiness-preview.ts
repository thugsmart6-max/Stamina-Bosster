import { estimateReadinessPreview } from "@/lib/rules-engine";
import type { IntakeData } from "@/lib/types";

export function previewWellnessIndex(intake: IntakeData): number {
  return Math.round(Math.min(100, Math.max(0, estimateReadinessPreview(intake) * 10)));
}
