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

export function AppIcon({ name, className, size = 20, variant }: AppIconProps) {
  if (!name) return null;
  const Cmp = iconRegistry[name];
  if (!Cmp) return null;

  const resolvedVariant = variant ?? iconVariants[name] ?? defaultIconVariant;

  return (
    <Cmp
      size={size}
      variant={resolvedVariant}
      color="currentColor"
      className={cn("shrink-0", className)}
      aria-hidden
    />
  );
}
