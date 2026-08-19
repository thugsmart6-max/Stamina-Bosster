"use client";

import { defaultIconVariant } from "@/lib/icon-registry";
import { cn } from "@/lib/utils";
import { Eye, EyeSlash } from "iconsax-react";

type Props = {
  visible: boolean;
  onToggle: () => void;
  labelShow: string;
  labelHide: string;
};

/** Trailing-slot control for `InputWithIcon` — fills 52px rail, 44px+ hit target. */
export function PasswordVisibilityToggle({
  visible,
  onToggle,
  labelShow,
  labelHide,
}: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={visible ? labelHide : labelShow}
      aria-pressed={visible}
      className={cn(
        "flex h-full min-h-[52px] w-full min-w-0 items-center justify-center rounded-lg",
        "text-foreground/80 transition-colors",
        "hover:bg-white/[0.12] hover:text-foreground active:bg-white/[0.16]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/50"
      )}
    >
      <span className="flex items-center justify-center [&_svg]:!block [&_svg]:shrink-0 [&_svg]:leading-none">
        {visible ? (
          <EyeSlash
            size={18}
            variant={defaultIconVariant}
            color="currentColor"
            className="shrink-0 opacity-90"
            aria-hidden
          />
        ) : (
          <Eye
            size={18}
            variant={defaultIconVariant}
            color="currentColor"
            className="shrink-0 opacity-90"
            aria-hidden
          />
        )}
      </span>
    </button>
  );
}
