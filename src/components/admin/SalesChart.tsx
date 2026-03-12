'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  units5ml: number;
  units10ml: number;
}

interface SalesChartProps {
  data: ChartData[];
}

export default function SalesChart({ data }: SalesChartProps) {
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          accessibilityLayer={false}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#1f1f1f' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#1f1f1f' }}
          />
          <Tooltip 
            cursor={{ fill: '#f6f6eb' }}
            contentStyle={{ borderRadius: '0', border: '1px solid #1f1f1f', backgroundColor: '#fff', fontSize: '14px' }}
          />
          <Legend wrapperStyle={{ fontSize: '14px' }} iconType="square" />
          <Bar dataKey="units5ml" name="5ml Units" fill="#999182" radius={[2, 2, 0, 0]} />
          <Bar dataKey="units10ml" name="10ml Units" fill="#1f1f1f" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
