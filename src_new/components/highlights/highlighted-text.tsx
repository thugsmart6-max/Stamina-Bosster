"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { MARKER_AMBER, MARKER_TEAL, UNDERLINE_TEAL } from "./paths";

/** @deprecated use marker-primary */
type HighlightVariant =
  | "marker-primary"
  | "marker-cyan"
  | "marker-teal"
  | "marker-amber"
  | "underline";

const variants: Record<
  HighlightVariant,
  { type: "fill" | "stroke"; d: string; viewBox: string; height: string }
> = {
  "marker-primary": {
    type: "fill",
    d: MARKER_TEAL,
    viewBox: "0 0 200 24",
    height: "0.42em",
  },
  "marker-teal": {
    type: "fill",
    d: MARKER_TEAL,
    viewBox: "0 0 200 24",
    height: "0.42em",
  },
  "marker-cyan": {
    type: "fill",
    d: MARKER_AMBER,
    viewBox: "0 0 200 24",
    height: "0.42em",
  },
  "marker-amber": {
    type: "fill",
    d: MARKER_AMBER,
    viewBox: "0 0 200 24",
    height: "0.42em",
  },
  underline: {
    type: "stroke",
    d: UNDERLINE_TEAL,
    viewBox: "0 0 180 12",
    height: "0.2em",
  },
};

export function HighlightedText({
  children,
  variant = "marker-primary",
  className,
  animate = true,
}: {
  children: React.ReactNode;
  variant?: HighlightVariant;
  className?: string;
  animate?: boolean;
}) {
  const cfg = variants[variant];
  const colorClass =
    variant === "marker-cyan" || variant === "marker-amber"
      ? "text-accent"
      : variant === "underline"
        ? "text-accent"
        : "text-primary";

  return (
    <span className={cn("relative inline-block pb-1", className)}>
      <span className="relative z-10">{children}</span>
      <svg
        className={cn(
          "pointer-events-none absolute -bottom-0.5 left-[-4%] z-0 w-[108%]",
          colorClass
        )}
        style={{ height: cfg.height }}
        viewBox={cfg.viewBox}
        preserveAspectRatio="none"
        aria-hidden
      >
        {cfg.type === "fill" ? (
          <motion.g
            initial={animate ? { scaleX: 0 } : false}
            animate={animate ? { scaleX: 1 } : false}
            transition={{ duration: 0.55, delay: 0.2, ease: "easeOut" }}
            style={{ transformOrigin: "left center", transformBox: "fill-box" }}
          >
            <path d={cfg.d} fill="currentColor" fillOpacity={0.4} />
          </motion.g>
        ) : (
          <motion.path
            d={cfg.d}
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            initial={animate ? { pathLength: 0 } : false}
            animate={animate ? { pathLength: 1 } : false}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          />
        )}
      </svg>
    </span>
  );
}
