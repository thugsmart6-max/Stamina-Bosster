import { requireVerifiedAuth } from "@/lib/auth/guards";
import { hasPaidAccessCookie } from "@/lib/funnel-cookies";
import { getOrder, getSession } from "@/lib/session-store";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const auth = await requireVerifiedAuth(request);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const paid = await hasPaidAccessCookie();
  if (!paid) {
    return NextResponse.json({ error: "Payment required" }, { status: 403 });
  }

  const { orderId } = await params;
  const order = await getOrder(orderId);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (!order.userId || order.userId !== auth.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const sessionId = order.planSessionId ?? order.sessionId;
  const session = sessionId ? await getSession(sessionId) : undefined;

  if (!session) {
    return NextResponse.json({ error: "Report data unavailable" }, { status: 404 });
  }

  return NextResponse.json({
    orderId: order.orderId,
    name: order.name,
    createdAt: order.createdAt,
    intake: session.intake,
    plan: session.plan,
  });
}
