import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full rounded-xl border border-foreground/12 bg-white px-4 py-2.5 text-foreground placeholder:text-muted",
      "vp-focus-ring focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";
