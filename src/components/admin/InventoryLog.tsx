import React from 'react';

export interface LogEntry {
  id: string;
  timestamp: string;
  perfumeName: string;
  change: number;
  type: 'sale' | 'restock';
}

export const InventoryLog: React.FC<{ logs: LogEntry[] }> = ({ logs }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-stone-200">
      <h3 className="text-lg font-semibold mb-4 text-stone-800">Inventory Log</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {logs.map(log => (
          <div key={log.id} className="flex justify-between items-center text-sm font-mono border-b border-stone-100 pb-2 last:border-0">
            <div>
              <span className="text-stone-500">{new Date(log.timestamp).toLocaleString()}</span>
              <span className="mx-2 text-stone-700">{log.perfumeName}</span>
            </div>
            <div className={log.type === 'restock' ? 'text-green-600' : 'text-red-600'}>
              {log.type === 'restock' ? '+' : ''}{log.change} ml
            </div>
          </div>
        ))}
        {logs.length === 0 && (
          <p className="text-stone-500 italic">No inventory changes recorded yet.</p>
        )}
      </div>
    </div>
  );
};
