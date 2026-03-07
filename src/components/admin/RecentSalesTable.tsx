import React from "react";

interface Sale {
  id: string;
  perfume_name: string;
  size: "5ml" | "10ml" | "full_bottle";
  qty: number;
  revenue: number;
  sale_date: string;
}

interface RecentSalesTableProps {
  sales: Sale[];
}

export function RecentSalesTable({ sales }: RecentSalesTableProps) {
  if (!sales || sales.length === 0) {
    return <div className="text-ds-taupe text-sm p-4 text-center">No recent sales.</div>;
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-sm font-sans border-collapse">
        <thead>
          <tr className="border-b border-ds-greige text-ds-taupe uppercase tracking-widest text-xs">
            <th className="py-4 px-4 font-normal">Perfume</th>
            <th className="py-4 px-4 font-normal">Size</th>
            <th className="py-4 px-4 font-normal">Qty</th>
            <th className="py-4 px-4 font-normal text-right">Revenue</th>
            <th className="py-4 px-4 font-normal text-right">Date</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale, index) => (
            <tr
              key={sale.id}
              className={index % 2 === 0 ? "bg-ds-ivory" : "bg-ds-greige/20"}
            >
              <td className="py-3 px-4 font-serif text-lg text-ds-black">{sale.perfume_name}</td>
              <td className="py-3 px-4 text-ds-charcoal">{sale.size}</td>
              <td className="py-3 px-4 text-ds-charcoal">{sale.qty}</td>
              <td className="py-3 px-4 text-ds-charcoal text-right font-medium">₱{sale.revenue}</td>
              <td className="py-3 px-4 text-ds-taupe text-right text-xs">
                {new Date(sale.sale_date).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
