import {
  defaultIconVariant,
  iconRegistry,
  iconVariants,
  type IconName,
  type IconVariant,
} from "@/lib/icon-registry";
import { cn } from "@/lib/utils";

type AppIconProps = {
  name?: IconName;
  className?: string;
  size?: number;
  /** Overrides the registry default variant for this icon */
  variant?: IconVariant;
};

/**
 * Iconsax SVGs are wrapped in a fixed `size × size` flex box so strokes/viewBox
 * cannot visually bleed into adjacent labels or inputs (signup/login polish).
 */
export function AppIcon({ name, className, size = 20, variant }: AppIconProps) {
  if (!name) return null;
  const Cmp = iconRegistry[name];
  if (!Cmp) return null;

  const resolvedVariant = variant ?? iconVariants[name] ?? defaultIconVariant;

  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden leading-none",
        className
      )}
      style={{ width: size, height: size }}
    >
      <Cmp
        size={size}
        variant={resolvedVariant}
        color="currentColor"
        className="!block h-full w-full max-h-full max-w-full leading-none"
        aria-hidden
      />
    </span>
  );
}
