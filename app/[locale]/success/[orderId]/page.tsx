import { SuccessReportPreview } from "@/components/success-report-preview";
import { isDemoPaymentMode } from "@/lib/content";

export default async function SuccessPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  return (
    <SuccessReportPreview
      orderId={orderId}
      showDemoNotice={isDemoPaymentMode()}
    />
  );
}
