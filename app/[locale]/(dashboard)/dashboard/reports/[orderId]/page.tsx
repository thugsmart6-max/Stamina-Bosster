import { ReportViewerClient } from "@/components/dashboard/report-viewer-client";

export default async function DashboardReportDetailPage({
  params,
}: {
  params: Promise<{ locale: string; orderId: string }>;
}) {
  const { orderId } = await params;
  return <ReportViewerClient orderId={orderId} />;
}
