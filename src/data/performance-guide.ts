export const PERFORMANCE_GUIDE_TITLE =
  "Complete Guide: Improve Erections & Sexual Performance for Men";

export const EXERCISE_ROWS = [
  {
    exercise: "Kegel (Pelvic Floor)",
    how: "Tighten muscle to stop urine, hold 2–3 sec, release",
    frequency: "10 reps × 5 sets/day",
    benefit: "Supports erection rigidity, prevents blood leaving penis",
  },
  {
    exercise: "Walking (Aerobic)",
    how: "30 min moderate pace",
    frequency: "Daily",
    benefit: "41% lower ED risk; restores performance in overweight men",
  },
  {
    exercise: "Running / Swimming",
    how: "Moderate intensity",
    frequency: "3–4 times/week",
    benefit: "Prevents ED by improving circulation",
  },
  {
    exercise: "Core Exercises",
    how: "Side planks, mountain climbers, side lunges",
    frequency: "3 times/week",
    benefit: "Improves stability during sex",
  },
  {
    exercise: "Stress Reduction",
    how: "Deep breathing, yoga, meditation",
    frequency: "Daily",
    benefit: "Reduces adrenaline that contracts blood vessels",
  },
] as const;

export const EXERCISE_WARNING =
  "Avoid: Excessive cycling (pressure on perineum damages blood vessels/nerves)";

export const AVOID_ROWS = [
  { item: "Smoking", reason: "Damages blood vessels; nicotine contracts vessels → reduces penis blood flow" },
  { item: "Red / processed meats", reason: "Worsen artery health, increase ED risk" },
  { item: "Fried foods & trans fats", reason: "Destroy nitric oxide production, harden arteries" },
  { item: "Sugary drinks / energy drinks", reason: "Kill nitric oxide → reduce erection quality" },
  { item: "Excess alcohol (>2 drinks/day)", reason: "Liver damage, nerve damage, hormone imbalance → ED" },
  { item: "High-sodium meals", reason: "Damage blood pressure & circulation" },
  { item: "Maida items (bread, pasta, biscuits)", reason: "Harden arteries, hurt ED" },
  { item: "Sugar syrup foods (Jalebi, Gulab jamun)", reason: "Kill nitric oxide" },
  { item: "Anabolic steroids", reason: "Shrink testicles, reduce testosterone" },
  { item: "Sedentary lifestyle", reason: "Strongly linked to ED" },
  { item: "Excess stress", reason: "Boosts adrenaline → contracts blood vessels" },
] as const;

export const FOOD_TAMIL = [
  { food: "Murungakkai (winged beans) poriyal", why: "High nitrates → relax blood vessels" },
  { food: "Nettikattai keerai (leafy greens)", why: "Nitrates boost nitric oxide" },
  { food: "Meen moeche (mackerel) / Nethili (sardines)", why: "Omega-3s reduce arterial blockages" },
  { food: "Kadalai (groundnuts) / roasted chana", why: "Arginine → nitric oxide" },
  { food: "Pomegranate (Mazhavalpuli)", why: "Polyphenols improve blood flow" },
  { food: "Watermelon (Pandhalam)", why: "Citrulline acts like ED meds" },
  { food: "Almonds + walnuts", why: "Vitamin E + zinc for testosterone" },
] as const;

export const FOOD_HINDI = [
  { food: "Kaddu ke beej (pumpkin seeds)", why: "Highest zinc for testosterone" },
  { food: "Khajoor (dates) + Makhana", why: "Amino acids + fertility boosters" },
  { food: "Ghee (1 tsp/day)", why: "Healthy fats for hormones" },
  { food: "Kesar (saffron) in warm milk", why: "Traditional fertility enhancer" },
  { food: "Beetroot (Chukandar) salad", why: "High nitrates → better flow" },
  { food: "Jamun (black plum) / grapes", why: "Flavonoids reduce ED risk" },
] as const;

export const FOOD_NEUTRAL = [
  { food: "Spinach / Methi leaves", why: "Nitrates → blood vessel relaxation" },
  { food: "Whole grains (oats, brown rice)", why: "Fiber + vitamins for heart" },
  { food: "Dark chocolate (70%+)", why: "Flavonoids increase blood flow" },
  { food: "Coffee (2–3 cups/day)", why: "Caffeine boosts blood flow, lower ED" },
  { food: "Olive oil", why: "May help testosterone" },
  { food: "Berries (strawberries, blueberries)", why: "Flavonoids lower ED 9–11%" },
  { food: "Mediterranean diet", why: "Fruits, vegetables, whole grains, fish, nuts, olive oil" },
] as const;

export const DAILY_ROUTINE = [
  { time: "Morning", action: "10 Kegel reps × 5 sets + 30-min walk" },
  { time: "Meals", action: "Mediterranean-style (greens, fish, nuts, whole grains, olive oil)" },
  { time: "Snack", action: "Almonds + walnuts + pumpkin seeds OR dark chocolate" },
  { time: "Drink", action: "2–3 cups coffee + coconut water + watermelon" },
  { time: "Night", action: "Warm milk + turmeric (or saffron)" },
  { time: "Sleep", action: "7–9 hours/night" },
] as const;

export const HEALTH_CHECKS = [
  { check: "Blood pressure", why: "High BP damages vessels to penis" },
  { check: "Cholesterol", why: "High cholesterol → ED" },
  { check: "Blood sugar", why: "Diabetes is major ED cause" },
  { check: "Testosterone", why: "Low T → poor erections, low drive" },
  { check: "Waist size", why: "42-inch waist = 50% more ED risk vs 32-inch" },
] as const;

export const LIFESTYLE_HABITS = [
  "Maintain healthy weight – obesity raises vascular disease & diabetes risk",
  "Quit smoking – major ED cause",
  "Limit alcohol – moderate or none",
  "Reduce stress – talk to partner, exercise, therapy if needed",
  "Avoid risky sex positions – prevent penile injuries",
  "Follow healthy eating plan – plant-based, whole foods",
] as const;

export const DOCTOR_ROWS = [
  {
    sign: "ED persists 3+ months despite lifestyle changes",
    action: "See urologist",
  },
  {
    sign: "Low sex drive + moodiness + lack of stamina",
    action: "Check testosterone",
  },
  {
    sign: "High BP, high cholesterol, diabetes",
    action: "Get treated + monitor",
  },
  {
    sign: "Erectile dysfunction after prostate surgery",
    action: "Medical intervention needed",
  },
] as const;

export const DOCTOR_FOOTNOTE =
  "Medications and sex therapy can help when needed.";
