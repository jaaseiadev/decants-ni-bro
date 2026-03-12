import React from 'react';

interface StockProgressBarProps {
  currentStock: number;
  maxStock: number;
}

export const StockProgressBar: React.FC<StockProgressBarProps> = ({ currentStock, maxStock }) => {
  const percentage = Math.min((currentStock / maxStock) * 100, 100);
  const isLow = percentage < 20;

  return (
    <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
      <div 
        className={`h-full transition-all duration-300 ${isLow ? 'bg-red-400' : 'bg-[#e0d6cd]'}`} 
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
