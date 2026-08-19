import type { OrderRecord } from "@/lib/types";

const PREMIUM_STATUSES = new Set(["paid", "fulfilled"]);

export function isPremiumOrderStatus(status: string | undefined): boolean {
  if (!status) return false;
  return PREMIUM_STATUSES.has(status);
}

export function hasPremiumFromOrders(orders: Pick<OrderRecord, "status">[]): boolean {
  return orders.some((o) => isPremiumOrderStatus(o.status));
}
