import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // 1. Total Perfumes
    const { count: totalPerfumes, error: perfumesErr } = await supabase
      .from("perfumes")
      .select("*", { count: "exact", head: true });

    if (perfumesErr) throw perfumesErr;

    // 2. Low Stock Alerts & List
    const { data: lowStockItems, error: lowStockErr } = await supabase
      .from("perfumes")
      .select("id, name, stock_5ml, stock_10ml")
      .or("stock_5ml.lt.10,stock_10ml.lt.5");

    if (lowStockErr) throw lowStockErr;

    const lowStockCount = lowStockItems?.length || 0;

    // 3. Monthly Revenue & Net Profit, and Recent Sales
    // We get all sales for the current month for revenue/profit
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data: monthlySales, error: monthlySalesErr } = await supabase
      .from("sales")
      .select("revenue, profit, sale_date")
      .gte("sale_date", startOfMonth.toISOString());

    if (monthlySalesErr) throw monthlySalesErr;

    const monthlyRevenue = monthlySales?.reduce((sum, sale) => sum + Number(sale.revenue), 0) || 0;
    const netProfit = monthlySales?.reduce((sum, sale) => sum + Number(sale.profit), 0) || 0;

    // Last 5 Sales
    const { data: recentSales, error: recentSalesErr } = await supabase
      .from("sales")
      .select("id, perfume_name, size, qty, revenue, sale_date")
      .order("sale_date", { ascending: false })
      .limit(5);

    if (recentSalesErr) throw recentSalesErr;

    // 4. Chart Data (Last 7 days revenue)
    const chartData: { name: string; date: string; revenue: number }[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split("T")[0]; // YYYY-MM-DD
      chartData.push({
        name: d.toLocaleDateString("en-US", { weekday: "short" }),
        date: dateString,
        revenue: 0,
      });
    }

    const { data: weekSales, error: weekSalesErr } = await supabase
      .from("sales")
      .select("revenue, sale_date")
      .gte("sale_date", new Date(today.setDate(today.getDate() - 6)).toISOString());

    if (weekSalesErr) throw weekSalesErr;

    weekSales?.forEach((sale) => {
      const saleDate = new Date(sale.sale_date).toISOString().split("T")[0];
      const dayData = chartData.find((d) => d.date === saleDate);
      if (dayData) {
        dayData.revenue += Number(sale.revenue);
      }
    });

    return NextResponse.json({
      metrics: {
        totalPerfumes: totalPerfumes || 0,
        lowStockCount,
        monthlyRevenue,
        netProfit,
      },
      lowStockItems: lowStockItems || [],
      recentSales: recentSales || [],
      chartData,
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
