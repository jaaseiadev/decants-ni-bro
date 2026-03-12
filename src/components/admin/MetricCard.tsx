import React from "react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  className?: string;
}

export function MetricCard({ label, value, className }: MetricCardProps) {
  return (
    <div
      className={cn(
        "bg-ds-black text-ds-ivory p-6 md:p-8 flex flex-col justify-between min-h-[160px]",
        className
      )}
    >
      <dt className="text-xs tracking-widest uppercase text-ds-taupe font-sans min-h-[2rem]">
        {label}
      </dt>
      <dd className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight leading-none">
        {value}
      </dd>
    </div>
  );
}
