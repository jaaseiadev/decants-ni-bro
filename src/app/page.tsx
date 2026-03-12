
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
  const { data: perfumesData } = await supabase.from("perfumes").select("*");

  // Fallback data if DB is empty
  const catalog = perfumesData && perfumesData.length > 0 ? perfumesData : [
    {
      id: "1", name: "Baccarat Rouge 540", brand: "Maison Francis Kurkdjian", image_url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80", when_to_wear: "Versatile fragrance", status: "active", price_5ml: 1200, price_10ml: 2300, notes_top: "Saffron, Jasmine", notes_middle: "Amberwood, Ambergris", notes_base: "Fir Resin, Cedar"
    },
    {
      id: "2", name: "Aventus", brand: "Creed", image_url: "", when_to_wear: "Summer", status: "out_of_stock", price_5ml: 1100, price_10ml: 2100, notes_top: "Pineapple, Bergamot, Black Currant", notes_middle: "Birch, Patchouli", notes_base: "Musk, Oakmoss"
    }
  ];

  // Map DB schema exactly to what the Figma Catalog expects
  const formattedPerfumes = catalog.map((p: any) => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    image: p.image_url || "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80",
    category: p.when_to_wear || "Versatile fragrance",
    status: p.status === "out_of_stock" ? "Out of Stock" : p.status === "discontinued" ? "Discontinued" : "Available",
    price5ml: p.price_5ml || 1200,
    price10ml: p.price_10ml || 2100,
    description: p.description || "A highly sought-after fragrance, hand-decanted from the original bottle.",
    notes: {
      top: p.notes_top || "Bergamot",
      mid: p.notes_middle || "Rose, Jasmine",
      base: p.notes_base || "Musk, Vanilla",
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

