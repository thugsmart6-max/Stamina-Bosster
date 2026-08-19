"use client";

import { AppIcon } from "@/components/app-icon";
import { Button, type ButtonProps } from "@/components/ui/button";
import type { Locale } from "@/i18n/routing";
import { useRouter } from "@/i18n/navigation";
import { downloadReportPdf } from "@/lib/download-report";
import { useState } from "react";

export function DownloadReportButton({
  orderId,
  locale,
  label,
  className,
  size = "sm",
  variant = "pill",
  look = "default",
  redirectToDashboard = false,
}: {
  orderId: string;
  locale: Locale;
  label: string;
  className?: string;
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
  look?: "default" | "start";
  redirectToDashboard?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    setLoading(true);
    setError(null);
    const result = await downloadReportPdf(orderId, locale);
    setLoading(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    if (redirectToDashboard) {
      router.push("/dashboard");
    }
  }

  return (
    <div className={className}>
      {look === "start" ? (
        <button
          type="button"
          className="start-pill start-pill--invert w-full sm:w-auto"
          disabled={loading}
          onClick={handleDownload}
        >
          {loading ? "Preparing PDF…" : label}
        </button>
      ) : (
        <Button
          type="button"
          variant={variant}
          size={size}
          className="w-full gap-2 sm:w-auto"
          disabled={loading}
          onClick={handleDownload}
        >
          <AppIcon name="pdf" size={size === "lg" ? 18 : 16} className="text-accent-foreground" />
          {loading ? "Preparing PDF…" : label}
        </Button>
      )}
      {error ? (
        <p className="mt-2 text-xs leading-relaxed text-warning" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
