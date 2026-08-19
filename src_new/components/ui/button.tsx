import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "pill" | "success";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary:
    "bg-accent text-accent-foreground hover:bg-accent-hover focus-visible:ring-accent rounded-lg font-bold",
  pill:
    "bg-accent text-accent-foreground hover:bg-accent-hover focus-visible:ring-accent rounded-lg font-bold",
  secondary:
    "bg-secondary text-white hover:bg-secondary-dark focus-visible:ring-secondary rounded-lg font-bold",
  success:
    "bg-success text-white hover:bg-success-dark focus-visible:ring-success rounded-lg font-bold",
  outline:
    "border-2 border-primary text-primary bg-background hover:bg-primary/5 rounded-lg font-bold",
  ghost: "text-muted hover:text-foreground hover:bg-surface-elevated rounded-lg",
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
        "inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
