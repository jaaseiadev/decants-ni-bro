import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const month = searchParams.get('month'); // Expecting format: "YYYY-MM"

  if (!month) {
    return NextResponse.json({ error: 'Missing month parameter' }, { status: 400 });
  }

  const supabase = createClient();
  
  // Calculate date ranges for the given month
  const startDate = new Date(`${month}-01T00:00:00Z`);
  const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59, 999);

  // Fetch sales for the month
  const { data: sales, error: salesError } = await supabase
    .from('sales')
    .select('*')
    .gte('sale_date', startDate.toISOString())
    .lte('sale_date', endDate.toISOString());

  // Fetch expenses for the month
  const { data: expenses, error: expensesError } = await supabase
    .from('expenses')
    .select('*')
    .eq('month', month);

  if (salesError || expensesError) {
    console.error('Error fetching stats:', salesError || expensesError);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }

  // Aggregate stats
  let totalRevenue = 0;
  let totalProfit = 0; // Gross profit from sales
  let totalMlSold = 0;
  
  // Data for breakdown table & chart
  const perfumeStats: Record<string, { name: string, ml: number, units5ml: number, units10ml: number, rev5ml: number, rev10ml: number, totalRev: number }> = {};

  sales.forEach((sale) => {
    totalRevenue += Number(sale.revenue || 0);
    totalProfit += Number(sale.profit || 0);
    
    let ml = 0;
    if (sale.size === '5ml') ml = 5 * sale.qty;
    else if (sale.size === '10ml') ml = 10 * sale.qty;
    else if (sale.size === 'full_bottle') ml = 100 * sale.qty; // Assuming full bottle is 100ml for stats if not specified
    
    totalMlSold += ml;

    if (!perfumeStats[sale.perfume_name]) {
      perfumeStats[sale.perfume_name] = { name: sale.perfume_name, ml: 0, units5ml: 0, units10ml: 0, rev5ml: 0, rev10ml: 0, totalRev: 0 };
    }
    
    perfumeStats[sale.perfume_name].ml += ml;
    perfumeStats[sale.perfume_name].totalRev += Number(sale.revenue || 0);
    
    if (sale.size === '5ml') {
      perfumeStats[sale.perfume_name].units5ml += sale.qty;
      perfumeStats[sale.perfume_name].rev5ml += Number(sale.revenue || 0);
    } else if (sale.size === '10ml') {
      perfumeStats[sale.perfume_name].units10ml += sale.qty;
      perfumeStats[sale.perfume_name].rev10ml += Number(sale.revenue || 0);
    }
  });

  const chartData = Object.values(perfumeStats).sort((a, b) => b.totalRev - a.totalRev);

  let totalExpenses = 0;
  expenses.forEach((expense) => {
    totalExpenses += Number(expense.amount || 0);
  });

  const netProfit = totalProfit - totalExpenses;

  return NextResponse.json({
    totalRevenue,
    totalMlSold,
    netProfit,
    chartData,
    expenses
  });
}
