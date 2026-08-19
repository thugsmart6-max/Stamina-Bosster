import {
  Document,
  Image,
  Page,
  Text,
  View,
} from "@react-pdf/renderer";
import exercisesData from "../../../data/exercises.json";
import foodsData from "../../../data/foods.json";
import copyData from "../../../data/copy.json";
import mediaData from "../../../data/media.json";
import { getMediaPathForPdf } from "../content";
import { formatDate } from "../utils";
import type { IntakeData, PlanResult } from "../types";
import { pdfStyles as s } from "./styles";

type MediaKey = keyof typeof mediaData;

export interface ReportProps {
  intake: IntakeData;
  plan: PlanResult;
  watermark?: boolean;
  orderId?: string;
}

function getExercise(id: string) {
  return exercisesData.find((e) => e.id === id);
}

function getFood(id: string) {
  return foodsData.find((f) => f.id === id);
}

function mediaUrl(key: string) {
  return getMediaPathForPdf(key);
}

export function ReportDocument({
  intake,
  plan,
  watermark,
  orderId,
}: ReportProps) {
  const dietText =
    copyData.dietVariants[plan.dietVariantKey] ?? copyData.dietVariants.normal;
  const timeline = copyData.timeline[plan.timelineKey];
  const exercises = plan.exerciseIds
    .map(getExercise)
    .filter(Boolean) as typeof exercisesData;
  const eatFoods = plan.eatFoodIds
    .map(getFood)
    .filter((f) => f?.type === "eat") as typeof foodsData;
  const limitFoods = plan.limitFoodIds
    .map(getFood)
    .filter((f) => f?.type === "limit") as typeof foodsData;

  const usedMediaKeys = new Set<string>();
  exercises.forEach((e) => usedMediaKeys.add(e.imageKey));
  eatFoods.forEach((f) => usedMediaKeys.add(f.imageKey));
  limitFoods.forEach((f) => usedMediaKeys.add(f.imageKey));

  return (
    <Document title={`${copyData.brand} Plan — ${intake.name}`}>
      <Page size="A4" style={s.page}>
        {watermark && <Text style={s.watermark}>PREVIEW</Text>}
        <Text style={s.coverTitle}>{copyData.brand}</Text>
        <Text style={s.coverSub}>Personal Stamina & Wellness Plan</Text>
        <Text style={s.body}>Prepared for: {intake.name}</Text>
        <Text style={s.body}>Date: {formatDate()}</Text>
        <Text style={s.muted}>{copyData.reportVersion}</Text>
        <Text style={{ ...s.body, marginTop: 24 }}>{plan.introParagraph}</Text>
        <Text style={s.footer}>{copyData.disclaimer}</Text>
      </Page>

      <Page size="A4" style={s.page}>
        <Text style={s.h1}>Your profile</Text>
        <Text style={s.body}>Age: {intake.age}</Text>
        <Text style={s.body}>
          BMI: {plan.bmi} ({plan.bmiCategory})
        </Text>
        <Text style={s.body}>
          Primary goal: {intake.goal.replace(/_/g, " ")}
        </Text>
        <Text style={s.body}>
          Readiness score: {plan.readinessScore}/10 (lifestyle screening, not
          a medical score)
        </Text>
        <Text style={s.body}>Activity: {intake.activity}</Text>

        {plan.medicalBlock && (
          <View style={s.medical}>
            <Text style={s.h2}>{copyData.medicalBlock.title}</Text>
            <Text style={s.body}>{copyData.medicalBlock.body}</Text>
          </View>
        )}

        <Text style={s.h1}>Exercise plan</Text>
        {exercises.map((ex) => (
          <View key={ex.id} style={s.card} wrap={false}>
            <Image src={mediaUrl(ex.imageKey)} style={s.cardImage} />
            <Text style={s.h2}>{ex.title}</Text>
            {ex.steps.map((step, i) => (
              <Text key={i} style={s.body}>
                • {step}
              </Text>
            ))}
            <Text style={s.muted}>Frequency: {ex.frequency}</Text>
          </View>
        ))}
        <Text style={s.footer}>{copyData.disclaimer}</Text>
      </Page>

      <Page size="A4" style={s.page}>
        <Text style={s.h1}>Nutrition — eat more</Text>
        <Text style={s.body}>{dietText}</Text>
        {eatFoods.map((food) => (
          <View key={food.id} style={s.row} wrap={false}>
            <Image src={mediaUrl(food.imageKey)} style={s.foodImage} />
            <View style={{ flex: 1 }}>
              <Text style={s.h2}>{food.title}</Text>
              <Text style={s.body}>{food.why}</Text>
              <Text style={s.muted}>{food.portion}</Text>
            </View>
          </View>
        ))}

        <Text style={s.h1}>Limit or avoid</Text>
        {limitFoods.map((food) => (
          <View key={food.id} style={s.row} wrap={false}>
            <Image src={mediaUrl(food.imageKey)} style={s.foodImage} />
            <View style={{ flex: 1 }}>
              <Text style={s.h2}>{food.title}</Text>
              <Text style={s.body}>{food.why}</Text>
              <Text style={s.muted}>{food.portion}</Text>
            </View>
          </View>
        ))}
        <Text style={s.footer}>{copyData.disclaimer}</Text>
      </Page>

      <Page size="A4" style={s.page}>
        <Text style={s.h1}>Sample day</Text>
        <Text style={s.body}>Breakfast: {copyData.sampleDay.breakfast}</Text>
        <Text style={s.body}>Lunch: {copyData.sampleDay.lunch}</Text>
        <Text style={s.body}>Dinner: {copyData.sampleDay.dinner}</Text>
        <Text style={s.body}>Snacks: {copyData.sampleDay.snacks}</Text>

        <Text style={s.h1}>What to expect</Text>
        <Text style={s.body}>{timeline}</Text>
        <Text style={s.body}>{copyData.timeline.weeks_1_2}</Text>
        <Text style={s.body}>{copyData.timeline.weeks_3_6}</Text>
        <Text style={s.body}>{copyData.timeline.weeks_6_8}</Text>

        <Text style={s.h1}>4-week habit tracker</Text>
        {["Sleep 7+ hours", "Exercise session", "Alcohol-free day", "Tracked mood 1–10"].map(
          (label) => (
            <View key={label}>
              <Text style={s.body}>{label}</Text>
              {[1, 2, 3, 4].map((w) => (
                <Text key={w} style={s.trackerBox}>
                  Week {w}: [ ] [ ] [ ] [ ] [ ] [ ] [ ]
                </Text>
              ))}
            </View>
          )
        )}
        {orderId && (
          <Text style={s.muted}>
            {copyData.demoNotice} Order: {orderId}
          </Text>
        )}
        <Text style={s.footer}>{copyData.disclaimer}</Text>
      </Page>

      <Page size="A4" style={s.page}>
        <Text style={s.h1}>Image credits (Unsplash)</Text>
        <Text style={s.body}>
          Images are used under the Unsplash License for educational illustration.
        </Text>
        {[...usedMediaKeys].map((key) => {
          const m = mediaData[key as MediaKey];
          if (!m) return null;
          return (
            <Text key={key} style={s.muted}>
              {key}: Photo by {m.photographer} — {m.unsplashLink}
            </Text>
          );
        })}
        <Text style={{ ...s.body, marginTop: 16 }}>{copyData.disclaimer}</Text>
      </Page>
    </Document>
  );
}
