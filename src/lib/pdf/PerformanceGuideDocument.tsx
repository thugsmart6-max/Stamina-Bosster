import { Document, Page, View } from "@react-pdf/renderer";
import type { Locale } from "@/i18n/routing";
import { getLocalizedGuideContent } from "@/lib/performance-guide-locale";
import { getPdfCopy } from "./copy";
import {
  PdfFooter,
  PdfSectionHead,
  PdfWatermark,
  PdfWordmark,
} from "./PdfChrome";
import { PdfText } from "./PdfText";
import { createPdfStyles, type PdfStyles } from "./styles";

function TableSection({
  title,
  headers,
  rows,
  s,
  locale,
}: {
  title?: string;
  headers: string[];
  rows: string[][];
  s: PdfStyles;
  locale: Locale;
}) {
  return (
    <View style={{ marginBottom: 14 }}>
      {title ? (
        <PdfText locale={locale} style={s.pdfSectionTitle}>
          {title}
        </PdfText>
      ) : null}
      <View style={s.tableHeadRow}>
        {headers.map((h) => (
          <PdfText key={h} locale={locale} style={s.tableHeadCell}>
            {h}
          </PdfText>
        ))}
      </View>
      {rows.map((row, i) => (
        <View key={i} style={s.tableRow} wrap={false}>
          {row.map((cell, j) => (
            <PdfText key={j} locale={locale} style={s.tableCell}>
              {cell}
            </PdfText>
          ))}
        </View>
      ))}
    </View>
  );
}

function TwoColSection({
  title,
  rows,
  headers,
  s,
  locale,
}: {
  title: string;
  rows: { food: string; why: string }[];
  headers: [string, string];
  s: PdfStyles;
  locale: Locale;
}) {
  return (
    <TableSection
      title={title}
      headers={[...headers]}
      rows={rows.map((r) => [r.food, r.why])}
      s={s}
      locale={locale}
    />
  );
}

export function PerformanceGuidePages({
  locale,
  skipCover = false,
  watermark,
  startNum = 1,
}: {
  locale: Locale;
  skipCover?: boolean;
  watermark?: boolean;
  startNum?: number;
}) {
  const g = getLocalizedGuideContent(locale);
  const h = g.headers;
  const s = createPdfStyles(locale);
  const copy = getPdfCopy(locale);
  const mark = copy.watermark.toUpperCase();
  const n = (offset: number) => String(startNum + offset).padStart(2, "0");

  return (
    <>
      {skipCover ? null : (
        <Page size="A4" style={s.coverPage}>
          <PdfWatermark locale={locale} s={s} label={mark} show={watermark} />
          <View style={s.coverTop}>
            <PdfWordmark locale={locale} s={s} invert />
          </View>
          <View style={s.coverKickerRow}>
            <PdfText locale={locale} style={s.kickerInvert}>
              {copy.reference}
            </PdfText>
            <PdfText locale={locale} style={s.sectionNumInvert}>
              {n(0)}
            </PdfText>
          </View>
          <PdfText locale={locale} style={s.coverName}>
            {g.title}
          </PdfText>
          <PdfText locale={locale} style={s.coverLead}>
            {g.subtitle}
          </PdfText>
        </Page>
      )}

      <Page size="A4" style={s.paperPage}>
        <PdfWatermark locale={locale} s={s} label={mark} show={watermark} />
        <PdfSectionHead
          locale={locale}
          s={s}
          num={n(skipCover ? 0 : 1)}
          kicker={copy.move}
          title={g.sections.exercisesDo}
          accent="berry"
        />
        <TableSection
          title=""
          headers={[h.exercise, h.how, h.frequency, h.benefit]}
          rows={g.exercises.map((r) => [
            r.exercise,
            r.how,
            r.frequency,
            r.benefit,
          ])}
          s={s}
          locale={locale}
        />
        <PdfText locale={locale} style={s.pdfWarning}>
          {g.exerciseWarning}
        </PdfText>
        <TableSection
          title={g.sections.avoid}
          headers={[h.avoid, h.reason]}
          rows={g.avoid.map((r) => [r.item, r.reason])}
          s={s}
          locale={locale}
        />
        <PdfFooter locale={locale} s={s} disclaimer={g.disclaimer} />
      </Page>

      <Page size="A4" style={s.paperPage}>
        <PdfWatermark locale={locale} s={s} label={mark} show={watermark} />
        <PdfSectionHead
          locale={locale}
          s={s}
          num={n(skipCover ? 1 : 2)}
          kicker={copy.fuel}
          title={g.sections.foodsPan}
          accent="teal"
        />
        <TwoColSection
          title={g.sections.foodsTamil}
          rows={g.foodsTamil}
          headers={[h.food, h.why]}
          s={s}
          locale={locale}
        />
        <TwoColSection
          title={g.sections.foodsHindi}
          rows={g.foodsHindi}
          headers={[h.food, h.why]}
          s={s}
          locale={locale}
        />
        <TwoColSection
          title={g.sections.foodsPan}
          rows={g.foodsPan}
          headers={[h.food, h.why]}
          s={s}
          locale={locale}
        />
        <PdfFooter locale={locale} s={s} disclaimer={g.disclaimer} />
      </Page>

      <Page size="A4" style={s.paperPage}>
        <PdfWatermark locale={locale} s={s} label={mark} show={watermark} />
        <PdfSectionHead
          locale={locale}
          s={s}
          num={n(skipCover ? 2 : 3)}
          kicker={copy.recover}
          title={g.sections.dailyRoutine}
          accent="gold"
        />
        <TableSection
          title=""
          rows={g.dailyRoutine.map((r) => [r.time, r.action])}
          headers={[h.time, h.action]}
          s={s}
          locale={locale}
        />
        <TableSection
          title={g.sections.healthChecks}
          headers={[h.check, h.why]}
          rows={g.healthChecks.map((r) => [r.check, r.why])}
          s={s}
          locale={locale}
        />
        <PdfText locale={locale} style={s.pdfSectionTitle}>
          {g.sections.lifestyleHabits}
        </PdfText>
        {g.lifestyleHabits.map((habit) => (
          <PdfText key={habit} locale={locale} style={s.step}>
            {habit}
          </PdfText>
        ))}
        <PdfFooter locale={locale} s={s} disclaimer={g.disclaimer} />
      </Page>

      <Page size="A4" style={s.paperPage}>
        <PdfWatermark locale={locale} s={s} label={mark} show={watermark} />
        <PdfSectionHead
          locale={locale}
          s={s}
          num={n(skipCover ? 3 : 4)}
          kicker={copy.reference}
          title={g.sections.doctor}
        />
        <TableSection
          title=""
          headers={[h.sign, h.doctorAction]}
          rows={g.doctor.map((r) => [r.sign, r.action])}
          s={s}
          locale={locale}
        />
        <PdfText locale={locale} style={s.body}>
          {g.doctorFootnote}
        </PdfText>
        <PdfFooter locale={locale} s={s} disclaimer={g.disclaimer} />
      </Page>
    </>
  );
}

export function PerformanceGuideDocument({
  locale = "en",
}: {
  locale?: Locale;
}) {
  const g = getLocalizedGuideContent(locale);
  return (
    <Document title={g.title}>
      <PerformanceGuidePages locale={locale} />
    </Document>
  );
}
