"use client";

import { AppIcon } from "@/components/app-icon";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function FaqAccordion({
  items,
  variant = "cards",
}: {
  items: { q: string; a: string }[];
  variant?: "cards" | "grid";
}) {
  const [open, setOpen] = useState<number | null>(0);

  if (variant === "grid") {
    return (
      <div className="divide-y divide-foreground/10 border-y border-foreground/10">
        {items.map((item, i) => (
          <div key={item.q}>
            <button
              type="button"
              className="flex w-full items-start justify-between gap-3 py-4 text-left sm:gap-6 sm:py-5"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
            >
              <span className="flex min-w-0 gap-3 sm:gap-4">
                <span className="shrink-0 text-xs font-bold tracking-[0.2em] text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-pretty font-semibold text-foreground">{item.q}</span>
              </span>
              <AppIcon
                name="chevronDown"
                size={20}
                className={cn(
                  "mt-0.5 shrink-0 text-muted transition-transform",
                  open === i && "rotate-180"
                )}
              />
            </button>
            {open === i ? (
              <p className="pb-5 pl-8 text-sm leading-relaxed text-muted sm:pl-12">{item.a}</p>
            ) : null}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div
          key={item.q}
          className="overflow-hidden rounded-2xl border border-foreground/10 bg-surface-elevated/90 shadow-[0_16px_40px_-28px_rgba(0,0,0,0.9)]"
        >
          <button
            type="button"
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            <span className="flex items-center gap-3 font-bold text-foreground">
              <AppIcon name="check" size={20} className="text-primary" />
              {item.q}
            </span>
            <AppIcon
              name="chevronDown"
              size={22}
              className={cn(
                "shrink-0 text-primary transition-transform",
                open === i && "rotate-180"
              )}
            />
          </button>
          {open === i && (
            <p className="border-t border-border px-5 pb-4 pl-12 pt-2 text-sm leading-relaxed text-muted">
              {item.a}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
