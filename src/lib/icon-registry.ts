import type { ComponentProps } from "react";
import type { Icon } from "iconsax-react";
import {
  Activity,
  Apple,
  ArrowDown2,
  ArrowRight,
  Award,
  BatteryCharging,
  CardPos,
  Category2,
  ClipboardText,
  ClipboardTick,
  Clock,
  CloseCircle,
  Danger,
  DiscountShape,
  DocumentDownload,
  DocumentText,
  DocumentText1,
  Drop,
  Eye,
  Flash,
  Forbidden2,
  GallerySlash,
  Glass,
  Health,
  HeartAdd,
  Home2,
  Hospital,
  Like,
  Lock1,
  MagicStar,
  Moon,
  People,
  PresentionChart,
  RouteSquare,
  ShieldTick,
  Sms,
  Speedometer,
  Star1,
  TickCircle,
  Tree,
  User,
  Warning2,
  Weight,
} from "iconsax-react";

/**
 * Named icons ([Iconsax](https://iconsax.io/) via `iconsax-react`).
 * Keys are semantic app names; values are Iconsax React components.
 */
export const iconRegistry = {
  logo: HeartAdd,
  sparkles: MagicStar,
  navGap: Danger,
  navHow: RouteSquare,
  navPricing: DiscountShape,
  ctaArrow: ArrowRight,
  stepQuestionnaire: ClipboardText,
  stepPreview: Eye,
  stepDownload: DocumentDownload,
  trapGeneric: DocumentText1,
  trapTimeline: Clock,
  trapVisual: GallerySlash,
  trapMedical: Hospital,
  trapDiet: Forbidden2,
  lie: CloseCircle,
  practice: Health,
  confidence: ShieldTick,
  nutrition: Apple,
  exercise: Activity,
  bmi: Weight,
  pdf: DocumentText,
  email: Sms,
  lock: Lock1,
  check: TickCircle,
  checkBold: TickCircle,
  star: Star1,
  warning: Warning2,
  success: Award,
  chevronDown: ArrowDown2,
  menu: Category2,
  close: CloseCircle,
  medical: Hospital,
  goalStamina: Flash,
  goalEnergy: BatteryCharging,
  goalConfidence: Like,
  goalFitness: Activity,
  intakeBasics: User,
  intakeBody: People,
  intakeLifestyle: Tree,
  intakeGoals: PresentionChart,
  intakeScreening: ClipboardTick,
  planWalk: Speedometer,
  planSwim: Drop,
  planCore: Health,
  planFood: Category2,
  planSleep: Moon,
  planHydration: Glass,
  payment: CardPos,
  shield: ShieldTick,
  home: Home2,
  legalDocument: DocumentText1,
} as const satisfies Record<string, Icon>;

export type IconName = keyof typeof iconRegistry;

export type IconVariant = NonNullable<
  ComponentProps<(typeof iconRegistry)["logo"]>["variant"]
>;

/** App-wide default when a name has no entry in `iconVariants` */
export const defaultIconVariant: IconVariant = "Outline";

/** Default Iconsax stroke/fill style per logical name */
export const iconVariants: Partial<Record<IconName, IconVariant>> = {
  checkBold: "Bold",
  star: "Bold",
  success: "Bold",
};
