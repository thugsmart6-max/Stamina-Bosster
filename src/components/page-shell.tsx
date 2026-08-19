import { cn } from "@/lib/utils";

export function PageShell({
  children,
  className,
  title,
  subtitle,
  wide,
  report,
}: {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  subtitle?: string;
  /** Wider content column (dashboards, split checkout). */
  wide?: boolean;
  /** Full report / success preview (wide tables). */
  report?: boolean;
}) {
  return (
    <div
      className={cn(
        "mx-auto px-4 py-10 md:px-6 md:py-14",
        report ? "max-w-6xl" : wide ? "max-w-5xl" : "max-w-3xl",
        className
      )}
    >
      {(title || subtitle) && (
        <header className="mb-10 space-y-3">
          {title ? (
            <h1 className="display-heading text-balance text-[clamp(1.75rem,4vw,2.75rem)] text-foreground">
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <p className="max-w-2xl text-sm leading-relaxed text-muted md:text-base">
              {subtitle}
            </p>
          ) : null}
        </header>
      )}
      {children}
    </div>
  );
}
