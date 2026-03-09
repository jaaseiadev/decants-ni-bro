import React from 'react';
import { createClient } from '@/lib/supabase/server';
import RecordSaleForm from '@/components/admin/RecordSaleForm';
import { RecentSalesTable } from '@/components/admin/RecentSalesTable';

export const dynamic = 'force-dynamic';

export default async function SalesPage() {
  const supabase = await createClient();

  // Fetch all active perfumes for the dropdown
  const { data: perfumes } = await supabase
    .from('perfumes')
    .select('id, name, price_5ml, price_10ml')
    .eq('status', 'active')
    .order('name');

  // Fetch recent sales for the table
  const { data: recentSales } = await supabase
    .from('sales')
    .select('*')
    .order('sale_date', { ascending: false })
    .limit(10);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h1 className="text-2xl font-serif mb-4">New Sale</h1>
        <RecordSaleForm perfumes={perfumes || []} />
      </div>
      <div>
        <h2 className="text-xl font-serif mb-4">Recent Sales</h2>
        <div className="bg-white rounded-lg border border-ds-greige p-4 shadow-sm">
          <RecentSalesTable sales={recentSales || []} />
        </div>
      </div>
    </div>
  );
}