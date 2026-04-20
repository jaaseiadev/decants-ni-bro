'use client';

import React, { useState } from 'react';
import ReceiptGeneratorModal from './ReceiptGeneratorModal';

interface Perfume {
  id: string;
  name: string;
  image_url: string | null;
  price_5ml: number;
  price_10ml: number;
}

interface Props {
  perfumes: Perfume[];
}

export default function ReceiptGeneratorButton({ perfumes }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-ds-black px-4 py-2 border border-ds-greige rounded-md shadow-sm transition-colors text-sm font-medium whitespace-nowrap"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Receipt Generator
      </button>

      {isModalOpen && (
        <ReceiptGeneratorModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          perfumes={perfumes}
        />
      )}
    </>
  );
}
