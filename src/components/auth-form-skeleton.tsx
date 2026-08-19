"use client";

import { cn } from "@/lib/utils";

/** Placeholder for auth routes wrapped in Suspense (useSearchParams). */
export function AuthFormSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex w-full min-w-0 flex-col gap-4 animate-pulse", className)}
      aria-busy
      aria-label="Loading"
    >
      <div className="h-[52px] rounded-xl bg-white" />
      <div className="h-[52px] rounded-xl bg-white" />
      <div className="h-[52px] rounded-xl bg-white" />
      <div className="h-[52px] rounded-xl bg-white/[0.08]" />
    </div>
  );
}
