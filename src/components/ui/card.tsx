import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "charcoal";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-none shadow-sm",
          {
            "bg-ds-ivory outline outline-1 outline-ds-greige": variant === "default",
            "bg-ds-charcoal text-ds-ivory": variant === "charcoal",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export { Card };
