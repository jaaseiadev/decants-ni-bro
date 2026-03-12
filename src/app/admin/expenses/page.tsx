import { createClient } from "@/lib/supabase/server";
import RecordExpenseForm from "@/components/admin/RecordExpenseForm";
import RecentExpensesTable from "@/components/admin/RecentExpensesTable";

export const metadata = {
  title: "Expenses | Admin Dashboard",
};

export default async function ExpensesPage() {
  const supabase = await createClient();
  
  const { data: expenses } = await supabase
    .from("expenses")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
        <p className="text-gray-500 mt-2">Manage and track your business expenses.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Log Expense</h2>
          <RecordExpenseForm />
        </div>

        <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm flex flex-col">
          <h2 className="text-lg font-semibold mb-6">Recent Expenses</h2>
          <RecentExpensesTable expenses={expenses || []} />
        </div>
      </div>
    </div>
  );
}
