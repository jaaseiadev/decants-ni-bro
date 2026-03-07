"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface ChartData {
  name: string;
  revenue: number;
}

interface RevenueChartProps {
  data: ChartData[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  if (!data || data.length === 0) {
    return <div className="text-ds-taupe text-sm p-4 text-center">No chart data.</div>;
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} accessibilityLayer={false}>
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "var(--ds-taupe)", fontSize: 12, className: "font-sans uppercase tracking-widest" }}
            dy={10}
          />
          <YAxis 
            hide 
          />
          <Tooltip 
            cursor={{ fill: "transparent" }}
            contentStyle={{ 
              backgroundColor: "var(--ds-black)", 
              border: "none", 
              color: "var(--ds-ivory)",
              borderRadius: "0px",
              fontFamily: "var(--font-sans)",
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.1em"
            }}
            itemStyle={{ color: "var(--ds-ivory)" }}
          />
          <Bar 
            dataKey="revenue" 
            fill="var(--ds-charcoal)" 
            radius={[2, 2, 0, 0]}
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
