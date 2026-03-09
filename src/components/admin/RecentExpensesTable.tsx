export default function RecentExpensesTable({ expenses }: { expenses: any[] }) {
  if (!expenses || expenses.length === 0) {
    return <div className="text-sm text-gray-500">No recent expenses found.</div>;
  }

  return (
    <div className="w-full overflow-auto rounded-md border border-neutral-200">
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-neutral-100/50 data-[state=selected]:bg-neutral-100">
            <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500 text-xs uppercase tracking-wider">Date</th>
            <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500 text-xs uppercase tracking-wider">Description</th>
            <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500 text-xs uppercase tracking-wider">Category</th>
            <th className="h-12 px-4 text-right align-middle font-medium text-neutral-500 text-xs uppercase tracking-wider">Amount</th>
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {expenses.map((expense) => (
            <tr key={expense.id} className="border-b transition-colors hover:bg-neutral-100/50 data-[state=selected]:bg-neutral-100">
              <td className="p-4 align-middle whitespace-nowrap">
                {new Date(expense.created_at).toLocaleDateString()}
              </td>
              <td className="p-4 align-middle font-medium">
                {expense.description}
              </td>
              <td className="p-4 align-middle">
                {expense.category}
              </td>
              <td className="p-4 align-middle text-right font-medium">
                ₱{Number(expense.amount).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
