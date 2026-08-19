import type { Locale } from "@/i18n/routing";
import guideEn from "../../data/i18n/performance-guide.en.json";
import guideHi from "../../data/i18n/performance-guide.hi.json";
import guideTa from "../../data/i18n/performance-guide.ta.json";

export type GuideRow = Record<string, string>;

export type PerformanceGuide = {
  title: string;
  subtitle: string;
  quickSummary: string;
  disclaimer: string;
  sections: Record<string, string>;
  tableHeaders: Record<string, string>;
  exercises: GuideRow[];
  avoid: GuideRow[];
  foodsTamil: GuideRow[];
  foodsHindi: GuideRow[];
  foodsPan: GuideRow[];
  habitsSleep: GuideRow[];
  habitsStress: GuideRow[];
  habitsDaily: GuideRow[];
  preSex: GuideRow[];
  routine: GuideRow[];
  doctor: GuideRow[];
};

const guides: Record<Locale, PerformanceGuide> = {
  en: guideEn as PerformanceGuide,
  hi: guideHi as PerformanceGuide,
  ta: guideTa as PerformanceGuide,
};

export function getPerformanceGuide(locale: Locale): PerformanceGuide {
  return guides[locale] ?? guides.en;
}
