"use client";

import { track } from "@/lib/analytics";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export function SuccessOrderConfirm({ orderId }: { orderId: string }) {
  const t = useTranslations("success");
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
          const data = (await res.json()) as { ready?: boolean };
          if (data.ready) {
            setStatus("ready");
            return;
          }
        }
        setStatus("error");
      } catch {
        setStatus("error");
      }
    }

    void confirm();
  }, [orderId]);

  if (status === "loading") {
    return (
      <p className="mt-4 animate-pulse text-sm text-muted">{t("preparingDownload")}</p>
    );
  }

  if (status === "error") {
    return <p className="mt-4 text-sm text-warning">{t("confirmError")}</p>;
  }

  return null;
}
