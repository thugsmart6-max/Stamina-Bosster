"use client";

import { AppIcon } from "@/components/app-icon";
import { fireConfetti } from "@/lib/confetti";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

function celebrateKey(orderId: string) {
  return `vp_paid_celebrate_${orderId}`;
}

export function PaymentCelebrate({ orderId }: { orderId: string }) {
  const t = useTranslations("success");
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);

  const dismiss = useCallback(() => {
    try {
      sessionStorage.setItem(celebrateKey(orderId), "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  }, [orderId]);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(celebrateKey(orderId))) return;
    } catch {
      /* ignore */
    }
    setOpen(true);
  }, [orderId]);

  useEffect(() => {
    if (!open) return;
    if (reduce) return;
    fireConfetti(3200);
    const burst = window.setTimeout(() => fireConfetti(2200), 700);
    return () => window.clearTimeout(burst);
  }, [open, reduce]);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(dismiss, reduce ? 1800 : 4200);
    return () => window.clearTimeout(id);
  }, [open, reduce, dismiss]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="style-night fixed inset-0 z-[80] flex flex-col items-center justify-center px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-8 text-center sm:px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="payment-celebrate-title"
        >
          <p className="start-kicker text-primary">
            <span aria-hidden>01</span> {t("celebrateKicker")}
          </p>
          <h1
            id="payment-celebrate-title"
            className="display-heading mt-5 max-w-[12ch] text-balance text-[clamp(2.6rem,8vw,6rem)] leading-[0.88] text-[var(--paper)]"
          >
            {t("celebrateTitle")}
          </h1>
          <p className="mt-5 max-w-md text-pretty text-sm leading-relaxed text-white/70 md:text-base">
            {t("celebrateBody")}
          </p>
          <button
            type="button"
            className="start-pill start-pill--invert mt-10 inline-flex min-h-12 items-center gap-2 px-8"
            onClick={dismiss}
          >
            <AppIcon name="sparkles" size={16} />
            {t("celebrateCta")}
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
