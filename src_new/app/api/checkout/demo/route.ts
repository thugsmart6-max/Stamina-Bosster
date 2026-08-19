import { requireVerifiedAuth } from "@/lib/auth/guards";
import { isDemoCheckoutEnabled } from "@/lib/content";
import { setPaidAccessCookie } from "@/lib/funnel-cookies";
import { fulfillOrder } from "@/lib/fulfill-order";
import { getPaymentProvider } from "@/lib/payments";
import { getSessionIdFromCookie } from "@/lib/session-cookie";
import { NextResponse } from "next/server";
import { z } from "zod";

const checkoutSchema = z.object({
  cardNumber: z.string().min(13),
  expiry: z.string(),
  cvc: z.string().min(3),
  nameOnCard: z.string().min(2),
  email: z.string().email().optional(),
  acceptDisclaimer: z.boolean().optional(),
});

export async function POST(request: Request) {
  if (!isDemoCheckoutEnabled()) {
    return NextResponse.json(
      { error: "Demo checkout requires PAYMENT_MODE=demo" },
      { status: 403 }
    );
  }

  const auth = await requireVerifiedAuth(request);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const sessionId = await getSessionIdFromCookie();
  if (!sessionId) {
    return NextResponse.json({ error: "No session" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checkout data" }, { status: 400 });
  }

  if (!parsed.data.acceptDisclaimer) {
    return NextResponse.json(
      { error: "Please accept the educational disclaimer" },
      { status: 400 }
    );
  }

  const provider = getPaymentProvider();
  const result = await provider.confirmPayment({
    sessionId,
    cardNumber: parsed.data.cardNumber,
    expiry: parsed.data.expiry,
    cvc: parsed.data.cvc,
    nameOnCard: parsed.data.nameOnCard,
  });

  if (!result.success || !result.orderId) {
    return NextResponse.json(
      { error: result.error ?? "Payment failed" },
      { status: 400 }
    );
  }

  const fulfilled = await fulfillOrder(
    result.orderId,
    sessionId,
    parsed.data.email ?? auth.user.email,
    auth.user.id
  );

  if (!fulfilled.ok) {
    return NextResponse.json(
      { error: fulfilled.error ?? "Order fulfillment failed" },
      { status: 500 }
    );
  }

  await setPaidAccessCookie();

  return NextResponse.json({
    success: true,
    orderId: result.orderId,
  });
}
