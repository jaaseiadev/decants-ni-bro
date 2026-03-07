"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { StatusPill } from "@/components/ui/status-pill";

interface Perfume {
  id: string;
  name: string;
  brand: string;
  status: string;
  price_5ml: number;
  price_10ml: number;
  accords: string;
  image_url: string | null;
}

export default function AdminCatalogPage() {
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [accordFilter, setAccordFilter] = useState("ALL");

  useEffect(() => {
    fetchPerfumes();
  }, []);

  async function fetchPerfumes() {
    try {
      const res = await fetch("/api/perfumes");
      if (!res.ok) throw new Error("Failed to fetch perfumes");
      const data = await res.json();
      setPerfumes(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this perfume?")) return;
    
    try {
      const res = await fetch(`/api/perfumes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setPerfumes(perfumes.filter((p) => p.id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete perfume.");
    }
  }

  // Extract unique accords for the filter
  const allAccords = Array.from(
    new Set(
      perfumes.flatMap((p) => 
        p.accords ? p.accords.split(",").map((a) => a.trim()) : []
      )
    )
  ).filter(Boolean);

  const filteredPerfumes = perfumes.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.brand.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    const itemAccords = p.accords ? p.accords.split(",").map(a => a.trim()) : [];
    const matchesAccord = accordFilter === "ALL" || itemAccords.includes(accordFilter);
    
    return matchesSearch && matchesStatus && matchesAccord;
  });

  if (loading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center min-h-[50vh]">
        <div className="w-12 h-12 border-2 border-ds-charcoal border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="display-subtitle text-ds-black">Catalog</h1>
          <p className="body-text mt-2 text-ds-taupe">Manage your perfume inventory.</p>
        </div>
        <Link 
          href="/admin/perfume/new"
          className="inline-flex items-center gap-2 bg-ds-black text-white px-6 py-3 rounded-none hover:bg-ds-charcoal transition-colors font-sans text-xs uppercase tracking-widest font-bold"
        >
          <Plus className="w-4 h-4" />
          Add Perfume
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-end border-b border-gray-200 pb-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search perfumes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-0 border-b border-gray-300 pl-8 pr-4 py-2 focus:ring-0 focus:border-ds-black transition-colors font-sans"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent border-0 border-b border-gray-300 py-2 pl-0 pr-8 focus:ring-0 focus:border-ds-black text-sm font-sans uppercase tracking-wider text-ds-charcoal cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="active">Active</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="discontinued">Discontinued</option>
          </select>
          <select
            value={accordFilter}
            onChange={(e) => setAccordFilter(e.target.value)}
            className="bg-transparent border-0 border-b border-gray-300 py-2 pl-0 pr-8 focus:ring-0 focus:border-ds-black text-sm font-sans uppercase tracking-wider text-ds-charcoal cursor-pointer"
          >
            <option value="ALL">All Accords</option>
            {allAccords.map((accord) => (
              <option key={accord} value={accord}>{accord}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      {filteredPerfumes.length === 0 ? (
        <div className="text-center py-12 text-ds-taupe font-sans">
          No perfumes found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {filteredPerfumes.map((perfume) => (
            <div key={perfume.id} className="group relative flex flex-col overflow-hidden bg-white">
              <div className="overflow-hidden relative bg-gray-50 aspect-square">
                {perfume.image_url ? (
                  <img src={perfume.image_url} alt={perfume.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="absolute inset-0 bg-gray-200 transition-transform duration-700 group-hover:scale-105" />
                )}
                {perfume.status && (
                  <div className="absolute top-4 left-4 z-10">
                    <StatusPill status={perfume.status.toUpperCase() as "AVAILABLE" | "IN_TRANSIT" | "OUT_OF_STOCK"} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 z-20">
                  <Link 
                    href={`/admin/perfume/${perfume.id}/edit`}
                    className="p-3 bg-white text-ds-black rounded-full hover:scale-110 transition-transform"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <button 
                    onClick={() => handleDelete(perfume.id)}
                    className="p-3 bg-red-600 text-white rounded-full hover:scale-110 transition-transform"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="pt-4 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase">{perfume.brand}</p>
                    <h3 className="text-xl font-serif mt-1 text-gray-900">{perfume.name}</h3>
                  </div>
                </div>
                <div className="flex justify-between items-end mt-1">
                  <div className="text-left w-full">
                    <p className="text-sm text-gray-900 font-medium tracking-wide">
                      ₱{perfume.price_5ml} <span className="text-xs text-gray-500 font-normal">/ 5ml</span>
                    </p>
                    <p className="text-sm text-gray-900 font-medium tracking-wide mt-0.5">
                      ₱{perfume.price_10ml} <span className="text-xs text-gray-500 font-normal">/ 10ml</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}