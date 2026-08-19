import { Text, View } from "@react-pdf/renderer";
import type { Locale } from "@/i18n/routing";
import { PdfText } from "./PdfText";
import type { PdfStyles } from "./styles";

export function PdfWordmark({
  locale,
  s,
  invert = false,
}: {
  locale: Locale;
  s: PdfStyles;
  invert?: boolean;
}) {
  return (
    <View>
      <PdfText locale={locale} style={invert ? s.wordmarkTopInvert : s.wordmarkTop}>
        STAMINA
      </PdfText>
      <View style={s.wordmarkRow}>
        <View style={invert ? s.dotInvert : s.dot} />
        <PdfText locale={locale} style={invert ? s.wordmarkBotInvert : s.wordmarkBot}>
          BOOSTER
        </PdfText>
      </View>
    </View>
  );
}

export function PdfSectionHead({
  locale,
  s,
  num,
  kicker,
  title,
  accent,
}: {
  locale: Locale;
  s: PdfStyles;
  num: string;
  kicker: string;
  title: string;
  accent?: "berry" | "teal" | "gold";
}) {
  const kickerStyle =
    accent === "berry"
      ? [s.kicker, s.kickerBerry]
      : accent === "teal"
        ? [s.kicker, s.kickerTeal]
        : accent === "gold"
          ? [s.kicker, s.kickerGold]
          : s.kicker;

  return (
    <View style={s.sectionHead}>
      <View style={s.sectionHeadTop}>
        <PdfText locale={locale} style={s.sectionNum}>
          {num}
        </PdfText>
        <PdfText locale={locale} style={kickerStyle}>
          {kicker}
        </PdfText>
      </View>
      <PdfText locale={locale} style={s.sectionTitle}>
        {title}
      </PdfText>
      <View style={s.hairline} />
    </View>
  );
}

export function PdfWatermark({
  locale,
  s,
  label,
  show,
}: {
  locale: Locale;
  s: PdfStyles;
  label: string;
  show?: boolean;
}) {
  if (!show) return null;
  return (
    <PdfText locale={locale} style={s.watermark} fixed>
      {label}
    </PdfText>
  );
}

export function PdfFooter({
  locale,
  s,
  disclaimer,
}: {
  locale: Locale;
  s: PdfStyles;
  disclaimer: string;
}) {
  return (
    <View style={s.pageFooter} fixed>
      <View style={s.footerRule} />
      <View style={s.footerRow}>
        <PdfText locale={locale} style={s.footerBrand}>
          STAMINA BOOSTER
        </PdfText>
        <Text
          style={s.footerPage}
          render={({ pageNumber, totalPages }) =>
            `${String(pageNumber).padStart(2, "0")}  /  ${String(totalPages).padStart(2, "0")}`
          }
        />
      </View>
      <PdfText locale={locale} style={s.footerDisclaimer}>
        {disclaimer}
      </PdfText>
    </View>
  );
}
