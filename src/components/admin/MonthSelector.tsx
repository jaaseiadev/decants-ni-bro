'use client';

import { Button } from '@/components/ui/button';

interface MonthSelectorProps {
  selectedMonth: string;
  onSelect: (month: string) => void;
}

export default function MonthSelector({ selectedMonth, onSelect }: MonthSelectorProps) {
  // Generate last 12 months
  const months = [];
  const currentDate = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('default', { month: 'short', year: 'numeric' });
    months.push({ value: monthString, label });
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
      {months.map((m) => (
        <Button
          key={m.value}
          variant={selectedMonth === m.value ? 'primary' : 'ghost'}
          className={selectedMonth === m.value ? 'rounded-full' : 'rounded-full bg-white'}
          onClick={() => onSelect(m.value)}
        >
          {m.label}
        </Button>
      ))}
    </div>
  );
}
