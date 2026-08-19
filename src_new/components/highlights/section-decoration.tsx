"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ARROW_CURVED,
  BLOB_SOFT,
  LOOP_SPARK,
  SCRIBBLE_STAR,
  SPRINKLE_DOTS,
  WHIRL,
} from "./paths";

export type DecorationType =
  | "arrow"
  | "blob"
  | "loop"
  | "star"
  | "sprinkles"
  | "whirl"
  | "dots-row";

type Props = {
  type: DecorationType;
  className?: string;
  color?: "primary" | "accent" | "muted";
  size?: "sm" | "md" | "lg";
};

const sizeMap = { sm: 48, md: 80, lg: 120 };

export function SectionDecoration({
  type,
  className,
  color = "primary",
  size = "md",
}: Props) {
  const dim = sizeMap[size];
  const colorClass =
    color === "accent"
      ? "text-accent"
      : color === "muted"
        ? "text-muted/40"
        : "text-primary";

  const motionProps = {
    initial: { opacity: 0, scale: 0.9 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, margin: "-40px" },
    transition: { duration: 0.5 },
  };

  if (type === "sprinkles" || type === "dots-row") {
    return (
      <motion.div
        {...motionProps}
        className={cn("flex items-center justify-center gap-6 py-8", className)}
        aria-hidden
      >
        <svg
          width={200}
          height={24}
          viewBox="0 0 170 24"
          className={colorClass}
        >
          {SPRINKLE_DOTS.map((d, i) => (
            <circle
              key={i}
              cx={d.cx}
              cy={d.cy}
              r={d.r}
              fill="currentColor"
              opacity={0.5 + (i % 3) * 0.15}
            />
          ))}
        </svg>
      </motion.div>
    );
  }

  return (
    <motion.div
      {...motionProps}
      className={cn("pointer-events-none flex justify-center py-6", className)}
      aria-hidden
    >
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 200 200"
        className={cn(colorClass, "opacity-70")}
      >
        {type === "arrow" && (
          <path
            d={ARROW_CURVED}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {type === "blob" && (
          <path d={BLOB_SOFT} fill="currentColor" fillOpacity={0.15} />
        )}
        {type === "loop" && (
          <path
            d={LOOP_SPARK}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            opacity={0.6}
          />
        )}
        {type === "star" && (
          <path
            d={SCRIBBLE_STAR}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinejoin="round"
            opacity={0.5}
          />
        )}
        {type === "whirl" && (
          <path
            d={WHIRL}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            opacity={0.45}
          />
        )}
      </svg>
    </motion.div>
  );
}

/** Full-width divider with optional left/right flanking decorations */
export function SectionDivider({
  left = "sprinkles",
  right,
  center,
}: {
  left?: DecorationType | null;
  right?: DecorationType | null;
  center?: DecorationType | null;
}) {
  return (
    <div className="relative mx-auto flex max-w-6xl items-center justify-between px-4 md:px-8">
      {left && (
        <SectionDecoration
          type={left}
          size="sm"
          className="hidden py-4 md:flex md:opacity-60"
          color="muted"
        />
      )}
      {center && (
        <SectionDecoration type={center} size="md" className="flex-1 py-2" />
      )}
      {!center && left && (
        <div className="hidden h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent md:block" />
      )}
      {right && (
        <SectionDecoration
          type={right}
          size="sm"
          className="hidden py-4 md:flex md:opacity-60"
          color="primary"
        />
      )}
    </div>
  );
}
