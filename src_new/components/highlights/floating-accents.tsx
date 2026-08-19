"use client";

import { cn } from "@/lib/utils";

/** Subtle corner accents between sections (wellness-themed, not cluttered). */
export function FloatingAccents({
  position = "top-right",
  className,
}: {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}) {
  const pos = {
    "top-left": "left-4 top-0 -translate-y-1/2",
    "top-right": "right-4 top-0 -translate-y-1/2",
    "bottom-left": "left-8 bottom-0 translate-y-1/2",
    "bottom-right": "right-8 bottom-0 translate-y-1/2",
  }[position];

  return (
    <div
      className={cn(
        "pointer-events-none absolute z-0 hidden opacity-40 lg:block",
        pos,
        className
      )}
      aria-hidden
    >
      <svg width={64} height={64} viewBox="0 0 64 64" className="text-primary">
        <circle cx="32" cy="32" r="28" fill="currentColor" fillOpacity={0.08} />
        <path
          d="M20 32 L44 32 M32 20 L32 44"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={0.35}
        />
      </svg>
    </div>
  );
}
