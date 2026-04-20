"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PhotoUpload } from "./PhotoUpload";

interface PerfumeFormProps {
  initialData?: any;
}

export function PerfumeForm({ initialData }: PerfumeFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    brand: initialData?.brand || "",
    description: initialData?.description || "",
    status: initialData?.status || "in stock",
    price_5ml: initialData?.price_5ml || "",
    price_10ml: initialData?.price_10ml || "",
    image_url: initialData?.image_url || "",
    notes_top: initialData?.notes_top || "",
    notes_middle: initialData?.notes_middle || "",
    notes_base: initialData?.notes_base || "",
    when_to_wear: initialData?.when_to_wear || "",
  });

  // Accords tag list state
  const [accords, setAccords] = useState<string[]>(
    initialData?.accords ? initialData.accords.split(",").map((a: string) => a.trim()) : []
  );
  const [accordInput, setAccordInput] = useState("");

  const handleAddAccord = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = accordInput.trim();
      if (val && !accords.includes(val)) {
        setAccords([...accords, val]);
      }
      setAccordInput("");
    }
  };

  const removeAccord = (index: number) => {
    setAccords(accords.filter((_, i) => i !== index));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // @ts-ignore
    const checked = e.target.checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      ...formData,
      accords: accords.join(", "),
    };

    try {
      const url = initialData?.id ? `/api/perfumes/${initialData.id}` : "/api/perfumes";
      const method = initialData?.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save perfume.");
      }

      router.push("/admin/catalog");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-12">
      {/* Left Column: Photo Upload */}
      <div className="w-full lg:w-1/3">
        <div className="sticky top-8 space-y-2">
          <label className="font-sans text-xs uppercase tracking-widest font-bold text-ds-black">
            Perfume Photo
          </label>
          <PhotoUpload
            value={formData.image_url}
            onChange={(url) => setFormData((prev) => ({ ...prev, image_url: url }))}
            onError={(msg) => setError(msg)}
          />
        </div>
      </div>

      {/* Right Column: Form Fields */}
      <div className="w-full lg:w-2/3 space-y-8">
        {error && (
          <div className="bg-red-50 text-red-700 p-4 border border-red-200 font-sans text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <h2 className="font-serif text-2xl uppercase tracking-wider text-ds-black border-b border-gray-200 pb-2">
            General Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-widest font-bold text-ds-black">Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 bg-white px-4 py-2 font-sans focus:outline-none focus:border-ds-black transition-colors"
                placeholder="e.g. Baccarat Rouge 540"
              />
            </div>
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-widest font-bold text-ds-black">Brand *</label>
              <input
                type="text"
                name="brand"
                required
                value={formData.brand}
                onChange={handleChange}
                className="w-full border border-gray-300 bg-white px-4 py-2 font-sans focus:outline-none focus:border-ds-black transition-colors"
                placeholder="e.g. Maison Francis Kurkdjian"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-sans text-xs uppercase tracking-widest font-bold text-ds-black">Description</label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-white px-4 py-2 font-sans focus:outline-none focus:border-ds-black transition-colors resize-y"
              placeholder="Describe the fragrance..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-widest font-bold text-ds-black">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 bg-white px-4 py-2.5 font-sans focus:outline-none focus:border-ds-black transition-colors"
              >
                <option value="in stock">In Stock</option>
                <option value="out of stock">Out of Stock</option>
                <option value="new">New</option>
                <option value="in transit">In Transit</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-widest font-bold text-ds-black">When to wear</label>
              <input
                type="text"
                name="when_to_wear"
                value={formData.when_to_wear}
                onChange={handleChange}
                className="w-full border border-gray-300 bg-white px-4 py-2 font-sans focus:outline-none focus:border-ds-black transition-colors"
                placeholder="e.g. Date Night, Winter"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="font-serif text-2xl uppercase tracking-wider text-ds-black border-b border-gray-200 pb-2">
            Scent Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-widest font-bold text-ds-black">Top Notes</label>
              <input
                type="text"
                name="notes_top"
                value={formData.notes_top}
                onChange={handleChange}
                className="w-full border border-gray-300 bg-white px-4 py-2 font-sans text-sm focus:outline-none focus:border-ds-black transition-colors"
                placeholder="e.g. Bergamot, Lemon"
              />
            </div>
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-widest font-bold text-ds-black">Middle Notes</label>
              <input
                type="text"
                name="notes_middle"
                value={formData.notes_middle}
                onChange={handleChange}
                className="w-full border border-gray-300 bg-white px-4 py-2 font-sans text-sm focus:outline-none focus:border-ds-black transition-colors"
                placeholder="e.g. Jasmine, Rose"
              />
            </div>
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-widest font-bold text-ds-black">Base Notes</label>
              <input
                type="text"
                name="notes_base"
                value={formData.notes_base}
                onChange={handleChange}
                className="w-full border border-gray-300 bg-white px-4 py-2 font-sans text-sm focus:outline-none focus:border-ds-black transition-colors"
                placeholder="e.g. Vanilla, Musk"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-sans text-xs uppercase tracking-widest font-bold text-ds-black">Accords</label>
            <div className="border border-gray-300 bg-white p-2 min-h-[42px] flex flex-wrap gap-2 items-center focus-within:border-ds-black transition-colors">
              {accords.map((accord, idx) => (
                <span key={idx} className="bg-gray-100 text-xs px-2 py-1 flex items-center gap-1">
                  {accord}
                  <button
                    type="button"
                    onClick={() => removeAccord(idx)}
                    className="text-gray-400 hover:text-red-500 font-bold ml-1 leading-none"
                  >
                    &times;
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={accordInput}
                onChange={(e) => setAccordInput(e.target.value)}
                onKeyDown={handleAddAccord}
                placeholder="Type and press enter..."
                className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-sm min-w-[150px]"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="font-serif text-2xl uppercase tracking-wider text-ds-black border-b border-gray-200 pb-2">
            Pricing
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-widest font-bold text-ds-black">5ml Price *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₱</span>
                <input
                  type="number"
                  name="price_5ml"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price_5ml}
                  onChange={handleChange}
                  className="w-full border border-gray-300 bg-white pl-8 pr-4 py-2 font-sans focus:outline-none focus:border-ds-black transition-colors"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-widest font-bold text-ds-black">10ml Price *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₱</span>
                <input
                  type="number"
                  name="price_10ml"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price_10ml}
                  onChange={handleChange}
                  className="w-full border border-gray-300 bg-white pl-8 pr-4 py-2 font-sans focus:outline-none focus:border-ds-black transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto bg-ds-black text-white px-12 py-4 rounded-none hover:bg-ds-charcoal transition-colors font-sans text-xs uppercase tracking-widest font-bold disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {initialData ? "Save Changes" : "Create Perfume"}
          </button>
        </div>
      </div>
    </form>
  );
}