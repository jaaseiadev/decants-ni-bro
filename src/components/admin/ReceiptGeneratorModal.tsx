'use client';

import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

interface Perfume {
  id: string;
  name: string;
  image_url: string | null;
  price_5ml: number;
  price_10ml: number;
}

interface ReceiptItem {
  id: string;
  perfume: Perfume;
  size: '5ml' | '10ml';
  qty: number;
  unitPrice: number;
  totalPrice: number;
}

interface ReceiptGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  perfumes: Perfume[];
}

export default function ReceiptGeneratorModal({ isOpen, onClose, perfumes }: ReceiptGeneratorModalProps) {
  const [items, setItems] = useState<ReceiptItem[]>([]);
  const [selectedPerfumeId, setSelectedPerfumeId] = useState('');
  const [size, setSize] = useState<'5ml' | '10ml'>('5ml');
  const [qty, setQty] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const selectedPerfume = perfumes.find(p => p.id === selectedPerfumeId);

  const currentUnitPrice = selectedPerfume 
    ? (size === '5ml' ? selectedPerfume.price_5ml : selectedPerfume.price_10ml) 
    : 0;

  const handleAddItem = () => {
    if (!selectedPerfume) return;

    const newItem: ReceiptItem = {
      id: Math.random().toString(36).substring(7),
      perfume: selectedPerfume,
      size,
      qty,
      unitPrice: currentUnitPrice,
      totalPrice: currentUnitPrice * qty,
    };

    setItems([...items, newItem]);
    
    // Reset selection
    setSelectedPerfumeId('');
    setQty(1);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  const handlePrint = () => {
    window.print();
  };

  const handleExportImage = async () => {
    if (!receiptRef.current || isExporting) return;
    
    setIsExporting(true);
    try {
      // 1. Get the HTML of the receipt
      let clone = receiptRef.current.cloneNode(true) as HTMLDivElement;
      
      // Update relative image URLs to base64 data URIs so external API can render them
      const images = Array.from(clone.querySelectorAll('img'));
      await Promise.all(images.map(async (img) => {
        const originalSrc = img.getAttribute('src') || '';
        
        // Skip external images for now, or convert them if necessary.
        // For local assets (starting with /), convert to base64.
        if (originalSrc.startsWith('/') && !originalSrc.startsWith('//')) {
          try {
            const res = await fetch(originalSrc);
            const blob = await res.blob();
            const reader = new FileReader();
            await new Promise((resolve) => {
              reader.onloadend = () => {
                img.src = reader.result as string;
                resolve(null);
              };
              reader.readAsDataURL(blob);
            });
          } catch (e) {
            console.error('Failed to encode local image:', originalSrc, e);
          }
        } else if (!img.src.startsWith('http')) {
          const url = new URL(originalSrc, window.location.origin);
          img.src = url.href;
        }
      }));

      // Adjust clone to ensure it looks good standalone
      clone.style.width = '380px';
      clone.style.margin = '0 auto';
      clone.style.padding = '24px';
      clone.style.backgroundColor = '#ffffff';

      // 2. Wrap it with Tailwind CDN and basic setup
      const fullHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Inter', sans-serif; background: #ffffff; display: flex; justify-content: center; padding: 20px; }
          </style>
        </head>
        <body>
          ${clone.outerHTML}
        </body>
        </html>
      `;

      // 3. Optional: Set button to loading state (you could add a state variable for this)
      
      // 4. Send request to the html2png API using our server-side proxy
      const rect = receiptRef.current.getBoundingClientRect();
      const exportWidth = 420;
      const exportHeight = Math.max(600, Math.ceil(rect.height) + 60); // 60 for some padding
      
      const response = await fetch('/api/export-receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          html: fullHtml,
          width: exportWidth,
          height: exportHeight,
          format: 'png',
          deviceScaleFactor: 2
        })
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      // 5. Download the returned image directly
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.download = `DecantsNiBro-Receipt-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = objectUrl;
      link.click();
      
      window.URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error('Failed to export receipt image:', err);
      alert('Failed to export receipt as picture. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#FAF9F6] w-full max-w-5xl h-[90vh] rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-ds-greige">
        
        {/* Left Side: Form Controls */}
        <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto border-r border-ds-greige flex flex-col gap-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-serif text-ds-black">Receipt Generator</h2>
            <button onClick={onClose} className="md:hidden text-ds-charcoal hover:text-black">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ds-charcoal mb-1">Customer Name (Optional)</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Juan dela Cruz"
                className="w-full rounded-md border border-ds-greige px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ds-taupe bg-white"
              />
            </div>

            <div className="border-t border-ds-greige pt-4 mt-2">
              <h3 className="text-md font-medium text-ds-black mb-3">Add Item</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ds-charcoal mb-1">Perfume</label>
                  <select
                    value={selectedPerfumeId}
                    onChange={(e) => setSelectedPerfumeId(e.target.value)}
                    className="w-full rounded-md border border-ds-greige px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ds-taupe bg-white"
                  >
                    <option value="" disabled>Select a perfume...</option>
                    {perfumes.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-ds-charcoal mb-1">Size</label>
                    <div className="flex gap-4 items-center h-9">
                      <label className="flex items-center gap-2 text-sm text-ds-charcoal cursor-pointer">
                        <input type="radio" name="rec_size" value="5ml" checked={size === '5ml'} onChange={() => setSize('5ml')} className="text-ds-taupe focus:ring-ds-taupe accent-ds-taupe" />
                        5ml
                      </label>
                      <label className="flex items-center gap-2 text-sm text-ds-charcoal cursor-pointer">
                        <input type="radio" name="rec_size" value="10ml" checked={size === '10ml'} onChange={() => setSize('10ml')} className="text-ds-taupe focus:ring-ds-taupe accent-ds-taupe" />
                        10ml
                      </label>
                    </div>
                  </div>
                  
                  <div className="w-24">
                    <label className="block text-sm font-medium text-ds-charcoal mb-1">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={qty}
                      onChange={(e) => setQty(Math.max(1, parseInt(e.target.value || '1', 10)))}
                      className="w-full rounded-md border border-ds-greige px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ds-taupe bg-white"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-ds-charcoal">Unit Price: </span>
                    <span className="font-medium text-ds-black">₱{currentUnitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  
                  <button
                    onClick={handleAddItem}
                    disabled={!selectedPerfume}
                    className="bg-ds-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-ds-charcoal disabled:opacity-50 transition-colors"
                  >
                    Add to Receipt
                  </button>
                </div>
              </div>
            </div>

            {/* List of current items to manage them */}
            {items.length > 0 && (
              <div className="border-t border-ds-greige pt-4 mt-2">
                <h3 className="text-sm font-medium text-ds-black mb-2">Items on Receipt</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                  {items.map((item, idx) => (
                    <div key={item.id} className="flex justify-between items-center bg-white p-2 rounded border border-ds-greige text-sm">
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-ds-taupe w-4">{idx + 1}.</span>
                        <span className="truncate max-w-[120px] sm:max-w-[180px] font-medium">{item.perfume.name}</span>
                        <span className="text-xs text-ds-charcoal bg-ds-greige/30 px-1.5 py-0.5 rounded">{item.size}</span>
                        <span className="text-xs text-ds-charcoal">x{item.qty}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-medium">₱{item.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </div>

        {/* Right Side: Receipt Preview */}
        <div className="w-full md:w-1/2 bg-stone-100 flex flex-col relative print:w-full print:absolute print:inset-0 print:bg-white print:z-[9999]">
          
          <div className="absolute top-4 right-4 flex gap-2 z-10 print:hidden">
            <button onClick={handleExportImage} disabled={isExporting} className="bg-white border border-stone-200 shadow-sm text-ds-charcoal px-3 py-1.5 rounded-md text-sm font-medium hover:bg-stone-50 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all" title="Export as Picture">
              {isExporting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-ds-charcoal" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Exporting...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Export
                </>
              )}
            </button>
            <button onClick={handlePrint} className="bg-white border border-stone-200 shadow-sm text-ds-charcoal px-3 py-1.5 rounded-md text-sm font-medium hover:bg-stone-50 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
            <button onClick={onClose} className="bg-white border border-stone-200 shadow-sm text-ds-charcoal p-1.5 rounded-md hover:bg-stone-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 flex items-center justify-center bg-stone-200 print:bg-white print:p-0">
            {/* The Receipt Itself */}
            <div 
              ref={receiptRef}
              className="bg-white w-full max-w-[380px] min-h-[500px] shadow-lg print:shadow-none p-6 font-mono text-stone-800 relative receipt-preview"
            >
              {/* Receipt Header */}
              <div className="text-center mb-6 border-b-2 border-stone-200 pb-6 border-dashed">
                <h1 className="text-2xl font-bold tracking-widest text-black uppercase mb-1">DECANTS NI BRO</h1>
                <p className="text-xs tracking-wider uppercase text-stone-500 mb-1">Premium Fragrance Decants</p>
                <p className="text-xs text-stone-400">Instagram: @decantsnibro</p>
                <div className="mt-4 text-xs flex justify-between text-stone-500 font-sans">
                  <span>DATE: {new Date().toLocaleDateString()}</span>
                  <span>TIME: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                {customerName && (
                  <div className="mt-2 text-sm text-left font-sans font-medium">
                    CUSTOMER: <span className="uppercase">{customerName}</span>
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="space-y-4 mb-6">
                <div className="text-[10px] uppercase font-bold tracking-wider text-stone-400 flex justify-between border-b border-stone-100 pb-2">
                  <span>Item</span>
                  <span>Amount</span>
                </div>
                
                {items.length === 0 ? (
                  <div className="text-center text-stone-300 text-sm py-8 italic font-sans">
                    No items added yet
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start gap-3">
                      <div className="flex gap-3 flex-1">
                        <div className="w-10 h-10 rounded overflow-hidden shrink-0 border border-stone-100 bg-stone-50 flex items-center justify-center">
                          {item.perfume.image_url ? (
                            <img src={item.perfume.image_url} alt={item.perfume.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[8px] text-stone-300">No Img</span>
                          )}
                        </div>
                        <div className="leading-tight">
                          <div className="font-bold text-sm">{item.perfume.name}</div>
                          <div className="text-xs text-stone-500 font-sans mt-0.5">
                            {item.size} × {item.qty} @ ₱{item.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                      </div>
                      <div className="font-bold text-sm shrink-0 pt-0.5">
                        ₱{item.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Total */}
              <div className="border-t-2 border-stone-200 border-dashed pt-4 mb-8">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>TOTAL</span>
                  <span>₱{totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="text-right mt-1 text-xs text-stone-400 font-sans">
                  Tax Included
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-xs text-stone-400 font-sans space-y-1">
                <div className="flex justify-center items-center gap-12 py-4">
                  <div className="flex flex-col items-center">
                    <img src="/cyjay-signature.svg" alt="Cyjay Signature" className="h-10 object-contain opacity-70 mix-blend-multiply" />
                    <div className="h-px bg-stone-300 w-16 mt-1 mb-1"></div>
                    <span className="text-[9px] uppercase font-bold tracking-widest text-stone-500">Cyjay</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <img src="/jaaseia-signature.svg" alt="Jaaseia Signature" className="h-10 object-contain opacity-70 mix-blend-multiply" />
                    <div className="h-px bg-stone-300 w-16 mt-1 mb-1"></div>
                    <span className="text-[9px] uppercase font-bold tracking-widest text-stone-500">Jaaseia</span>
                  </div>
                </div>
                <p className="font-medium text-stone-500 pb-1">Thank you for choosing Decants ni Bro!</p>
                <p>We hope you enjoy your fragrances.</p>
                <div className="pt-6 flex flex-col items-center gap-1">
                  {/* Fake barcode */}
                  <div className="flex bg-white px-2 py-1 justify-center w-full relative">
                    <div className="h-10 flex justify-center items-center gap-[1px]">
                      {[...Array(50)].map((_, i) => {
                        const isThick = (i * 7) % 5 === 0;
                        const isHidden = (i * 13) % 7 === 0;
                        return (
                          <div 
                            key={i} 
                            className="bg-stone-800 h-full" 
                            style={{ 
                              width: isThick ? '2.5px' : '1.5px', 
                              opacity: isHidden ? 0 : 1 
                            }}>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="text-[10px] tracking-[0.4em] font-mono text-stone-400 mt-1">
                    DNB-{new Date().getFullYear()}{new Date().getMonth() + 1}-{(Math.abs(Math.sin((new Date()).getTime())) * 1000000).toFixed(0).padStart(6, '0')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles for printing */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .receipt-preview, .receipt-preview * {
            visibility: visible;
          }
          .receipt-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: 400px;
            margin: 0 auto;
            box-shadow: none !important;
            padding: 20px !important;
          }
        }
      `}} />
    </div>
  );
}
