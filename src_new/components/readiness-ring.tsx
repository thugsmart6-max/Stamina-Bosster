"use client";

export function ReadinessRing({ score }: { score: number }) {
  const pct = (score / 10) * 100;
  const r = 52;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;

  return (
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
        <circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke="var(--illustration-highlight)"
          strokeWidth="10"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute text-center">
        <span className="display-heading text-3xl text-white">{score}</span>
        <span className="block text-[10px] font-bold uppercase tracking-widest text-muted">
          / 10
        </span>
      </div>
    </div>
  );
}
