import * as React from "react";
import { cn } from "@/lib/utils";

type StatusType = "AVAILABLE" | "IN_TRANSIT" | "OUT_OF_STOCK";

export interface StatusPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: StatusType;
}

const statusConfig: Record<StatusType, string> = {
  AVAILABLE: "bg-ds-black text-ds-ivory",
  IN_TRANSIT: "border border-ds-nude text-ds-black bg-transparent",
  OUT_OF_STOCK: "bg-ds-greige text-ds-ivory line-through opacity-70",
};

export function StatusPill({ status, className, ...props }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center px-3 py-1 text-[10px] font-medium uppercase tracking-widest leading-none",
        statusConfig[status],
        className
      )}
      {...props}
    >
      {status.replace("_", " ")}
    </span>
  );
}
