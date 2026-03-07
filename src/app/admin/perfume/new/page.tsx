import { PerfumeForm } from "@/components/admin/PerfumeForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewPerfumePage() {
  return (
    <div className="max-w-6xl mx-auto pb-12">
      <Link 
        href="/admin/catalog"
        className="inline-flex items-center gap-2 text-ds-taupe hover:text-ds-black transition-colors font-sans text-xs uppercase tracking-widest font-bold mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Catalog
      </Link>
      
      <div className="mb-10">
        <h1 className="display-subtitle text-ds-black">Add New Perfume</h1>
        <p className="body-text mt-2 text-ds-taupe">Fill out the details to add a new fragrance to your catalog.</p>
      </div>

      <PerfumeForm />
    </div>
  );
}