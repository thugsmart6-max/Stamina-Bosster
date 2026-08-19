import { cn } from "@/lib/utils";

export function Marquee({
  children,
  className,
  reverse,
}: {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
}) {
  return (
    <div className={cn("overflow-hidden whitespace-nowrap", className)}>
      <div
        className={cn(
          "inline-flex gap-8",
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        )}
      >
        <div className="inline-flex shrink-0 gap-8">{children}</div>
        <div className="inline-flex shrink-0 gap-8" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}

export function MarqueeText({
  text,
  className,
  reverse,
}: {
  text: string;
  className?: string;
  reverse?: boolean;
}) {
  const items = Array.from({ length: 12 }, (_, i) => (
    <span
      key={i}
      className={cn(
        "text-4xl font-black uppercase tracking-tight md:text-6xl",
        className
      )}
    >
      {text}
    </span>
  ));

  return <Marquee reverse={reverse}>{items}</Marquee>;
}
