
import { PublicLayout } from "@/components/layout/public-layout";
import { PerfumeCard } from "@/components/catalog/PerfumeCard";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: perfumes } = await supabase.from("perfume_catalog").select("*");

  // Format data loosely if empty just to demo
  const catalog = perfumes && perfumes.length > 0 ? perfumes : [
    {
      id: "1",
      name: "Baccarat Rouge 540",
      brand: "Maison Francis Kurkdjian",
      imageUrl: "",
      accords: ["Woody", "Amber", "Warm Spicy"],
      status: "AVAILABLE",
      price_5ml: 1200,
      price_10ml: 2300,
      rating: 4.8,
      review_count: 24,
    },
    {
      id: "2",
      name: "Aventus",
      brand: "Creed",
      imageUrl: "",
      accords: ["Fruity", "Sweet", "Leather"],
      status: "IN_TRANSIT",
      price_5ml: 1100,
      price_10ml: 2100,
      rating: 4.9,
      review_count: 18,
    },
    {
      id: "3",
      name: "Lost Cherry",
      brand: "Tom Ford",
      imageUrl: "",
      accords: ["Cherry", "Sweet", "Almond"],
      status: "OUT_OF_STOCK",
      price_5ml: 1500,
      price_10ml: 2900,
      rating: 4.7,
      review_count: 31,
    }
  ];

  return (
    <PublicLayout>
      <section className="px-4 py-12 md:py-20 bg-ds-ivory">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
            <div>
              <h1 className="display-title mb-4">Catalog</h1>
              <p className="body-text text-ds-taupe max-w-md">
                Discover our curated collection of niche and designer fragrances, available in 5ml and 10ml decants.
              </p>
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
              <div className="w-full md:w-64">
                <Input type="text" placeholder="Search fragrances..." className="bg-transparent border-b border-ds-black rounded-none px-0 focus:ring-0" />
              </div>
              <select className="bg-transparent border-b border-ds-black py-2 pr-8 text-sm focus:outline-none">
                <option value="">All Accords</option>
                <option value="woody">Woody</option>
                <option value="floral">Floral</option>
                <option value="fresh">Fresh</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12 flex-wrap">
            {catalog.map((perfume: { id: string; name: string; brand: string; imageUrl: string; accords: string[]; status: string; price_5ml: number; price_10ml: number; rating: number; review_count: number }, index: number) => (
              <PerfumeCard
                key={perfume.id}
                id={perfume.id}
                name={perfume.name}
                brand={perfume.brand}
                imageUrl={perfume.imageUrl}
                accords={perfume.accords || ["Woody", "Floral", "Fresh"]}
                status={perfume.status}
                price5ml={perfume.price_5ml}
                price10ml={perfume.price_10ml}
                rating={perfume.rating || 5}
                reviewCount={perfume.review_count || 10}
                large={index % 5 === 0}
              />
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

