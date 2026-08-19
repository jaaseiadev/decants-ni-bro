'use client';

interface Expense {
  id: string;
  category: string;
  description: string | null;
  amount: number | string;
}

interface ExpenseAccordionProps {
  expenses: Expense[];
}

export default function ExpenseAccordion({ expenses }: ExpenseAccordionProps) {
  const total = expenses.reduce((acc, exp) => acc + Number(exp.amount), 0);

  return (
    <details className="group border-ds-greige mt-8 border bg-white p-5 md:p-6">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-2xl">
        <span>Expense Log</span>
        <span className="flex items-center gap-4">
          <span className="text-ds-taupe font-sans text-xs tracking-widest uppercase">
            Total: ₱{total.toLocaleString()}
          </span>
          <span className="transition group-open:rotate-180">
            <svg
              fill="none"
              height="24"
              shapeRendering="geometricPrecision"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              width="24"
            >
              <path d="M6 9l6 6 6-6"></path>
            </svg>
          </span>
        </span>
      </summary>
      <div className="border-ds-greige mt-4 border-t pt-4">
        {expenses.length === 0 ? (
          <p className="text-ds-taupe text-sm">No expenses recorded for this period.</p>
        ) : (
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div key={expense.id} className="flex items-start justify-between text-sm">
                <div>
                  <div className="text-ds-black font-medium">{expense.category}</div>
                  {expense.description && (
                    <div className="text-ds-taupe">{expense.description}</div>
                  )}
                </div>
                <div className="text-ds-black font-mono">
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
