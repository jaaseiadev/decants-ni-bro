import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ds-black disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-ds-black text-ds-ivory hover:bg-ds-charcoal": variant === "primary",
            "bg-ds-nude text-ds-black hover:bg-ds-greige": variant === "secondary",
            "border border-ds-black bg-transparent hover:bg-ds-black hover:text-ds-ivory": variant === "ghost",
            "h-12 px-8 py-3": size === "default",
            "h-9 px-4 py-2 text-xs": size === "sm",
            "h-14 px-10 py-4 text-base": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
