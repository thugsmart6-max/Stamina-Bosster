import { Image, Page, View } from "@react-pdf/renderer";
import type { Locale } from "@/i18n/routing";
import { getMediaPathForPdf } from "../content";
import { getExercise, getFood } from "../i18n-content";
import type { IntakeData, PlanResult } from "../types";
import { getPdfCopy } from "./copy";
import {
  PdfFooter,
  PdfSectionHead,
  PdfWatermark,
} from "./PdfChrome";
import { PdfText } from "./PdfText";
import { createPdfStyles } from "./styles";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function PlanPages({
  plan,
  locale,
  watermark,
  orderId,
}: {
  intake: IntakeData;
  plan: PlanResult;
  locale: Locale;
  watermark?: boolean;
  orderId?: string;
}) {
  const copy = getPdfCopy(locale);
  const s = createPdfStyles(locale);
  const mark = copy.watermark.toUpperCase();

  const exercises = plan.exerciseIds
    .map((id) => getExercise(id, locale))
    .filter(Boolean);
  const eatFoods = plan.eatFoodIds
    .map((id) => getFood(id, locale))
    .filter((f) => f?.type === "eat");
  const limitFoods = plan.limitFoodIds
    .map((id) => getFood(id, locale))
    .filter((f) => f?.type === "limit");

  const dietText = copy.dietText[plan.dietVariantKey] ?? copy.dietText.normal;
  const meals = [
    [copy.meal.breakfast, copy.sampleDay.breakfast],
    [copy.meal.lunch, copy.sampleDay.lunch],
    [copy.meal.dinner, copy.sampleDay.dinner],
    [copy.meal.snacks, copy.sampleDay.snacks],
  ] as const;
  const phases = [
    copy.timeline.weeks_1_2,
    copy.timeline.weeks_3_6,
    copy.timeline.weeks_6_8,
  ];

  return (
    <>
      <Page size="A4" style={s.paperPage}>
        <PdfWatermark locale={locale} s={s} label={mark} show={watermark} />
        <PdfSectionHead
          locale={locale}
          s={s}
          num="03"
          kicker={copy.move}
          title={copy.exerciseTitle}
          accent="berry"
        />
        {exercises.map((ex, i) => {
          if (!ex) return null;
          const src = getMediaPathForPdf(ex.imageKey);
          return (
            <View key={ex.id} style={s.planRow} wrap={false}>
              {src ? <Image src={src} style={s.planImage} /> : null}
              <View style={{ flex: 1 }}>
                <PdfText locale={locale} style={s.planNum}>
                  {pad(i + 1)}
                </PdfText>
                <PdfText locale={locale} style={s.planTitle}>
                  {ex.title}
                </PdfText>
                {ex.steps.map((step) => (
                  <PdfText key={step} locale={locale} style={s.step}>
                    {step}
                  </PdfText>
                ))}
                <PdfText locale={locale} style={s.muted}>
                  {`${copy.frequency}: ${ex.frequency}`}
                </PdfText>
              </View>
            </View>
          );
        })}
        <PdfFooter locale={locale} s={s} disclaimer={copy.disclaimer} />
      </Page>

      <Page size="A4" style={s.paperPage}>
        <PdfWatermark locale={locale} s={s} label={mark} show={watermark} />
        <PdfSectionHead
          locale={locale}
          s={s}
          num="04"
          kicker={copy.fuel}
          title={copy.nutritionTitle}
          accent="teal"
        />
        <PdfText locale={locale} style={s.body}>
          {dietText}
        </PdfText>
        <PdfText locale={locale} style={s.pdfSectionTitle}>
          {copy.eatMore}
        </PdfText>
        {eatFoods.map((food, i) => {
          if (!food) return null;
          const src = getMediaPathForPdf(food.imageKey);
          return (
            <View key={food.id} style={s.row} wrap={false}>
              {src ? <Image src={src} style={s.foodImage} /> : null}
              <View style={{ flex: 1 }}>
                <PdfText locale={locale} style={s.planNum}>
                  {pad(i + 1)}
                </PdfText>
                <PdfText locale={locale} style={s.planTitle}>
                  {food.title}
                </PdfText>
                <PdfText locale={locale} style={s.step}>
                  {food.why}
                </PdfText>
                <PdfText locale={locale} style={s.muted}>
                  {food.portion}
                </PdfText>
              </View>
            </View>
          );
        })}
        <PdfText locale={locale} style={[s.pdfSectionTitle, { marginTop: 14 }]}>
          {copy.limitAvoid}
        </PdfText>
        {limitFoods.map((food) => {
          if (!food) return null;
          const src = getMediaPathForPdf(food.imageKey);
          return (
            <View key={food.id} style={s.row} wrap={false}>
              {src ? <Image src={src} style={s.foodImage} /> : null}
              <View style={{ flex: 1 }}>
                <PdfText locale={locale} style={s.planTitle}>
                  {food.title}
                </PdfText>
                <PdfText locale={locale} style={s.step}>
                  {food.why}
                </PdfText>
                <PdfText locale={locale} style={s.muted}>
                  {food.portion}
                </PdfText>
              </View>
            </View>
          );
        })}
        <PdfFooter locale={locale} s={s} disclaimer={copy.disclaimer} />
      </Page>

      <Page size="A4" style={s.paperPage} wrap={false}>
        <PdfWatermark locale={locale} s={s} label={mark} show={watermark} />
        <PdfSectionHead
          locale={locale}
          s={s}
          num="05"
          kicker={copy.recover}
          title={copy.recoverTitle}
          accent="gold"
        />
        <PdfText locale={locale} style={s.body}>
          {copy.recoverLead}
        </PdfText>

        <PdfText locale={locale} style={s.pdfSectionTitle}>
          {copy.sampleDayTitle}
        </PdfText>
        <View style={s.grid2}>
          {meals.map(([label, value]) => (
            <View key={label} style={s.cell}>
              <PdfText locale={locale} style={s.cellLabel}>
                {label}
              </PdfText>
              <PdfText locale={locale} style={s.step}>
                {value}
              </PdfText>
            </View>
          ))}
        </View>

        <PdfText locale={locale} style={s.pdfSectionTitle}>
          {copy.timelineTitle}
        </PdfText>
        {phases.map((phase, i) => (
          <View key={phase} style={s.row} wrap={false}>
            <View style={{ width: 28 }}>
              <PdfText locale={locale} style={s.planNum}>
                {pad(i + 1)}
              </PdfText>
            </View>
            <View style={{ flex: 1 }}>
              <PdfText locale={locale} style={s.step}>
                {phase}
              </PdfText>
            </View>
          </View>
        ))}

        <PdfText locale={locale} style={[s.pdfSectionTitle, { marginTop: 12 }]}>
          {copy.trackerTitle}
        </PdfText>
        <PdfText locale={locale} style={s.muted}>
          {copy.trackerHint}
        </PdfText>
        <View style={s.trackerHeadRow}>
          <View style={s.trackerNameCol} />
          <View style={s.trackerWeekRow}>
            {copy.weekShort.map((w) => (
              <View key={w} style={s.trackerCol}>
                <PdfText locale={locale} style={s.trackerWeek}>
                  {w}
                </PdfText>
              </View>
            ))}
          </View>
        </View>
        {copy.habits.map((habit) => (
          <View key={habit.title} style={s.trackerHabit} wrap={false}>
            <View style={s.trackerNameCol}>
              <PdfText locale={locale} style={s.trackerLabel}>
                {habit.title}
              </PdfText>
              <PdfText locale={locale} style={s.trackerHow}>
                {habit.how}
              </PdfText>
            </View>
            <View style={s.trackerWeekRow}>
              {copy.weekShort.map((w) => (
                <View key={w} style={s.trackerCol}>
                  <View style={s.check} />
                </View>
              ))}
            </View>
          </View>
        ))}

        {orderId ? (
          <PdfText locale={locale} style={s.muted}>
            {`${copy.demoNotice} ${copy.orderRef}: ${orderId}`}
          </PdfText>
        ) : null}
        <PdfFooter locale={locale} s={s} disclaimer={copy.disclaimer} />
      </Page>
    </>
  );
}
