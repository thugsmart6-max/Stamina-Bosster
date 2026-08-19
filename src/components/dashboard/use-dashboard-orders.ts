"use client";

import { useEffect, useState } from "react";

export type DashboardOrder = {
  orderId: string;
  name: string;
  email?: string;
  status: string;
  blobUrl?: string;
  createdAt: string;
};

type OrdersApiResponse = {
  orders?: DashboardOrder[];
  hasPremium?: boolean;
};

export function useDashboardOrders() {
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [hasPremium, setHasPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/orders")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("orders"))))
      .then((data: OrdersApiResponse) => {
        if (cancelled) return;
        setOrders(data.orders ?? []);
        setHasPremium(Boolean(data.hasPremium));
      })
      .catch(() => {
        if (!cancelled) {
          setOrders([]);
          setHasPremium(false);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { orders, hasPremium, loading };
}
