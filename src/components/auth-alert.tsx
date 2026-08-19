"use client";

import { AppIcon } from "@/components/app-icon";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type AuthAlertProps = {
  message: string;
  variant?: "error" | "success" | "info";
  className?: string;
};

const variants = {
  error: {
    container:
      "border border-red/20 bg-red/[0.04] text-error/90 shadow-none",
    icon: "warning" as const,
  },
  success: {
    container:
      "border border-accent/25 bg-accent/[0.06] text-accent shadow-none",
    icon: "check" as const,
  },
  info: {
    container: "border border-border bg-surface-elevated text-muted",
    icon: "shield" as const,
  },
};

export function AuthAlert({ message, variant = "error", className }: AuthAlertProps) {
  const reduce = useReducedMotion();
  const style = variants[variant];

  return (
    <AnimatePresence mode="wait">
      {message ? (
        <motion.div
          key={message}
          role={variant === "error" ? "alert" : "status"}
          initial={reduce ? false : { opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -2 }}
          transition={{ duration: reduce ? 0 : 0.2 }}
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] leading-snug",
            style.container,
            className
          )}
        >
          <AppIcon name={style.icon} size={16} className="shrink-0 opacity-90" />
          <span>{message}</span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
