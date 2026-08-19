import { renderToBuffer } from "@react-pdf/renderer";
import { FullReportDocument } from "./FullReportDocument";
import { registerPdfFonts } from "./fonts";
import { PerformanceGuideDocument } from "./PerformanceGuideDocument";
import { ReportDocument, type ReportProps } from "./ReportDocument";

export async function generateReportPdf(
  props: ReportProps
): Promise<Buffer> {
  registerPdfFonts();
  const doc = ReportDocument(props);
  const buffer = await renderToBuffer(doc);
  return Buffer.from(buffer);
}

export async function generateFullReportPdf(
  props: ReportProps & { locale?: import("@/i18n/routing").Locale }
): Promise<Buffer> {
  registerPdfFonts();
  const doc = FullReportDocument(props);
  const buffer = await renderToBuffer(doc);
  return Buffer.from(buffer);
}

export async function generatePerformanceGuidePdf(
  locale: import("@/i18n/routing").Locale = "en"
): Promise<Buffer> {
  registerPdfFonts();
  const doc = PerformanceGuideDocument({ locale });
  const buffer = await renderToBuffer(doc);
  return Buffer.from(buffer);
}
