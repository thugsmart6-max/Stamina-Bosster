"use client";

import { AppIcon } from "@/components/app-icon";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export function AiLoader({ onComplete }: { onComplete: () => void }) {
  const t = useTranslations("intake");
  const steps = [0, 1, 2].map((i) => t(`aiLoader.${i}`));
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= steps.length) {
      onComplete();
      return;
    }
    const timer = setTimeout(() => setStep((s) => s + 1), 1200);
    return () => clearTimeout(timer);
  }, [step, onComplete, steps.length]);

  const progress = Math.min(100, ((step + 1) / steps.length) * 100);

  return (
    <div className="flex flex-col items-center py-16 text-center">
      <div className="mb-6 h-2 w-full max-w-md overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="display-heading text-xl text-primary md:text-2xl">
        {steps[Math.min(step, steps.length - 1)]}
      </p>
      <p className="mt-2 flex items-center justify-center gap-2 text-sm text-muted">
        <AppIcon name="sparkles" size={16} className="text-primary" />
        {t("aiSubtext")}
      </p>
    </div>
  );
}
