
import { createClient } from "@/lib/supabase/server";
import {
  Navbar,
  NoiseOverlay,
  Hero,
  HowItWorks,
  EditorialStrip,
  Reviews,
  Footer,
  Catalog,
} from "@/components/home/LandingSections";

export default async function Home() {
  const supabase = await createClient();
  const { data: perfumesData } = await supabase.from("perfume_catalog").select("*");

  // Fallback data if DB is empty
  const catalog = perfumesData && perfumesData.length > 0 ? perfumesData : [
    {
      id: "1", name: "Baccarat Rouge 540", brand: "Maison Francis Kurkdjian", imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80", accords: ["Oriental"], status: "AVAILABLE", price_5ml: 1200, price_10ml: 2300, top_notes: ["Saffron", "Jasmine"], middle_notes: ["Amberwood", "Ambergris"], base_notes: ["Fir Resin", "Cedar"]
    },
    {
      id: "2", name: "Aventus", brand: "Creed", imageUrl: "", accords: ["Fresh"], status: "IN_TRANSIT", price_5ml: 1100, price_10ml: 2100, top_notes: ["Pineapple", "Bergamot", "Black Currant"], middle_notes: ["Birch", "Patchouli"], base_notes: ["Musk", "Oakmoss"]
    }
  ];

  // Map DB schema exactly to what the Figma Catalog expects
  const formattedPerfumes = catalog.map((p: any) => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    image: p.imageUrl || "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80",
    category: p.accords && p.accords.length > 0 ? p.accords[0] : "All",
    status: p.status === "OUT_OF_STOCK" ? "Out of Stock" : p.status === "IN_TRANSIT" ? "In Transit" : "Available",
    price5ml: p.price_5ml || 1200,
    price10ml: p.price_10ml || 2100,
    description: p.description || "A highly sought-after fragrance, hand-decanted from the original bottle.",
    notes: {
      top: Array.isArray(p.top_notes) ? p.top_notes.join(", ") : "Bergamot",
      mid: Array.isArray(p.middle_notes) ? p.middle_notes.join(", ") : "Rose, Jasmine",
      base: Array.isArray(p.base_notes) ? p.base_notes.join(", ") : "Musk, Vanilla",
    }
  }));

  return (
    <div className="relative overflow-hidden bg-[#F5F5F3]">
      <NoiseOverlay />
      <Navbar />
      <main>
        <div id="top"></div>
        <Hero />
        <HowItWorks />
        <Catalog perfumes={formattedPerfumes} />
        <EditorialStrip />
        <Reviews />
      </main>
      <Footer />
    </div>
  );
}

