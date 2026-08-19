import { renderToBuffer } from "@react-pdf/renderer";
import { ReportDocument, type ReportProps } from "./ReportDocument";

export async function generateReportPdf(
  props: ReportProps
): Promise<Buffer> {
  const doc = ReportDocument(props);
  const buffer = await renderToBuffer(doc);
  return Buffer.from(buffer);
}
