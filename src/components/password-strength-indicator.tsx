"use client";

import { AppIcon } from "@/components/app-icon";
import { cn } from "@/lib/utils";
import {
  getPasswordStrength,
  getPasswordStrengthPercent,
  type PasswordStrength,
} from "@/lib/password-strength";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

const strengthColors: Record<PasswordStrength, string> = {
  0: "bg-foreground/[0.04]",
  1: "bg-red/90",
  2: "bg-warning/90",
  3: "bg-accent/75",
  4: "bg-accent",
};

export function PasswordStrengthIndicator({ password }: { password: string }) {
  const t = useTranslations("auth");
  const reduce = useReducedMotion();
  const strength = getPasswordStrength(password);
  const percent = getPasswordStrengthPercent(strength);

  const labels: Record<Exclude<PasswordStrength, 0>, string> = {
    1: t("passwordStrengthWeak"),
    2: t("passwordStrengthFair"),
    3: t("passwordStrengthGood"),
    4: t("passwordStrengthStrong"),
  };

  if (!password) return null;

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="flex flex-col gap-2 pt-1"
      aria-live="polite"
    >
      <div className="flex items-center justify-between gap-3 text-[12px]">
        <span className="text-muted/90">{t("passwordStrengthLabel")}</span>
        <span
          className={cn(
            "font-medium tabular-nums",
            strength <= 1 && "text-error/85",
            strength === 2 && "text-warning/90",
            strength >= 3 && "text-accent/95"
          )}
        >
          {strength > 0 ? labels[strength as Exclude<PasswordStrength, 0>] : ""}
        </span>
      </div>
      <div
        className="h-1 overflow-hidden rounded-full bg-white/[0.08]"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={t("passwordStrengthLabel")}
      >
        <motion.div
          className={cn("h-full rounded-full", strengthColors[strength])}
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <ul className="grid gap-2 text-[12px] leading-snug text-muted/80 sm:grid-cols-2">
        <StrengthCheck met={password.length >= 8} label={t("passwordRuleLength")} />
        <StrengthCheck
          met={/[A-Z]/.test(password) && /[a-z]/.test(password)}
          label={t("passwordRuleCase")}
        />
        <StrengthCheck met={/\d/.test(password)} label={t("passwordRuleNumber")} />
        <StrengthCheck met={/[^a-zA-Z0-9]/.test(password)} label={t("passwordRuleSymbol")} />
      </ul>
    </motion.div>
  );
}

function StrengthCheck({ met, label }: { met: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2">
      <AppIcon
        name={met ? "check" : "lie"}
        size={12}
        className={cn("shrink-0 opacity-70", met ? "text-accent/90" : "text-muted/45")}
      />
      <span className={cn(met && "text-foreground/75")}>{label}</span>
    </li>
  );
}
