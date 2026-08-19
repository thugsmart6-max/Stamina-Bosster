"use client";

import { motion, useReducedMotion } from "framer-motion";

function strokeColor(score: number): string {
  if (score <= 4) return "#F59E0B";
  if (score <= 7) return "#6366F1";
  return "#22C55E";
}

export function ReadinessRing({
  score,
  bandLabel,
}: {
  score: number;
  bandLabel?: string;
}) {
  const reduceMotion = useReducedMotion();
  const pct = Math.min(100, Math.max(0, (score / 10) * 100));
  const r = 52;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  const stroke = strokeColor(score);

  return (
    <div className="relative inline-flex h-32 w-32 flex-col items-center justify-center">
      <div className="relative inline-flex h-32 w-32 items-center justify-center">
        <svg className="-rotate-90" width="128" height="128" aria-hidden>
          <circle
            cx="64"
            cy="64"
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="10"
          />
          <motion.circle
            cx="64"
            cy="64"
            r={r}
            fill="none"
            stroke={stroke}
            strokeWidth="10"
            strokeDasharray={c}
            strokeLinecap="round"
            initial={
              reduceMotion ? { strokeDashoffset: offset } : { strokeDashoffset: c }
            }
            animate={{ strokeDashoffset: offset }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 1.1, ease: [0.22, 1, 0.36, 1] }
            }
          />
        </svg>
        <div className="absolute text-center">
          <span className="display-heading text-3xl text-foreground">{score}</span>
          <span className="block text-[10px] font-bold uppercase tracking-widest text-muted">
            / 10
          </span>
        </div>
      </div>
      {bandLabel ? (
        <p className="mt-1 max-w-[10rem] text-center text-[10px] font-semibold uppercase leading-tight tracking-wide text-muted">
          {bandLabel}
        </p>
      ) : null}
    </div>
  );
}
