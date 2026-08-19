/**
 * Iconify icon IDs (browse at https://icones.js.org/)
 * Collections: mdi, ph, solar, lucide
 */
export const icons = {
  logo: "solar:heart-pulse-bold",
  sparkles: "mdi:creation",
  navGap: "mdi:alert-decagram-outline",
  navHow: "mdi:map-marker-path",
  navPricing: "mdi:tag-outline",
  ctaArrow: "mdi:arrow-right",

  stepQuestionnaire: "mdi:clipboard-text-outline",
  stepPreview: "mdi:eye-outline",
  stepDownload: "mdi:file-download-outline",

  trapGeneric: "mdi:file-document-outline",
  trapTimeline: "mdi:clock-alert-outline",
  trapVisual: "mdi:image-off-outline",
  trapMedical: "mdi:hospital-box-outline",
  trapDiet: "mdi:food-off-outline",
  lie: "mdi:close-circle-outline",

  practice: "mdi:arm-flex-outline",
  confidence: "mdi:shield-check-outline",
  nutrition: "mdi:food-apple-outline",
  exercise: "mdi:run",
  bmi: "mdi:scale-bathroom",
  pdf: "mdi:file-pdf-box",
  email: "mdi:email-outline",
  lock: "mdi:lock-outline",
  check: "mdi:check-circle",
  checkBold: "solar:check-circle-bold",
  star: "solar:star-bold",
  warning: "mdi:alert-circle-outline",
  success: "mdi:check-decagram",
  chevronDown: "mdi:chevron-down",
  medical: "mdi:stethoscope",

  goalStamina: "mdi:lightning-bolt",
  goalEnergy: "mdi:battery-charging-high",
  goalConfidence: "mdi:account-heart-outline",
  goalFitness: "mdi:dumbbell",

  intakeBasics: "mdi:account-outline",
  intakeBody: "mdi:human-handsup",
  intakeLifestyle: "mdi:leaf",
  intakeGoals: "mdi:target",

  planWalk: "mdi:walk",
  planSwim: "mdi:swim",
  planCore: "mdi:yoga",
  planFood: "mdi:silverware-fork-knife",
  planSleep: "mdi:sleep",
  planHydration: "mdi:water-outline",

  payment: "mdi:credit-card-outline",
  shield: "ph:shield-check-duotone",
} as const;

export type IconName = keyof typeof icons;
