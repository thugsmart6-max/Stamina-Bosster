"use client";

import { AppIcon } from "@/components/app-icon";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function FaqAccordion({
  items,
}: {
  items: { q: string; a: string }[];
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div
          key={item.q}
          className="rounded-2xl border border-white/10 bg-surface-elevated overflow-hidden"
        >
          <button
            type="button"
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            <span className="flex items-center gap-3 font-bold text-white">
              <AppIcon
                name="check"
                size={20}
                className={cn(
                  "text-primary transition-transform",
                  open === i && "rotate-0",
                  open !== i && "opacity-50"
                )}
              />
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
            <p className="border-t border-white/10 px-5 pb-4 pt-2 pl-12 text-sm leading-relaxed text-muted">
              {item.a}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
