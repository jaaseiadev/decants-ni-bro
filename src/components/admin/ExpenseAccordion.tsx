'use client';

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
}

interface ExpenseAccordionProps {
  expenses: Expense[];
}

export default function ExpenseAccordion({ expenses }: ExpenseAccordionProps) {
  const total = expenses.reduce((acc, exp) => acc + Number(exp.amount), 0);

  return (
    <details className="group border-t border-ds-border py-4 mt-8">
      <summary className="flex justify-between items-center font-serif text-2xl cursor-pointer list-none">
        <span>Expense Log</span>
        <span className="flex items-center gap-4">
          <span className="text-ds-taupe font-sans text-sm tracking-widest uppercase">Total: ₱{total.toLocaleString()}</span>
          <span className="transition group-open:rotate-180">
            <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
          </span>
        </span>
      </summary>
      <div className="mt-4 pt-4 border-t border-ds-border/50">
        {expenses.length === 0 ? (
          <p className="text-ds-taupe text-sm">No expenses recorded for this month.</p>
        ) : (
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div key={expense.id} className="flex justify-between items-start text-sm">
                <div>
                  <div className="font-medium text-ds-black">{expense.category}</div>
                  {expense.description && (
                    <div className="text-ds-taupe">{expense.description}</div>
                  )}
                </div>
                <div className="font-mono text-ds-black">
                  ₱{Number(expense.amount).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </details>
  );
}
