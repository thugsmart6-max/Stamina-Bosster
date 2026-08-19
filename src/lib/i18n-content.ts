import type { Locale } from "@/i18n/routing";
import exercisesEn from "../../data/exercises.json";
import foodsEn from "../../data/foods.json";
import exercisesHi from "../../data/i18n/exercises.hi.json";
import exercisesTa from "../../data/i18n/exercises.ta.json";
import foodsHi from "../../data/i18n/foods.hi.json";
import foodsTa from "../../data/i18n/foods.ta.json";

type Exercise = (typeof exercisesEn)[number];
type Food = (typeof foodsEn)[number];

const exercisesByLocale: Record<Locale, Exercise[]> = {
  en: exercisesEn,
  hi: exercisesHi as Exercise[],
  ta: exercisesTa as Exercise[],
};

const foodsByLocale: Record<Locale, Food[]> = {
  en: foodsEn,
  hi: foodsHi as Food[],
  ta: foodsTa as Food[],
};

export function getExercise(id: string, locale: Locale = "en") {
  return exercisesByLocale[locale].find((e) => e.id === id);
}

export function getFood(id: string, locale: Locale = "en") {
  return foodsByLocale[locale].find((f) => f.id === id);
}
