import { generateReportPdf } from "@/lib/pdf/generate";
import { getSession } from "@/lib/session-store";
import { createOrderRecord, persistOrderPdf } from "@/lib/storage";
import { saveOrder } from "@/lib/session-store";
import { sendOrderEmail } from "@/lib/email";

export async function fulfillOrder(
  orderId: string,
  sessionId: string,
  email?: string
): Promise<{ ok: boolean; error?: string }> {
  const session = getSession(sessionId);
  if (!session) {
    return { ok: false, error: "Session expired" };
  }

  const pdf = await generateReportPdf({
    intake: session.intake,
    plan: session.plan,
    watermark: false,
    orderId,
  });

  const order = createOrderRecord(
    orderId,
    sessionId,
    session.intake.name,
    email
  );
  saveOrder(order);
  await persistOrderPdf(orderId, pdf);

  if (email) {
    await sendOrderEmail({
      to: email,
      name: session.intake.name,
      orderId,
    });
  }

  return { ok: true };
}
