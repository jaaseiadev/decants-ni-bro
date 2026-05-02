
import { createClient } from "@/lib/supabase/server";
import {
  Navbar,
  Catalog,
} from "@/components/home/LandingSections";

type PerfumeRow = {
  id: string;
  name: string;
  brand: string;
  image_url?: string | null;
  when_to_wear?: string | null;
  status?: string | null;
  price_5ml?: number | null;
  price_10ml?: number | null;
  description?: string | null;
  notes_top?: string | null;
  notes_middle?: string | null;
  notes_base?: string | null;
  stock_5ml?: number | null;
  stock_10ml?: number | null;
  gender?: string | null;
};

function formatPerfumeStatus(perfume: PerfumeRow) {
  const normalizedStatus = (perfume.status || "")
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .trim();

  if (
    normalizedStatus.includes("out of stock") ||
    normalizedStatus.includes("sold out") ||
    normalizedStatus.includes("discontinued")
  ) {
    return normalizedStatus.includes("discontinued") ? "Discontinued" : "Out of Stock";
  }

  if (perfume.stock_5ml === 0 && perfume.stock_10ml === 0) {
    return "Out of Stock";
  }

  if (normalizedStatus === "in transit") {
    return "In Transit";
  }

  if (normalizedStatus === "new") {
    return "New";
  }

  return "Available";
}

function formatPerfumeGender(gender?: string | null) {
  const normalizedGender = (gender || "unisex").toLowerCase().trim();

  if (normalizedGender === "male") {
    return "For Him";
  }

  if (normalizedGender === "female") {
    return "For Her";
  }

  return "Unisex";
}

export default async function Home() {
  const supabase = await createClient();
  const { data: perfumesData } = await supabase.from("perfumes").select("*");

  // Fallback data if DB is empty
  const catalog: PerfumeRow[] = perfumesData && perfumesData.length > 0 ? perfumesData : [
    {
      id: "1", name: "Baccarat Rouge 540", brand: "Maison Francis Kurkdjian", image_url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80", when_to_wear: "Versatile fragrance", status: "active", price_5ml: 1200, price_10ml: 2300, notes_top: "Saffron, Jasmine", notes_middle: "Amberwood, Ambergris", notes_base: "Fir Resin, Cedar"
    },
    {
      id: "2", name: "Aventus", brand: "Creed", image_url: "", when_to_wear: "Summer", status: "out_of_stock", price_5ml: 1100, price_10ml: 2100, notes_top: "Pineapple, Bergamot, Black Currant", notes_middle: "Birch, Patchouli", notes_base: "Musk, Oakmoss"
    }
  ];

  // Map DB schema exactly to what the Figma Catalog expects
  const formattedPerfumes = catalog.map((p) => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    image: p.image_url || "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80",
    category: p.when_to_wear || "Versatile fragrance",
    gender: formatPerfumeGender(p.gender),
    status: formatPerfumeStatus(p),
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
    <div className="relative min-h-screen overflow-hidden bg-[#fbf9f9]">
      <Navbar />
      <main className="pt-20">
        <Catalog perfumes={formattedPerfumes} />
      </main>
    </div>
  );
}

