"use client";

import React, { useState, useEffect } from "react";
import { StockProgressBar } from "@/components/admin/StockProgressBar";
import { InventoryLog, LogEntry } from "@/components/admin/InventoryLog";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusPill } from "@/components/ui/status-pill";

export default function InventoryAdminPage() {
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
    const amount = parseInt(restockAmount[id] || '0', 10);
    if (!amount || amount <= 0) return;

    try {
      const perfume = perfumes.find(p => p.id === id);
      const newStock10ml = (perfume.stock_10ml || 0) + amount; // Adding ml to stock_10ml for simplicity as it equates ml if we just treat 'change_ml' as ml amount. Wait, if amount is ml, we'll store stock as ml directly. Or we add 10ml bottles. Let's just track stock_10ml as "total stock ml" for now. Actually, if it's ml, let's just add to stock_10ml but divide by 10. Or just add to stock_10ml. 
      // Let's just add to stock_10ml.
      
      const { error: updateError } = await supabase.from('perfumes').update({ stock_10ml: newStock10ml }).eq('id', id);
      if (updateError) throw updateError;

      // Create log
      const { error: logError } = await supabase.from('inventory_log').insert([{
        perfume_id: id,
        perfume_name: name,
        change_ml: amount,
        type: 'restock',
      }]);
      
      // Refresh
      fetchInventory();
      setRestockAmount(prev => ({ ...prev, [id]: '' }));
    } catch(err) {
      console.error('Failed to restock', err);
      alert('Failed to restock. Please check the logs.');
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
                        <div className="font-bold text-lg mb-2">{(perfume.stock_5ml || 0) * 5 + (perfume.stock_10ml || 0) * 10} ml</div>
                        <StockProgressBar currentStock={(perfume.stock_5ml || 0) * 5 + (perfume.stock_10ml || 0) * 10} maxStock={100} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={(perfume.stock_5ml + perfume.stock_10ml) < 5 ? 'low_stock' : 'in_stock'} />
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2">
                           <Input 
                             type="number" 
                             min="1"
                             placeholder="+ml" 
                             className="w-20 form-input h-10 border-stone-300 focus:border-[#d9cca5] bg-nude-50"
                             value={restockAmount[perfume.id] || ''}
                             onChange={(e) => setRestockAmount({...restockAmount, [perfume.id]: e.target.value})}
                           />
                           <Button 
                             onClick={() => handleRestock(perfume.id, perfume.name)}
                             className="bg-[#d9cca5] hover:bg-[#c9baa2] text-stone-800"
                           >
                             ADD STOCK
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
