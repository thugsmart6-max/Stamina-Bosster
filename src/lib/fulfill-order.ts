import { generateFullReportPdf } from "@/lib/pdf/generate";
import { getSession, saveOrder } from "@/lib/session-store";
import { createOrderRecord, persistOrderPdf } from "@/lib/storage";

export async function fulfillOrder(
  orderId: string,
  sessionId: string,
  email?: string,
  userId?: string
): Promise<{ ok: boolean; error?: string }> {
  const session = await getSession(sessionId);
  if (!session) {
    return { ok: false, error: "Session expired" };
  }

  const resolvedUserId = userId ?? session.userId;
  if (!resolvedUserId) {
    return { ok: false, error: "User not linked to session" };
  }

  const pdf = await generateFullReportPdf({
    intake: session.intake,
    plan: session.plan,
    watermark: false,
    orderId,
    locale: (session.locale as "en" | "hi" | "ta") ?? "en",
  });

  const order = createOrderRecord({
    orderId,
    sessionId,
    planSessionId: sessionId,
    userId: resolvedUserId,
    stripeSessionId: orderId.startsWith("cs_") ? orderId : undefined,
    name: session.intake.name,
    email,
    status: "paid",
  });

  await saveOrder(order);
  await persistOrderPdf(orderId, pdf);

  return { ok: true };
}
