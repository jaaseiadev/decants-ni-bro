import React from 'react';

export default function SalesPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h1 className="text-2xl font-serif mb-4">New Sale</h1>
        <p>Form goes here</p>
      </div>
      <div>
        <h2 className="text-xl font-serif mb-4">Recent Sales</h2>
        <p>Feed goes here</p>
      </div>
    </div>
  );
}