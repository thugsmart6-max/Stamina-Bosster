"use client";

import { AppIcon } from "@/components/app-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type AuthSubmitButtonProps = {
  idleLabel: string;
  loadingLabel: string;
  successLabel: string;
  icon?: "lock" | "sparkles";
  state: "idle" | "loading" | "success";
  disabled?: boolean;
  className?: string;
};

export function AuthSubmitButton({
  idleLabel,
  loadingLabel,
  successLabel,
  icon = "lock",
  state,
  disabled,
  className,
}: AuthSubmitButtonProps) {
  const reduce = useReducedMotion();
  const label =
    state === "loading" ? loadingLabel : state === "success" ? successLabel : idleLabel;
  const isBusy = state === "loading";

  return (
    <Button
      type="submit"
      variant="pill"
      size="md"
      disabled={disabled || state !== "idle"}
      aria-busy={isBusy}
      className={cn(
        "auth-cta relative !h-[52px] min-h-[52px] w-full max-w-none !rounded-[12px] px-6 text-base font-semibold normal-case tracking-normal",
        "shadow-[0_6px_36px_-10px_rgba(14,143,156,0.45),inset_0_1px_0_rgba(255,255,255,0.12)]",
        "transition-[transform,box-shadow,filter,opacity,background-color] duration-200 ease-out",
        "hover:shadow-[0_10px_44px_-10px_rgba(14,143,156,0.55),inset_0_1px_0_rgba(255,255,255,0.16)] hover:brightness-[1.05]",
        "active:scale-[0.99] active:brightness-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:active:scale-100",
        state === "success" && "bg-accent text-accent-foreground shadow-none",
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={state}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.14 }}
          className="!flex w-full min-w-0 flex-nowrap items-center justify-center gap-2.5"
        >
          {state === "loading" ? (
            <span
              className="inline-block h-[1.125rem] w-[1.125rem] shrink-0 animate-spin rounded-full border-2 border-accent-foreground/25 border-t-accent-foreground"
              aria-hidden
            />
          ) : state === "success" ? (
            <AppIcon name="check" size={18} className="shrink-0 text-accent-foreground" />
          ) : (
            <AppIcon name={icon} size={18} className="shrink-0 text-accent-foreground" />
          )}
          <span className="shrink-0 text-center leading-snug">{label}</span>
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}
