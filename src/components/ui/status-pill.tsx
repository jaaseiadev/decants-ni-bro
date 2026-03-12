import * as React from "react";
import { cn } from "@/lib/utils";

type StatusType = "in stock" | "out of stock" | "new" | "in transit";

export interface StatusPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: StatusType;
}

const statusConfig: Record<StatusType, string> = {
  "in stock": "bg-ds-black text-ds-ivory",
  "new": "bg-[#E5D5C5] text-ds-black font-bold",
  "in transit": "border border-ds-nude text-ds-black bg-transparent",
  "out of stock": "bg-ds-greige text-ds-ivory line-through opacity-70",
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
