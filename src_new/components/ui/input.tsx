import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full rounded-xl border border-white/15 bg-black px-4 py-2.5 text-white placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";
