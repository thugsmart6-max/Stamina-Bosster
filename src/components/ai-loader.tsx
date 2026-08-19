"use client";

import { AppIcon } from "@/components/app-icon";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const STEP_MS = 380;

export function AiLoader({
  complete = false,
  completeLabel,
}: {
  complete?: boolean;
  completeLabel?: string;
}) {
  const t = useTranslations("intake");
  const steps = [0, 1, 2].map((i) => t(`aiLoader.${i}`));
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (complete) {
      setStep(steps.length);
      return;
    }
    if (step >= steps.length - 1) return;
    const timer = window.setTimeout(() => setStep((s) => s + 1), STEP_MS);
    return () => window.clearTimeout(timer);
  }, [complete, step, steps.length]);

  const progress = complete
    ? 100
    : Math.min(92, ((step + 1) / steps.length) * 92);
  const label = complete
    ? (completeLabel ?? t("openingPreview"))
    : steps[Math.min(step, steps.length - 1)];

  return (
    <div className="flex flex-col items-center py-16 text-center" role="status" aria-live="polite">
      <div className="mb-6 h-px w-full max-w-md overflow-hidden bg-foreground/10">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="display-heading text-xl text-primary md:text-2xl">{label}</p>
      <p className="mt-2 flex items-center justify-center gap-2 text-sm text-muted">
        <AppIcon name="sparkles" size={16} className="text-primary" />
        {t("aiSubtext")}
      </p>
    </div>
  );
}
