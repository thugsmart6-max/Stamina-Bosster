"use client";

import { AppIcon } from "@/components/app-icon";
import type { IconName } from "@/lib/icon-registry";
import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

/** Leading icon size (px) — keep all auth fields visually consistent */
export const AUTH_FIELD_ICON_PX = 18;

export type InputWithIconProps = {
  id: string;
  icon?: IconName;
  trailing?: ReactNode;
  hasError?: boolean;
  className?: string;
  inputClassName?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "size">;

const RAIL = "w-12 min-w-12 max-w-12 shrink-0"; /* 48px */
/* Rail margins: reliable gutter when flex gap resolves inconsistently across engines */
const SHELL =
  "input-with-icon auth-input-shell flex h-[52px] w-full min-w-0 items-stretch overflow-hidden rounded-[12px] border border-foreground/12 bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition-[border-color,box-shadow,background-color] duration-150";

/**
 * Bordered control: 48px leading icon rail, 16px text, optional 48px trailing rail (e.g. password visibility).
 */
export const InputWithIcon = forwardRef<HTMLInputElement, InputWithIconProps>(
  function InputWithIcon(
    {
      id,
      icon,
      trailing,
      hasError,
      className,
      inputClassName,
      ...inputProps
    },
    ref
  ) {
    const railIcon = (
      <div
        data-auth-icon-slot
        className={cn(
          RAIL,
          "me-2 flex flex-col items-center justify-center self-stretch overflow-hidden border-e border-foreground/10 bg-foreground/[0.03] text-muted/90"
        )}
        aria-hidden
      >
        {icon ? (
          <AppIcon
            name={icon}
            size={AUTH_FIELD_ICON_PX}
            className={cn(hasError ? "text-red/85" : "text-muted/90")}
          />
        ) : null}
      </div>
    );

    return (
      <div className={cn("relative w-full min-w-0", className)}>
        <div
          className={cn(
            SHELL,
            hasError
              ? "border-red/40 bg-red/[0.06]"
              : "hover:border-foreground/20 hover:bg-surface"
          )}
        >
          {icon ? railIcon : null}
          <input
            id={id}
            ref={ref}
            className={cn(
              "min-h-0 min-w-0 flex-1 border-0 bg-transparent py-0 text-base leading-normal text-foreground outline-none ring-0",
              "placeholder:text-muted/55",
              "focus:outline-none focus:ring-0",
              icon && trailing && "ps-2 pe-3",
              icon && !trailing && "ps-2 pe-4",
              !icon && "px-4",
              inputClassName
            )}
            {...inputProps}
          />
          {trailing ? (
            <div
              data-auth-trailing-slot
              className={cn(
                RAIL,
                "ms-2 flex flex-col items-center justify-center self-stretch overflow-hidden border-s bg-foreground/[0.03] text-foreground/85",
                hasError ? "border-red/25 bg-red/[0.05]" : "border-foreground/10"
              )}
            >
              {trailing}
            </div>
          ) : null}
        </div>
      </div>
    );
  }
);

InputWithIcon.displayName = "InputWithIcon";
