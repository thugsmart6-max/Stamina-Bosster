import { getCurrentUser } from "@/lib/auth/guards";
import { hasPaidAccessCookie } from "@/lib/funnel-cookies";
import { hasPremiumFromOrders } from "@/lib/orders";
import { getOrdersByUserId } from "@/lib/session-store";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const orders = await getOrdersByUserId(user.id);
  const paidFromOrders = hasPremiumFromOrders(orders);
  const paidFromCookie = await hasPaidAccessCookie();
  const hasPremium = paidFromOrders || paidFromCookie;

  return NextResponse.json({
    hasPremium,
    orders: orders.map((o) => ({
      orderId: o.orderId,
      name: o.name,
      email: o.email,
      status: o.status ?? "paid",
      blobUrl: o.blobUrl,
      createdAt: o.createdAt,
    })),
  });
}
