"use client";

import { InputWithIcon } from "@/components/input-with-icon";
import type { IconName } from "@/lib/icon-registry";
import { motion, useReducedMotion } from "framer-motion";
import type { InputHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

type AuthFormFieldProps = {
  id: string;
  label: string;
  icon?: IconName;
  error?: string;
  hint?: string;
  trailing?: ReactNode;
  className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "size">;

export const AuthFormField = forwardRef<HTMLInputElement, AuthFormFieldProps>(
  function AuthFormField(
    {
      id,
      label,
      icon,
      error,
      hint,
      trailing,
      className,
      ...inputProps
    },
    ref
  ) {
    const reduce = useReducedMotion();
    const hasError = Boolean(error);

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none text-foreground/85"
        >
          {label}
        </label>
        <InputWithIcon
          id={id}
          ref={ref}
          icon={icon}
          trailing={trailing}
          hasError={hasError}
          inputClassName={className}
          aria-invalid={hasError || undefined}
          aria-describedby={
            hasError ? `${id}-error` : hint ? `${id}-hint` : undefined
          }
          {...inputProps}
        />
        {hint && !hasError ? (
          <p id={`${id}-hint`} className="text-sm leading-snug text-muted/85">
            {hint}
          </p>
        ) : null}
        {hasError ? (
          <motion.p
            id={`${id}-error`}
            role="alert"
            initial={reduce ? false : { opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-s-2 border-red/35 ps-3 text-sm leading-snug text-red/85"
          >
            {error}
          </motion.p>
        ) : null}
      </div>
    );
  }
);

AuthFormField.displayName = "AuthFormField";
