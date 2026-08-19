import { Document } from "@react-pdf/renderer";
import type { Locale } from "@/i18n/routing";
import { PerformanceGuidePages } from "./PerformanceGuideDocument";
import { PlanPages } from "./PlanPages";
import { ProfileSummaryPages } from "./ProfileSummaryPages";
import type { ReportProps } from "./ReportDocument";

export function FullReportDocument({
  intake,
  plan,
  locale = "en",
  watermark,
  orderId,
}: ReportProps & { locale?: Locale }) {
  return (
    <Document title={`Stamina Booster — ${intake.name}`}>
      <ProfileSummaryPages
        intake={intake}
        plan={plan}
        locale={locale}
        watermark={watermark}
      />
      <PlanPages
        intake={intake}
        plan={plan}
        locale={locale}
        watermark={watermark}
        orderId={orderId}
      />
      <PerformanceGuidePages
        locale={locale}
        skipCover
        watermark={watermark}
        startNum={6}
      />
    </Document>
  );
}
