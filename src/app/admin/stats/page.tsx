'use client';

import { useEffect, useMemo, useState } from 'react';
import { BarChart3, RefreshCw, Trophy } from 'lucide-react';
import AllTimePerfumeRanking, {
  type RankedPerfume,
} from '@/components/admin/AllTimePerfumeRanking';
import ExpenseAccordion from '@/components/admin/ExpenseAccordion';
import { MetricCard } from '@/components/admin/MetricCard';
import SalesChart from '@/components/admin/SalesChart';
import StatsPeriodControls, { type StatsFilters } from '@/components/admin/StatsPeriodControls';

interface ChartRow {
  id: string | null;
  name: string;
  ml: number;
  units5ml: number;
  units10ml: number;
  rev5ml: number;
  rev10ml: number;
  totalRev: number;
}

interface StatsData {
  periodLabel: string;
  totalRevenue: number;
  totalMlSold: number;
  totalProfit: number;
  totalExpenses: number;
  netProfit: number;
  chartData: ChartRow[];
  expenses: Array<{
    id: string;
    category: string;
    description: string | null;
    amount: number | string;
  }>;
  expenseCoverage: 'exact' | 'selected-months';
  allTime: {
    totalRevenue: number;
    totalMlSold: number;
    perfumes: RankedPerfume[];
  };
}

type StatsSection = 'performance' | 'ranking';

const currency = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  maximumFractionDigits: 0,
});

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function createInitialFilters(): StatsFilters {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 29);

  return {
    period: 'month',
    month: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`,
    year: String(today.getFullYear()),
    start: toDateInputValue(thirtyDaysAgo),
    end: toDateInputValue(today),
  };
}

function buildStatsQuery(filters: StatsFilters) {
  const params = new URLSearchParams({ period: filters.period });
  if (filters.period === 'month') params.set('month', filters.month);
  if (filters.period === 'year') params.set('year', filters.year);
  if (filters.period === 'custom') {
    params.set('start', filters.start);
    params.set('end', filters.end);
  }
  return params.toString();
}

export default function StatsAdminPage() {
  const [activeSection, setActiveSection] = useState<StatsSection>('performance');
  const [filters, setFilters] = useState<StatsFilters>(createInitialFilters);
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const query = useMemo(() => buildStatsQuery(filters), [filters]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`/api/stats?${query}`, { signal: controller.signal });
        if (!response.ok) {
          const body = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(body?.error || 'Unable to load statistics.');
        }
        setData((await response.json()) as StatsData);
      } catch (fetchError) {
        if (fetchError instanceof DOMException && fetchError.name === 'AbortError') return;
        setError(fetchError instanceof Error ? fetchError.message : 'Unable to load statistics.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchData();
    return () => controller.abort();
  }, [query, refreshKey]);

  return (
    <div className="space-y-8 pb-16">
      <header className="border-ds-greige flex flex-col gap-6 border-b pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-ds-taupe mb-3 text-[10px] font-bold tracking-[0.24em] uppercase">
            Analytics & performance
          </p>
          <h1 className="text-ds-black font-serif text-5xl leading-none tracking-tight md:text-7xl">
            Statistics
          </h1>
        </div>

        <nav className="border-ds-black flex border bg-white p-1" aria-label="Statistics sections">
          <button
            type="button"
            onClick={() => setActiveSection('performance')}
            className={`flex items-center gap-2 px-4 py-3 text-[10px] font-bold tracking-[0.17em] uppercase transition-colors sm:px-5 ${
              activeSection === 'performance' ? 'bg-ds-black text-white' : 'text-ds-taupe'
            }`}
          >
            <BarChart3 size={15} /> Performance
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('ranking')}
            className={`flex items-center gap-2 px-4 py-3 text-[10px] font-bold tracking-[0.17em] uppercase transition-colors sm:px-5 ${
              activeSection === 'ranking' ? 'bg-ds-black text-white' : 'text-ds-taupe'
            }`}
          >
            <Trophy size={15} /> All-time ranking
          </button>
        </nav>
      </header>

      {error && (
        <div className="flex flex-col gap-4 border border-red-300 bg-red-50 p-5 text-sm text-red-800 sm:flex-row sm:items-center sm:justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setRefreshKey((current) => current + 1)}
            className="flex items-center gap-2 self-start border border-red-800 px-3 py-2 text-[10px] font-bold tracking-widest uppercase sm:self-auto"
          >
            <RefreshCw size={13} /> Try again
          </button>
        </div>
      )}

      {activeSection === 'performance' && (
        <div className="space-y-10">
          <StatsPeriodControls filters={filters} onChange={setFilters} />

          {loading && !data ? (
            <div className="border-ds-greige flex min-h-80 items-center justify-center border border-dashed">
              <div className="text-center">
                <RefreshCw className="text-ds-taupe mx-auto mb-3 animate-spin" size={22} />
                <p className="text-ds-taupe text-xs font-bold tracking-[0.2em] uppercase">
                  Loading metrics
                </p>
              </div>
            </div>
          ) : data ? (
            <div
              className={`space-y-12 transition-opacity ${loading ? 'opacity-55' : 'opacity-100'}`}
            >
              <section>
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-ds-taupe text-[10px] font-bold tracking-[0.22em] uppercase">
                      Selected period
                    </p>
                    <h2 className="mt-2 font-serif text-3xl">{data.periodLabel}</h2>
                  </div>
                  {loading && <span className="text-ds-taupe text-xs">Updating…</span>}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <MetricCard
                    label="Revenue"
                    value={currency.format(data.totalRevenue)}
                    className="border-ds-black text-ds-black border bg-transparent"
                  />
                  <MetricCard
                    label="ML Sold"
                    value={`${data.totalMlSold.toLocaleString()} ml`}
                    className="border-ds-black text-ds-black border bg-transparent"
                  />
                  <MetricCard
                    label="Expenses"
                    value={currency.format(data.totalExpenses)}
                    className="border-ds-black text-ds-black border bg-transparent"
                  />
                  <MetricCard
                    label="Net Profit"
                    value={currency.format(data.netProfit)}
                    className="border-ds-black bg-ds-black border text-white"
                  />
                </div>
                {data.expenseCoverage === 'selected-months' && (
                  <p className="text-ds-taupe mt-3 text-xs leading-relaxed">
                    Expenses are recorded by month, so this range includes the complete expenses for
                    every month it touches.
                  </p>
                )}
              </section>

              <section>
                <div className="mb-6">
                  <p className="text-ds-taupe text-[10px] font-bold tracking-[0.22em] uppercase">
                    Sales mix
                  </p>
                  <h2 className="mt-2 font-serif text-3xl">Units sold by perfume</h2>
                </div>
                {data.chartData.length > 0 ? (
                  <div className="border-ds-greige border bg-white p-3 md:p-6">
                    <SalesChart data={data.chartData} />
                  </div>
                ) : (
                  <div className="border-ds-greige text-ds-taupe border border-dashed py-14 text-center text-sm">
                    No sales were recorded in this period.
                  </div>
                )}
              </section>

              <section className="border-ds-greige overflow-hidden border bg-white">
                <div className="border-ds-greige border-b p-5 md:p-6">
                  <p className="text-ds-taupe text-[10px] font-bold tracking-[0.22em] uppercase">
                    Detailed breakdown
                  </p>
                  <h2 className="mt-2 font-serif text-3xl">Perfume performance</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead>
                      <tr className="border-ds-greige bg-ds-ivory text-ds-taupe border-b text-[10px] tracking-[0.16em] uppercase">
                        <th className="px-5 py-4 font-bold">Rank / Perfume</th>
                        <th className="px-4 py-4 text-right font-bold">Total ml</th>
                        <th className="px-4 py-4 text-right font-bold">5ml units</th>
                        <th className="px-4 py-4 text-right font-bold">10ml units</th>
                        <th className="px-4 py-4 text-right font-bold">5ml revenue</th>
                        <th className="px-4 py-4 text-right font-bold">10ml revenue</th>
                        <th className="px-5 py-4 text-right font-bold">Total revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.chartData.length > 0 ? (
                        data.chartData.map((row, index) => (
                          <tr
                            key={row.id || row.name}
                            className="border-ds-nude hover:bg-ds-ivory border-b last:border-0"
                          >
                            <td className="px-5 py-4 font-medium">
                              <span className="text-ds-taupe mr-3 font-serif text-lg">
                                {String(index + 1).padStart(2, '0')}
                              </span>
                              {row.name}
                            </td>
                            <td className="px-4 py-4 text-right">{row.ml.toLocaleString()} ml</td>
                            <td className="px-4 py-4 text-right">
                              {row.units5ml.toLocaleString()}
                            </td>
                            <td className="px-4 py-4 text-right">
                              {row.units10ml.toLocaleString()}
                            </td>
                            <td className="px-4 py-4 text-right">{currency.format(row.rev5ml)}</td>
                            <td className="px-4 py-4 text-right">{currency.format(row.rev10ml)}</td>
                            <td className="px-5 py-4 text-right font-semibold">
                              {currency.format(row.totalRev)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="text-ds-taupe px-5 py-10 text-center">
                            No breakdown data is available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              <ExpenseAccordion expenses={data.expenses} />
            </div>
          ) : null}
        </div>
      )}

      {activeSection === 'ranking' &&
        (loading && !data ? (
          <div className="border-ds-greige flex min-h-80 items-center justify-center border border-dashed">
            <RefreshCw className="text-ds-taupe animate-spin" size={22} />
          </div>
        ) : data ? (
          <AllTimePerfumeRanking
            perfumes={data.allTime.perfumes}
            totalRevenue={data.allTime.totalRevenue}
            totalMlSold={data.allTime.totalMlSold}
          />
        ) : null)}
    </div>
  );
}
