import { cn } from "@/lib/utils";

export function PageShell({
  children,
  className,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-3xl px-4 py-12 md:py-16", className)}>
      {title && (
        <h1 className="display-heading mb-2 text-3xl text-white md:text-4xl">
          {title}
        </h1>
      )}
      {subtitle && (
        <p className="mb-8 max-w-xl text-muted">{subtitle}</p>
      )}
      {children}
    </div>
  );
}
