import { Document } from "@react-pdf/renderer";
import copyData from "../../../data/copy.json";
import type { Locale } from "@/i18n/routing";
import type { IntakeData, PlanResult } from "../types";
import { PlanPages } from "./PlanPages";
import { ProfileSummaryPages } from "./ProfileSummaryPages";

export interface ReportProps {
  intake: IntakeData;
  plan: PlanResult;
  watermark?: boolean;
  orderId?: string;
  locale?: Locale;
}

export function ReportPages({
  intake,
  plan,
  watermark,
  orderId,
  locale = "en",
}: ReportProps) {
  return (
    <>
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
    </>
  );
}

export function ReportDocument(props: ReportProps) {
  return (
    <Document title={`${copyData.brand} Plan — ${props.intake.name}`}>
      <ReportPages {...props} />
    </Document>
  );
}
