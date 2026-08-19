import type { IntakeData } from "./types";

const MEAT_FOODS = new Set(["salmon", "chicken"]);
const ANIMAL_FOODS = new Set(["salmon", "chicken", "eggs", "yogurt"]);

export function feetInchesFromDecimal(totalFeet: number): {
  feet: number;
  inches: number;
} {
  const feet = Math.floor(totalFeet);
  const inches = Math.round((totalFeet - feet) * 12);
  return { feet, inches: inches >= 12 ? 11 : inches };
}

export function decimalFeetFromParts(feet: number, inches: number): number {
  return Math.round((feet + inches / 12) * 100) / 100;
}

/** Eight-step onboarding: welcome → goal → profile → body → lifestyle → habits → screening → review */
export function validateIntakeStep(step: number, form: IntakeData): string | null {
  switch (step) {
    case 0:
      return null;
    case 1:
      if (!form.goal) return "goal";
      if (!form.erectionQuality) return "erectionQuality";
      return null;
    case 2: {
      if (form.name.trim().length < 2) return "name";
      if (form.age < 18 || form.age > 75) return "age";
      return null;
    }
    case 3: {
      if (form.weightUnit === "kg") {
        if (form.weight < 45 || form.weight > 180) return "weight";
      } else if (form.weight < 100 || form.weight > 400) {
        return "weight";
      }
      if (form.heightUnit === "cm") {
        if (form.height < 150 || form.height > 210) return "height";
      } else {
        const totalInches = form.height * 12;
        if (totalInches < 59 || totalInches > 84) return "height";
      }
      return null;
    }
    case 4:
      if (!form.activity) return "activity";
      if (!form.sleepHours) return "sleep";
      if (!form.stressLevel) return "stress";
      if (!form.exerciseMinutes) return "exercise";
      return null;
    case 5:
      if (!form.alcohol) return "alcohol";
      if (!form.dietPreference) return "diet";
      return null;
    case 6:
      if (!form.redFlags.length) return "screening";
      return null;
    case 7:
      return null;
    default:
      return null;
  }
}

export function hasScreeningFlags(form: IntakeData): boolean {
  return form.redFlags.some((f) => f !== "none");
}

export { MEAT_FOODS, ANIMAL_FOODS };
