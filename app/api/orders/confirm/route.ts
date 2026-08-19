import { requireAuth } from "@/lib/auth/guards";
import { setPaidAccessCookie } from "@/lib/funnel-cookies";
import { getOrder } from "@/lib/session-store";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  orderId: z.string().min(1),
});

export async function POST(request: Request) {
  const auth = await requireAuth(request);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const ct = request.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) {
    return NextResponse.json(
      { error: "Content-Type must be application/json" },
      { status: 415 }
    );
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
  }

  const order = await getOrder(parsed.data.orderId);
  if (!order) {
    return NextResponse.json({ ok: true, ready: false });
  }

  if (!order.userId || order.userId !== auth.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (order.status !== "paid") {
    return NextResponse.json({ ok: true, ready: false });
  }

  await setPaidAccessCookie();
  return NextResponse.json({ ok: true, ready: true });
}
