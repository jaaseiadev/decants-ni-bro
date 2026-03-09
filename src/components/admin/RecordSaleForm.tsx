'use client';

import React, { useState, useEffect } from 'react';
import { createSaleRecord } from '@/app/admin/sales/actions';

interface Perfume {
  id: string;
  name: string;
  price_5ml: number;
  price_10ml: number;
}

interface RecordSaleFormProps {
  perfumes: Perfume[];
}

export default function RecordSaleForm({ perfumes }: RecordSaleFormProps) {
  const [selectedPerfumeId, setSelectedPerfumeId] = useState('');
  const [size, setSize] = useState<'5ml' | '10ml'>('5ml');
  const [qty, setQty] = useState(1);
  const [unitPrice, setUnitPrice] = useState<number | ''>('');
  const [saleDate, setSaleDate] = useState(() => {
    // Default to today in YYYY-MM-DD format
    return new Date().toISOString().split('T')[0];
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const selectedPerfume = perfumes.find(p => p.id === selectedPerfumeId);

  // Auto-fill price when perfume or size changes
  useEffect(() => {
    if (selectedPerfume) {
      if (size === '5ml') {
        setUnitPrice(selectedPerfume.price_5ml);
      } else if (size === '10ml') {
        setUnitPrice(selectedPerfume.price_10ml);
      }
    } else {
      setUnitPrice('');
    }
  }, [selectedPerfumeId, size, selectedPerfume]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!selectedPerfumeId || !selectedPerfume || unitPrice === '') {
      setMessage({ type: 'error', text: 'Please fill all required fields.' });
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('perfume_id', selectedPerfume.id);
    formData.append('perfume_name', selectedPerfume.name);
    formData.append('size', size);
    formData.append('qty', qty.toString());
    formData.append('price', unitPrice.toString()); // Passing unit price as 'price'
    formData.append('sale_date', saleDate);

    const result = await createSaleRecord(formData);

    if (result.success) {
      setMessage({ type: 'success', text: 'Sale recorded successfully!' });
      // Reset form (keep date same or reset to today as desired; resetting to defaults makes sense)
      setSelectedPerfumeId('');
      setSize('5ml');
      setQty(1);
      // Let it remain on same date if they are doing bulk backfill, or reset it.
      // Usually good to keep the same date if they are typing past data sequentially.
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to record sale.' });
    }

    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg border border-ds-greige p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Perfume Selection */}
        <div>
          <label className="block text-sm font-medium text-ds-charcoal mb-1">Perfume</label>
          <select
            value={selectedPerfumeId}
            onChange={(e) => setSelectedPerfumeId(e.target.value)}
            className="w-full rounded-md border border-ds-greige px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ds-taupe bg-transparent"
            required
          >
            <option value="" disabled>Select a perfume...</option>
            {perfumes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Size Selection */}
        <div>
          <label className="block text-sm font-medium text-ds-charcoal mb-1">Size</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-ds-charcoal cursor-pointer">
              <input
                type="radio"
                name="size"
                value="5ml"
                checked={size === '5ml'}
                onChange={() => setSize('5ml')}
                className="text-ds-taupe focus:ring-ds-taupe accent-ds-taupe"
              />
              5ml
            </label>
            <label className="flex items-center gap-2 text-sm text-ds-charcoal cursor-pointer">
              <input
                type="radio"
                name="size"
                value="10ml"
                checked={size === '10ml'}
                onChange={() => setSize('10ml')}
                className="text-ds-taupe focus:ring-ds-taupe accent-ds-taupe"
              />
              10ml
            </label>
          </div>
        </div>

        {/* Quantity & Price */}
        <div className="flex gap-4">
          <div className="w-1/3">
            <label className="block text-sm font-medium text-ds-charcoal mb-1">Quantity</label>
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(parseInt(e.target.value, 10))}
              className="w-full rounded-md border border-ds-greige px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ds-taupe"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-ds-charcoal mb-1">Unit Price (₱)</label>
            <input
              type="number"
              step="0.01"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
              placeholder="0.00"
              className="w-full rounded-md border border-ds-greige px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ds-taupe"
              required
            />
          </div>
        </div>

        {/* Date of Sale */}
        <div>
          <label className="block text-sm font-medium text-ds-charcoal mb-1">Date of Sale</label>
          <input
            type="date"
            value={saleDate}
            onChange={(e) => setSaleDate(e.target.value)}
            className="w-full rounded-md border border-ds-greige px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ds-taupe cursor-pointer"
            required
            max={new Date().toISOString().split('T')[0]} // Optional: restrict to not be future
          />
        </div>

        {/* Submit & Messages */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ds-black text-white rounded-md py-2 text-sm font-medium hover:bg-ds-charcoal transition-colors disabled:opacity-70"
        >
          {loading ? 'Recording...' : 'Record Sale'}
        </button>

        {message && (
          <div className={`p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
}