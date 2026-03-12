"use client";

import React, { useState, useEffect } from "react";
import { StockProgressBar } from "@/components/admin/StockProgressBar";
import { InventoryLog, LogEntry } from "@/components/admin/InventoryLog";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusPill } from "@/components/ui/status-pill";

export default function InventoryAdminPage() {
  const supabase = createClient();
  const [perfumes, setPerfumes] = useState<any[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [restockAmount, setRestockAmount] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setIsLoading(true);
    // Mocking API fetch since backend implementation may vary depending on DB structure.
    try {
      const { data: perfumesData, error: perfumesError } = await supabase.from('perfumes').select('*').order('name');
      if (perfumesError) throw perfumesError;
      
      const { data: logsData, error: logsError } = await supabase.from('inventory_log').select('*').order('created_at', { ascending: false });
      if (logsError && logsError.code !== '42P01') { 
          console.error(logsError);
      }
      
      setPerfumes(perfumesData || []);
      
      // Map to LogEntry
      const formattedLogs = (logsData || []).map(log => ({
        id: log.id,
        timestamp: log.created_at,
        perfumeName: log.perfume_name,
        change: log.change_ml,
        type: log.type as 'restock' | 'sale'
      }));
      setLogs(formattedLogs);
    } catch(err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestock = async (id: string, name: string) => {
    const newStatus = restockAmount[id];
    if (!newStatus) return;

    try {
      const { error: updateError } = await supabase.from('perfumes').update({ status: newStatus }).eq('id', id);
      if (updateError) throw updateError;

      // Create log (mocking change_ml with 0 since we only updated status)
      const { error: logError } = await supabase.from('inventory_log').insert([{
        perfume_id: id,
        perfume_name: name,
        change_ml: 0,
        type: 'adjustment',
      }]);
      
      // Refresh
      fetchInventory();
      setRestockAmount(prev => ({ ...prev, [id]: '' }));
    } catch(err) {
      console.error('Failed to update status', err);
      alert('Failed to update status. Please check the logs.');
    }
  };

  if (isLoading) return <div>Loading inventory...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-[#fcfbf9] border-b text-sm text-stone-600 uppercase tracking-wide">
                <tr>
                  <th className="px-6 py-4 font-medium">Perfume</th>
                  <th className="px-6 py-4 font-medium">Stock (ml)</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {perfumes.map(perfume => (
                  <tr key={perfume.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 flex items-center space-x-4">
                        <img src={perfume.image_url || '/placeholder.jpg'} alt={perfume.name} className="w-12 h-12 rounded object-cover border border-stone-200" />
                        <div>
                           <div className="font-semibold text-stone-800">{perfume.name}</div>
                           <div className="text-xs text-stone-500">Last updated: {new Date(perfume.updated_at || Date.now()).toLocaleDateString()}</div>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="font-bold text-lg mb-2 capitalize">{perfume.status || 'in stock'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={perfume.status as "in stock" | "in transit" | "out of stock" | "new"} />
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2">
                           <select 
                             className="form-select h-10 border-stone-300 focus:border-[#d9cca5] bg-nude-50 rounded px-2"
                             value={restockAmount[perfume.id] || perfume.status || 'in stock'}
                             onChange={(e) => setRestockAmount({...restockAmount, [perfume.id]: e.target.value})}
                           >
                             <option value="in stock">In Stock</option>
                             <option value="out of stock">Out of Stock</option>
                             <option value="new">New</option>
                             <option value="in transit">In Transit</option>
                           </select>
                           <Button 
                             onClick={() => handleRestock(perfume.id, perfume.name)}
                             className="bg-black hover:bg-stone-800 text-white"
                           >
                             Update Status
                           </Button>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <InventoryLog logs={logs} />
        </div>
      </div>
    </div>
  );
}
