import { Page, View } from "@react-pdf/renderer";
import type { Locale } from "@/i18n/routing";
import { formatDate } from "@/lib/utils";
import { getLocalizedGuideContent } from "@/lib/performance-guide-locale";
import {
  formatSexLabel,
  getProfileWarnings,
} from "@/lib/profile-summary";
import type { IntakeData, PlanResult } from "@/lib/types";
import {
  activityLabel,
  bmiCategoryLabel,
  erectionQualityLabel,
  getPdfCopy,
  goalLabel,
} from "./copy";
import {
  PdfFooter,
  PdfSectionHead,
  PdfWatermark,
  PdfWordmark,
} from "./PdfChrome";
import { PdfText } from "./PdfText";
import { createPdfStyles } from "./styles";

export function ProfileSummaryPages({
  intake,
  plan,
  locale,
  watermark,
}: {
  intake: IntakeData;
  plan: PlanResult;
  locale: Locale;
  watermark?: boolean;
}) {
  const guide = getLocalizedGuideContent(locale);
  const copy = getPdfCopy(locale);
  const warnings = getProfileWarnings(intake, guide.profile);
  const s = createPdfStyles(locale);
  const index = Math.round(plan.readinessScore * 10);
  const mark = copy.watermark.toUpperCase();

  return (
    <>
      <Page size="A4" style={s.coverPage}>
        <PdfWatermark locale={locale} s={s} label={mark} show={watermark} />
        <View style={s.coverTop}>
          <PdfWordmark locale={locale} s={s} invert />
          <PdfText locale={locale} style={s.kickerInvert}>
            {formatDate()}
          </PdfText>
        </View>

        <View style={s.coverKickerRow}>
          <PdfText locale={locale} style={s.kickerInvert}>
            {copy.coverKicker}
          </PdfText>
          <PdfText locale={locale} style={s.sectionNumInvert}>
            01
          </PdfText>
        </View>

        <PdfText locale={locale} style={s.coverName}>
          {intake.name}
        </PdfText>
        <PdfText locale={locale} style={s.coverLead}>
          {plan.introParagraph}
        </PdfText>

        <View style={s.coverGrid}>
          <View style={s.coverCell}>
            <PdfText locale={locale} style={s.kickerInvert}>
              {copy.indexLabel}
            </PdfText>
            <PdfText locale={locale} style={s.coverIndex}>
              {String(index)}
            </PdfText>
            <PdfText locale={locale} style={s.coverHint}>
              {`${copy.of100} · ${copy.indexHint}`}
            </PdfText>
          </View>
          <View style={s.coverCell}>
            <PdfText locale={locale} style={s.kickerInvert}>
              {copy.goal}
            </PdfText>
            <PdfText locale={locale} style={s.coverMeta}>
              {goalLabel(locale, intake.goal)}
            </PdfText>
            <PdfText locale={locale} style={s.coverHint}>
              {`${copy.preparedFor} ${intake.name}`}
            </PdfText>
          </View>
          <View style={s.coverCellLast}>
            <PdfText locale={locale} style={s.kickerInvert}>
              {copy.bmi}
            </PdfText>
            <PdfText locale={locale} style={s.coverMeta}>
              {`${plan.bmi} · ${bmiCategoryLabel(locale, plan.bmiCategory)}`}
            </PdfText>
            <PdfText locale={locale} style={s.coverHint}>
              {`${copy.readiness} ${plan.readinessScore}/10`}
            </PdfText>
          </View>
        </View>
      </Page>

      <Page size="A4" style={s.paperPage}>
        <PdfWatermark locale={locale} s={s} label={mark} show={watermark} />
        <PdfSectionHead
          locale={locale}
          s={s}
          num="02"
          kicker={guide.profile.title}
          title={copy.profileTitle}
        />

        <View style={s.profileGrid}>
          <View style={s.profileCell}>
            <PdfText locale={locale} style={s.profileLabel}>
              {guide.profile.name}
            </PdfText>
            <PdfText locale={locale} style={s.profileValue}>
              {intake.name}
            </PdfText>
          </View>
          <View style={s.profileCell}>
            <PdfText locale={locale} style={s.profileLabel}>
              {guide.profile.age}
            </PdfText>
            <PdfText locale={locale} style={s.profileValue}>
              {String(intake.age)}
            </PdfText>
          </View>
          <View style={s.profileCell}>
            <PdfText locale={locale} style={s.profileLabel}>
              {guide.profile.gender}
            </PdfText>
            <PdfText locale={locale} style={s.profileValue}>
              {formatSexLabel(intake.sex, guide.profile)}
            </PdfText>
          </View>
          <View style={s.profileCell}>
            <PdfText locale={locale} style={s.profileLabel}>
              {guide.profile.bmi}
            </PdfText>
            <PdfText locale={locale} style={s.profileValue}>
              {`${plan.bmi} (${bmiCategoryLabel(locale, plan.bmiCategory)})`}
            </PdfText>
          </View>
          <View style={s.profileCell}>
            <PdfText locale={locale} style={s.profileLabel}>
              {copy.goal}
            </PdfText>
            <PdfText locale={locale} style={s.profileValue}>
              {goalLabel(locale, intake.goal)}
            </PdfText>
          </View>
          <View style={s.profileCell}>
            <PdfText locale={locale} style={s.profileLabel}>
              {copy.erectionQuality}
            </PdfText>
            <PdfText locale={locale} style={s.profileValue}>
              {erectionQualityLabel(locale, intake.erectionQuality ?? "mixed")}
            </PdfText>
          </View>
          <View style={s.profileCell}>
            <PdfText locale={locale} style={s.profileLabel}>
              {copy.activity}
            </PdfText>
            <PdfText locale={locale} style={s.profileValue}>
              {activityLabel(locale, intake.activity)}
            </PdfText>
          </View>
        </View>

        {warnings.map((warning) => (
          <View key={warning} style={s.profileWarning}>
            <PdfText locale={locale} style={s.profileWarningText}>
              {warning}
            </PdfText>
          </View>
        ))}

        {plan.medicalBlock ? (
          <View style={s.medical}>
            <PdfText locale={locale} style={s.h2}>
              {copy.medicalTitle}
            </PdfText>
            <PdfText locale={locale} style={s.body}>
              {copy.medicalBody}
            </PdfText>
          </View>
        ) : null}

        <PdfFooter locale={locale} s={s} disclaimer={copy.disclaimer} />
      </Page>
    </>
  );
}
