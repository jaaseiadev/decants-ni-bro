'use client';

import { useState, useEffect } from 'react';
import MonthSelector from '@/components/admin/MonthSelector';
import { MetricCard } from '@/components/admin/MetricCard';
import SalesChart from '@/components/admin/SalesChart';
import ExpenseAccordion from '@/components/admin/ExpenseAccordion';

export default function StatsAdminPage() {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // initialize selected month to current month
    const currentDate = new Date();
    const monthString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    setSelectedMonth(monthString);
  }, []);

  useEffect(() => {
    if (!selectedMonth) return;

    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/stats?month=${selectedMonth}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedMonth]);

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-ds-border">
        <div>
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-ds-black mb-2">
            Statistics
          </h1>
          <p className="text-ds-taupe uppercase tracking-widest text-xs font-medium">
            Analytics & Performance
          </p>
        </div>
      </div>

      <div>
        <MonthSelector selectedMonth={selectedMonth} onSelect={setSelectedMonth} />
      </div>

      {loading && !data ? (
        <div className="py-20 text-center text-ds-taupe uppercase tracking-widest text-sm">
          Loading metrics...
        </div>
      ) : data ? (
        <>
          {/* Summary Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard 
              label="Total Revenue" 
              value={`₱${data.totalRevenue.toLocaleString()}`} 
              className="bg-transparent border border-ds-black text-ds-black"
            />
            <MetricCard 
              label="Total ml Sold" 
              value={data.totalMlSold.toLocaleString()} 
              className="bg-transparent border border-ds-black text-ds-black"
            />
            <MetricCard 
              label="Net Profit" 
              value={`₱${data.netProfit.toLocaleString()}`} 
              className="bg-transparent border border-ds-black text-ds-black"
            />
          </div>

          {/* Bar Chart */}
          <div className="pt-8">
            <h2 className="font-serif text-2xl mb-6">Units Sold by Perfume</h2>
            {data.chartData && data.chartData.length > 0 ? (
              <SalesChart data={data.chartData} />
            ) : (
              <div className="py-10 text-center text-ds-taupe text-sm border border-dashed border-ds-border">
                No sales data for this month.
              </div>
            )}
          </div>

          {/* Breakdown Table */}
          <div className="pt-8 overflow-x-auto">
            <h2 className="font-serif text-2xl mb-6">Detailed Breakdown</h2>
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-ds-black/20 text-ds-taupe uppercase tracking-widest text-xs">
                  <th className="font-normal py-3 px-2">Perfume</th>
                  <th className="font-normal py-3 px-2 text-right">Total ml</th>
                  <th className="font-normal py-3 px-2 text-right">5ml Units</th>
                  <th className="font-normal py-3 px-2 text-right">10ml Units</th>
                  <th className="font-normal py-3 px-2 text-right">5ml Rev</th>
                  <th className="font-normal py-3 px-2 text-right">10ml Rev</th>
                  <th className="font-normal py-3 px-2 text-right">Total Rev</th>
                </tr>
              </thead>
              <tbody>
                {data.chartData && data.chartData.length > 0 ? (
                  data.chartData.map((row: any) => (
                    <tr key={row.name} className="border-b border-ds-border/50 hover:bg-ds-surface/50">
                      <td className="py-3 px-2 font-medium">{row.name}</td>
                      <td className="py-3 px-2 text-right">{row.ml}ml</td>
                      <td className="py-3 px-2 text-right">{row.units5ml}</td>
                      <td className="py-3 px-2 text-right">{row.units10ml}</td>
                      <td className="py-3 px-2 text-right font-mono">₱{row.rev5ml.toLocaleString()}</td>
                      <td className="py-3 px-2 text-right font-mono">₱{row.rev10ml.toLocaleString()}</td>
                      <td className="py-3 px-2 text-right font-mono font-medium">₱{row.totalRev.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-ds-taupe">
                      No breakdown data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Expenses */}
          <ExpenseAccordion expenses={data.expenses || []} />
        </>
      ) : null}
    </div>
  );
}
