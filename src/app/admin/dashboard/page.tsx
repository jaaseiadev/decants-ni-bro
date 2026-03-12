"use client";

import { useEffect, useState } from "react";
import { MetricCard } from "@/components/admin/MetricCard";
import { RecentSalesTable } from "@/components/admin/RecentSalesTable";
import { RevenueChart } from "@/components/admin/RevenueChart";

interface DashboardData {
  metrics: {
    totalPerfumes: number;
    lowStockCount: number;
    monthlyRevenue: number;
    netProfit: number;
  };
  lowStockItems: Array<{
    id: string;
    name: string;
    status: string;
  }>;
  recentSales: Array<any>;
  chartData: Array<any>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/dashboard");
        if (!res.ok) throw new Error("Failed to load dashboard data");
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center min-h-[50vh]">
        <div className="w-12 h-12 border-2 border-ds-charcoal border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-sans text-xs tracking-widest uppercase text-ds-taupe">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <p className="text-red-500 font-sans">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-12 pb-12">
      {/* Header */}
      <div>
        <h1 className="display-subtitle text-ds-black">Dashboard</h1>
        <p className="body-text mt-2 text-ds-taupe">Overview of your perfume business metrics.</p>
      </div>

      {/* Low Stock Alert Strip */}
      {data.lowStockItems.length > 0 && (
        <div className="bg-orange-50 text-orange-900 border border-orange-200 p-4 flex items-center gap-4">
          <div className="font-sans text-xs font-bold uppercase tracking-widest shrink-0">
            Status Alerts
          </div>
          <div className="whitespace-nowrap overflow-x-auto flex space-x-3 pr-4 scrollbar-hide">
            {data.lowStockItems.map((item) => (
              <div 
                key={item.id} 
                className={`inline-flex items-center justify-center px-4 py-1.5 text-xs font-medium uppercase tracking-widest border bg-transparent rounded-full ${
                  item.status === 'out of stock' ? 'text-red-500 border-red-500' : 'text-orange-500 border-orange-500'
                }`}
              >
                {item.name} 
                <span className="opacity-80 ml-2">
                  ({item.status})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hero Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Perfumes" value={data.metrics.totalPerfumes} />
        <MetricCard label="Not In Stock" value={data.metrics.lowStockCount} />
        <MetricCard label="Monthly Revenue" value={`₱${data.metrics.monthlyRevenue.toLocaleString()}`} />
        <MetricCard label="Net Profit" value={`₱${data.metrics.netProfit.toLocaleString()}`} />
      </div>

      {/* Lower Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="font-serif text-2xl uppercase tracking-wider text-ds-black">
            Recent Sales
          </h2>
          <RecentSalesTable sales={data.recentSales} />
        </div>
        <div className="space-y-6">
          <h2 className="font-serif text-2xl uppercase tracking-wider text-ds-black">
            Revenue Last 7 Days
          </h2>
          <RevenueChart data={data.chartData} />
        </div>
      </div>
    </div>
  );
}
