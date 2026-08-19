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
  size: '5ml' | '10ml' | null;
  qty: number;
  unitPrice: number;
  totalPrice: number;
  isFree: boolean;
}

interface ReceiptGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  perfumes: Perfume[];
}

export default function ReceiptGeneratorModal({
  isOpen,
  onClose,
  perfumes,
}: ReceiptGeneratorModalProps) {
  const [items, setItems] = useState<ReceiptItem[]>([]);
  const [selectedPerfumeId, setSelectedPerfumeId] = useState('');
  const [size, setSize] = useState<'5ml' | '10ml'>('5ml');
  const [qty, setQty] = useState(1);
  const [freeItemName, setFreeItemName] = useState('');
  const [freeItemQty, setFreeItemQty] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const selectedPerfume = perfumes.find((p) => p.id === selectedPerfumeId);

  const currentUnitPrice = selectedPerfume
    ? size === '5ml'
      ? selectedPerfume.price_5ml
      : selectedPerfume.price_10ml
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
      isFree: false,
    };

    setItems([...items, newItem]);

    // Reset selection
    setSelectedPerfumeId('');
    setQty(1);
  };

  const handleAddFreeItem = () => {
    const name = freeItemName.trim();
    if (!name) return;

    const newItem: ReceiptItem = {
      id: Math.random().toString(36).substring(7),
      perfume: {
        id: `free-${Date.now()}`,
        name,
        image_url: null,
        price_5ml: 0,
        price_10ml: 0,
      },
      size: null,
      qty: freeItemQty,
      unitPrice: 0,
      totalPrice: 0,
      isFree: true,
    };

    setItems([...items, newItem]);
    setFreeItemName('');
    setFreeItemQty(1);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleExportImage = async () => {
    if (!receiptRef.current || isExporting) return;

    setIsExporting(true);
    try {
      const receipt = receiptRef.current;
      await document.fonts?.ready;
      await Promise.all(
        Array.from(receipt.querySelectorAll('img')).map(
          (image) =>
            new Promise<void>((resolve) => {
              if (image.complete) {
                resolve();
                return;
              }
              image.addEventListener('load', () => resolve(), { once: true });
              image.addEventListener('error', () => resolve(), { once: true });
            })
        )
      );

      const canvas = await html2canvas(receipt, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        width: receipt.scrollWidth,
        height: receipt.scrollHeight,
        windowWidth: receipt.scrollWidth,
        windowHeight: receipt.scrollHeight,
        scrollX: 0,
        scrollY: 0,
      });
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((result) => {
          if (result) resolve(result);
          else reject(new Error('The receipt image could not be created.'));
        }, 'image/png');
      });
      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.download = `DecantsNiBro-Receipt-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = objectUrl;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch (err) {
      console.error('Failed to export receipt image:', err);
      alert('Failed to export receipt as picture. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="border-ds-greige flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border bg-[#FAF9F6] shadow-2xl md:flex-row">
        {/* Left Side: Form Controls */}
        <div className="border-ds-greige flex w-full flex-col gap-6 overflow-y-auto border-r p-6 md:w-1/2 md:p-8">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-ds-black font-serif text-2xl">Receipt Generator</h2>
            <button onClick={onClose} className="text-ds-charcoal hover:text-black md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-ds-charcoal mb-1 block text-sm font-medium">
                Customer Name (Optional)
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Juan dela Cruz"
                className="border-ds-greige focus:ring-ds-taupe w-full rounded-md border bg-white px-3 py-2 text-sm focus:ring-1 focus:outline-none"
              />
            </div>

            <div className="border-ds-greige mt-2 border-t pt-4">
              <h3 className="text-md text-ds-black mb-3 font-medium">Add Item</h3>

              <div className="space-y-4">
                <div>
                  <label className="text-ds-charcoal mb-1 block text-sm font-medium">Perfume</label>
                  <select
                    value={selectedPerfumeId}
                    onChange={(e) => setSelectedPerfumeId(e.target.value)}
                    className="border-ds-greige focus:ring-ds-taupe w-full rounded-md border bg-white px-3 py-2 text-sm focus:ring-1 focus:outline-none"
                  >
                    <option value="" disabled>
                      Select a perfume...
                    </option>
                    {perfumes.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-ds-charcoal mb-1 block text-sm font-medium">Size</label>
                    <div className="flex h-9 items-center gap-4">
                      <label className="text-ds-charcoal flex cursor-pointer items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="rec_size"
                          value="5ml"
                          checked={size === '5ml'}
                          onChange={() => setSize('5ml')}
                          className="text-ds-taupe focus:ring-ds-taupe accent-ds-taupe"
                        />
                        5ml
                      </label>
                      <label className="text-ds-charcoal flex cursor-pointer items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="rec_size"
                          value="10ml"
                          checked={size === '10ml'}
                          onChange={() => setSize('10ml')}
                          className="text-ds-taupe focus:ring-ds-taupe accent-ds-taupe"
                        />
                        10ml
                      </label>
                    </div>
                  </div>

                  <div className="w-24">
                    <label className="text-ds-charcoal mb-1 block text-sm font-medium">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={qty}
                      onChange={(e) => setQty(Math.max(1, parseInt(e.target.value || '1', 10)))}
                      className="border-ds-greige focus:ring-ds-taupe w-full rounded-md border bg-white px-3 py-2 text-sm focus:ring-1 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-sm">
                    <span className="text-ds-charcoal">Unit Price: </span>
                    <span className="text-ds-black font-medium">
                      ₱{currentUnitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <button
                    onClick={handleAddItem}
                    disabled={!selectedPerfume}
                    className="bg-ds-black hover:bg-ds-charcoal rounded-md px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
                  >
                    Add to Receipt
                  </button>
                </div>
              </div>
            </div>

            <div className="border-ds-greige mt-2 border-t pt-4">
              <h3 className="text-md text-ds-black mb-1 font-medium">Add Free Item</h3>
              <p className="text-ds-taupe mb-3 text-xs">
                Type any complimentary item to list it on the receipt at no charge.
              </p>

              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="text-ds-charcoal mb-1 block text-sm font-medium">
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={freeItemName}
                    onChange={(e) => setFreeItemName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddFreeItem();
                    }}
                    placeholder="e.g. Free sample vial"
                    className="border-ds-greige focus:ring-ds-taupe w-full rounded-md border bg-white px-3 py-2 text-sm focus:ring-1 focus:outline-none"
                  />
                </div>
                <div className="w-20">
                  <label className="text-ds-charcoal mb-1 block text-sm font-medium">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={freeItemQty}
                    onChange={(e) =>
                      setFreeItemQty(Math.max(1, parseInt(e.target.value || '1', 10)))
                    }
                    className="border-ds-greige focus:ring-ds-taupe w-full rounded-md border bg-white px-3 py-2 text-sm focus:ring-1 focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleAddFreeItem}
                  disabled={!freeItemName.trim()}
                  className="bg-ds-black hover:bg-ds-charcoal rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap text-white transition-colors disabled:opacity-50"
                >
                  Add Free
                </button>
              </div>
            </div>

            {/* List of current items to manage them */}
            {items.length > 0 && (
              <div className="border-ds-greige mt-2 border-t pt-4">
                <h3 className="text-ds-black mb-2 text-sm font-medium">Items on Receipt</h3>
                <div className="max-h-40 space-y-2 overflow-y-auto pr-2">
                  {items.map((item, idx) => (
                    <div
                      key={item.id}
                      className="border-ds-greige flex items-center justify-between rounded border bg-white p-2 text-sm"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-ds-taupe w-4">{idx + 1}.</span>
                        <span className="max-w-[120px] truncate font-medium sm:max-w-[180px]">
                          {item.perfume.name}
                        </span>
                        <span className="text-ds-charcoal bg-ds-greige/30 rounded px-1.5 py-0.5 text-xs">
                          {item.isFree ? 'FREE' : item.size}
                        </span>
                        <span className="text-ds-charcoal text-xs">x{item.qty}</span>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="font-medium">
                          {item.isFree
                            ? 'FREE'
                            : `₱${item.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                        </span>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
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
        <div className="relative flex w-full flex-col bg-stone-100 md:w-1/2 print:absolute print:inset-0 print:z-[9999] print:w-full print:bg-white">
          <div className="absolute top-4 right-4 z-10 flex gap-2 print:hidden">
            <button
              onClick={handleExportImage}
              disabled={isExporting}
              className="text-ds-charcoal flex items-center gap-2 rounded-md border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium shadow-sm transition-all hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-70"
              title="Export as Picture"
            >
              {isExporting ? (
                <>
                  <svg
                    className="text-ds-charcoal h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Exporting...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  Export
                </>
              )}
            </button>
            <button
              onClick={handlePrint}
              className="text-ds-charcoal flex items-center gap-2 rounded-md border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-stone-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Print
            </button>
            <button
              onClick={onClose}
              className="text-ds-charcoal rounded-md border border-stone-200 bg-white p-1.5 shadow-sm hover:bg-stone-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex flex-1 items-center justify-center overflow-y-auto bg-stone-200 p-8 print:bg-white print:p-0">
            {/* The Receipt Itself */}
            <div
              ref={receiptRef}
              className="receipt-preview relative min-h-[500px] w-full max-w-[380px] bg-white p-6 font-mono text-[#292524] shadow-lg print:shadow-none"
            >
              {/* Receipt Header */}
              <div className="mb-6 border-b-2 border-dashed border-[#e7e5e4] pb-6 text-center">
                <h1 className="mb-1 text-2xl font-bold tracking-widest text-black uppercase">
                  DECANTS NI BRO
                </h1>
                <p className="mb-1 text-xs tracking-wider text-[#78716c] uppercase">
                  Premium Fragrance Decants
                </p>
                <p className="text-xs text-[#a8a29e]">Instagram: @decantsnibro</p>
                <div className="mt-4 flex justify-between font-sans text-xs text-[#78716c]">
                  <span>DATE: {new Date().toLocaleDateString()}</span>
                  <span>
                    TIME:{' '}
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {customerName && (
                  <div className="mt-2 text-left font-sans text-sm font-medium">
                    CUSTOMER: <span className="uppercase">{customerName}</span>
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="mb-6 space-y-4">
                <div className="flex justify-between border-b border-[#f5f5f4] pb-2 text-[10px] font-bold tracking-wider text-[#a8a29e] uppercase">
                  <span>Item</span>
                  <span>Amount</span>
                </div>

                {items.length === 0 ? (
                  <div className="py-8 text-center font-sans text-sm text-[#d6d3d1] italic">
                    No items added yet
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex items-start justify-between gap-3">
                      <div className="flex flex-1 gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded border border-[#f5f5f4] bg-[#fafaf9]">
                          {item.perfume.image_url ? (
                            <img
                              src={item.perfume.image_url}
                              alt={item.perfume.name}
                              className="h-full w-full object-cover"
                              crossOrigin="anonymous"
                            />
                          ) : item.isFree ? (
                            <span className="text-[8px] font-bold tracking-wide text-[#78716c]">
                              FREE
                            </span>
                          ) : (
                            <span className="text-[8px] text-[#d6d3d1]">No Img</span>
                          )}
                        </div>
                        <div className="leading-tight">
                          <div className="text-sm font-bold">{item.perfume.name}</div>
                          <div className="mt-0.5 font-sans text-xs text-[#78716c]">
                            {item.isFree
                              ? `Complimentary × ${item.qty}`
                              : `${item.size} × ${item.qty} @ ₱${item.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0 pt-0.5 text-sm font-bold">
                        {item.isFree
                          ? 'FREE'
                          : `₱${item.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Total */}
              <div className="mb-8 border-t-2 border-dashed border-[#e7e5e4] pt-4">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>TOTAL</span>
                  <span>₱{totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="mt-1 text-right font-sans text-xs text-[#a8a29e]">Tax Included</div>
              </div>

              {/* Footer */}
              <div className="space-y-1 text-center font-sans text-xs text-[#a8a29e]">
                <div className="flex items-center justify-center gap-12 py-4">
                  <div className="flex flex-col items-center">
                    <img
                      src="/cyjay-signature.svg"
                      alt="Cyjay Signature"
                      className="h-10 object-contain opacity-70 mix-blend-multiply"
                      crossOrigin="anonymous"
                    />
                    <div className="mt-1 mb-1 h-px w-16 bg-[#d6d3d1]"></div>
                    <span className="text-[9px] font-bold tracking-widest text-[#78716c] uppercase">
                      Cyjay
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <img
                      src="/jaaseia-signature.svg"
                      alt="Jaaseia Signature"
                      className="h-10 object-contain opacity-70 mix-blend-multiply"
                      crossOrigin="anonymous"
                    />
                    <div className="mt-1 mb-1 h-px w-16 bg-[#d6d3d1]"></div>
                    <span className="text-[9px] font-bold tracking-widest text-[#78716c] uppercase">
                      Jaaseia
                    </span>
                  </div>
                </div>
                <p className="pb-1 font-medium text-[#78716c]">
                  Thank you for choosing Decants ni Bro!
                </p>
                <p>We hope you enjoy your fragrances.</p>
                <div className="flex flex-col items-center gap-1 pt-6">
                  {/* Fake barcode */}
                  <div className="relative flex w-full justify-center bg-white px-2 py-1">
                    <div className="flex h-10 items-center justify-center gap-[1px]">
                      {[...Array(50)].map((_, i) => {
                        const isThick = (i * 7) % 5 === 0;
                        const isHidden = (i * 13) % 7 === 0;
                        return (
                          <div
                            key={i}
                            className="h-full bg-[#292524]"
                            style={{
                              width: isThick ? '2.5px' : '1.5px',
                              opacity: isHidden ? 0 : 1,
                            }}
                          ></div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="mt-1 font-mono text-[10px] tracking-[0.4em] text-[#a8a29e]">
                    DNB-{new Date().getFullYear()}
                    {new Date().getMonth() + 1}-
                    {(Math.abs(Math.sin(new Date().getTime())) * 1000000)
                      .toFixed(0)
                      .padStart(6, '0')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles for printing */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
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
      `,
        }}
      />
    </div>
  );
}
