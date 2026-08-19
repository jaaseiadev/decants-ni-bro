'use client';

import type { Dispatch, SetStateAction } from 'react';

export type StatsPeriod = 'month' | 'year' | 'last30' | 'custom' | 'all';

export interface StatsFilters {
  period: StatsPeriod;
  month: string;
  year: string;
  start: string;
  end: string;
}

interface StatsPeriodControlsProps {
  filters: StatsFilters;
  onChange: Dispatch<SetStateAction<StatsFilters>>;
}

const periodOptions: Array<{ value: StatsPeriod; label: string }> = [
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
  { value: 'last30', label: 'Last 30 days' },
  { value: 'custom', label: 'Custom' },
  { value: 'all', label: 'All time' },
];

export default function StatsPeriodControls({ filters, onChange }: StatsPeriodControlsProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 8 }, (_, index) => String(currentYear - index));

  return (
    <div className="border-ds-greige border bg-white p-4 md:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-ds-taupe mb-3 text-[10px] font-bold tracking-[0.22em] uppercase">
            Reporting period
          </p>
          <div className="flex flex-wrap gap-2">
            {periodOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange((current) => ({ ...current, period: option.value }))}
                className={`border px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-colors ${
                  filters.period === option.value
                    ? 'border-ds-black bg-ds-black text-white'
                    : 'border-ds-greige text-ds-charcoal hover:border-ds-black bg-transparent'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          {filters.period === 'month' && (
            <label className="text-ds-taupe flex flex-col gap-2 text-[10px] font-bold tracking-[0.18em] uppercase">
              Select month
              <input
                type="month"
                value={filters.month}
                onChange={(event) =>
                  onChange((current) => ({ ...current, month: event.target.value }))
                }
                className="border-ds-greige bg-ds-ivory text-ds-black focus:border-ds-black min-h-10 border px-3 text-sm font-medium tracking-normal outline-none"
              />
            </label>
          )}

          {filters.period === 'year' && (
            <label className="text-ds-taupe flex flex-col gap-2 text-[10px] font-bold tracking-[0.18em] uppercase">
              Select year
              <select
                value={filters.year}
                onChange={(event) =>
                  onChange((current) => ({ ...current, year: event.target.value }))
                }
                className="border-ds-greige bg-ds-ivory text-ds-black focus:border-ds-black min-h-10 min-w-32 border px-3 text-sm font-medium tracking-normal outline-none"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>
          )}

          {filters.period === 'custom' && (
            <>
              <label className="text-ds-taupe flex flex-col gap-2 text-[10px] font-bold tracking-[0.18em] uppercase">
                From
                <input
                  type="date"
                  value={filters.start}
                  max={filters.end}
                  onChange={(event) =>
                    onChange((current) => ({ ...current, start: event.target.value }))
                  }
                  className="border-ds-greige bg-ds-ivory text-ds-black focus:border-ds-black min-h-10 border px-3 text-sm font-medium tracking-normal outline-none"
                />
              </label>
              <label className="text-ds-taupe flex flex-col gap-2 text-[10px] font-bold tracking-[0.18em] uppercase">
                To
                <input
                  type="date"
                  value={filters.end}
                  min={filters.start}
                  onChange={(event) =>
                    onChange((current) => ({ ...current, end: event.target.value }))
                  }
                  className="border-ds-greige bg-ds-ivory text-ds-black focus:border-ds-black min-h-10 border px-3 text-sm font-medium tracking-normal outline-none"
                />
              </label>
            </>
          )}

          {(filters.period === 'last30' || filters.period === 'all') && (
            <p className="text-ds-taupe max-w-xs text-xs leading-relaxed">
              {filters.period === 'last30'
                ? 'A rolling view ending today.'
                : 'Every recorded sale and expense.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
