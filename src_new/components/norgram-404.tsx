"use client";

import { Link } from "@/i18n/navigation";
import { useEffect, useState } from "react";

type Norgram404Props = {
  title: string;
  body: string;
  home: string;
  start: string;
};

export function Norgram404({ title, body, home, start }: Norgram404Props) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 120);
    return () => clearInterval(id);
  }, []);

  const glitchActive = tick % 9 < 2;

  return (
    <div
      className="norgram-404 fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-background px-6"
      role="alert"
      aria-live="polite"
    >
      <div className="norgram-404__noise pointer-events-none" aria-hidden />
      <div className="norgram-404__scanlines pointer-events-none" aria-hidden />
      <div className="norgram-404__grid pointer-events-none" aria-hidden />

      <div
        className={`norgram-404__stage relative inline-block select-none ${glitchActive ? "norgram-404__stage--glitch" : ""}`}
      >
        <span className="norgram-404__layer norgram-404__layer--red" aria-hidden>
          404
        </span>
        <span className="norgram-404__layer norgram-404__layer--cyan" aria-hidden>
          404
        </span>
        <h1 className="norgram-404__code display-heading relative z-[2]">404</h1>
      </div>

      <p className="norgram-404__label mt-8 text-xs font-bold uppercase tracking-[0.35em] text-muted">
        {title}
      </p>
      <p className="mt-4 max-w-md text-center text-sm leading-relaxed text-soft-bright/80">
        {body}
      </p>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
        <Link href="/" className="btn-pill">
          {home}
        </Link>
        <Link
          href="/signup"
          className="rounded-full border border-soft/25 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          {start}
        </Link>
      </div>

      <p className="norgram-404__cursor mt-16 font-mono text-[10px] uppercase tracking-widest text-muted/60">
        _
      </p>
    </div>
  );
}
