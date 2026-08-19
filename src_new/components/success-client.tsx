"use client";

import { track } from "@/lib/analytics";
import { useEffect, useState } from "react";

export function SuccessOrderConfirm({ orderId }: { orderId: string }) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    track("purchase_completed", { orderId });

    async function confirm() {
      try {
        const res = await fetch("/api/orders/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.ready) {
            setStatus("ready");
            return;
          }
        }
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    }

    confirm();
  }, [orderId]);

  if (status === "loading") {
    return (
      <p className="mt-4 text-sm text-muted animate-pulse">
        Preparing your download…
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="mt-4 text-sm text-warning">
        If download fails, refresh in a moment or contact support with your
        order ID.
      </p>
    );
  }

  return null;
}
