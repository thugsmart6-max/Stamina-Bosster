import { describe, expect, it } from "vitest";
import { calculateBmi, generatePlan } from "./rules-engine";
import type { IntakeData } from "./types";

function baseIntake(overrides: Partial<IntakeData> = {}): IntakeData {
  return {
    name: "Alex",
    age: 35,
    weight: 90,
    weightUnit: "kg",
    height: 175,
    heightUnit: "cm",
    goal: "stamina",
    activity: "sedentary",
    smoking: false,
    alcohol: "weekly",
    redFlags: ["none"],
    ...overrides,
  };
}

describe("calculateBmi", () => {
  it("computes BMI for metric inputs", () => {
    const bmi = calculateBmi(baseIntake());
    expect(bmi).toBeGreaterThan(25);
  });
});

describe("generatePlan", () => {
  it("assigns low-impact exercises for sedentary high BMI", () => {
    const plan = generatePlan(
      baseIntake({ weight: 110, height: 175, activity: "sedentary" })
    );
    expect(plan.exerciseIds).toContain("walk");
    expect(plan.exerciseIds).toContain("swim");
    expect(plan.bmiCategory).toBe("obese");
  });

  it("assigns intervals for active normal profile", () => {
    const plan = generatePlan(
      baseIntake({
        weight: 75,
        height: 180,
        activity: "active",
        goal: "general_fitness",
      })
    );
    expect(plan.exerciseIds).toContain("interval");
    expect(plan.medicalBlock).toBe(false);
  });

  it("enables medical block on red flags", () => {
    const plan = generatePlan(
      baseIntake({ redFlags: ["persistent_ed", "none"] })
    );
    expect(plan.medicalBlock).toBe(true);
    expect(plan.exerciseIds.length).toBeLessThanOrEqual(2);
    expect(plan.readinessScore).toBeLessThanOrEqual(5);
  });

  it("always uses ranged timeline key", () => {
    const plan = generatePlan(baseIntake());
    expect(plan.timelineKey).toBe("range_4_8_weeks");
  });

  it("includes kegel for stamina goal", () => {
    const plan = generatePlan(baseIntake({ goal: "stamina" }));
    expect(plan.exerciseIds).toContain("kegel");
  });
});
