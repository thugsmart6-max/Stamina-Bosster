"use client";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function BrandWordmark({
  href = "/",
  className,
  onClick,
}: {
  href?: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      data-wordmark="true"
      className={cn("leading-none text-inherit no-underline", className)}
    >
      <span className="display-heading block text-[0.7rem] tracking-[0.28em] md:text-xs">
        STAMINA
      </span>
      <span className="display-heading mt-0.5 flex items-center gap-1.5 text-sm md:text-base">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
        BOOSTER
      </span>
    </Link>
  );
}
