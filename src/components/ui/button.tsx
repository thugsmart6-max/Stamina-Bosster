import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "pill";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary:
    "bg-accent text-accent-foreground hover:bg-accent-hover focus-visible:ring-accent rounded-full font-bold uppercase tracking-wide shadow-[0_10px_28px_-10px_rgba(14,143,156,0.55)] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-8px_rgba(14,143,156,0.7)] active:translate-y-0",
  pill:
    "bg-accent text-accent-foreground hover:bg-accent-hover focus-visible:ring-accent rounded-full font-bold uppercase tracking-wide shadow-[0_10px_28px_-10px_rgba(14,143,156,0.55)] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-8px_rgba(14,143,156,0.7)] active:translate-y-0",
  secondary:
    "bg-primary text-white hover:bg-primary-light focus-visible:ring-primary rounded-full font-bold uppercase tracking-wide shadow-[0_10px_28px_-12px_rgba(212,43,43,0.55)] hover:-translate-y-0.5",
  outline:
    "border-2 border-foreground/20 text-foreground hover:border-foreground/40 hover:bg-foreground/5 rounded-full font-bold uppercase tracking-wide backdrop-blur-sm",
  ghost: "text-muted hover:text-foreground hover:bg-foreground/5 rounded-lg",
};

const sizes = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center transition-[color,background-color,transform,box-shadow,border-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
