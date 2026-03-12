import { PublicLayout } from "@/components/layout/public-layout";
import { ReviewSection } from "@/components/catalog/ReviewSection";
import { StarRating } from "@/components/catalog/StarRating";
import { StatusPill } from "@/components/ui/status-pill";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export default async function PerfumeDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: perfumeData } = await supabase.from("perfume_catalog").select("*").eq("id", id).single();

  const perfume = perfumeData || {
    id,
    name: "Sample Fragrance",
    brand: "Niche House",
    status: "AVAILABLE",
    price_5ml: 1200,
    price_10ml: 2300,
    rating: 4.8,
    review_count: 12,
    top_notes: ["Bergamot", "Lemon"],
    middle_notes: ["Rose", "Jasmine"],
    base_notes: ["Vanilla", "Musk", "Patchouli"],
    accords: ["Citrus", "Floral", "Sweet"],
    when_to_wear: "Day / Spring",
    description: "A beautiful sample fragrance capturing the essence of spring mornings.",
  };

  const dummyReviews = [
    { id: "1", userInitials: "JL", rating: 5, comment: "Absolutely stunning projection and longevity.", date: "Oct 12, 2023" },
    { id: "2", userInitials: "MK", rating: 4, comment: "Great scent profile, slightly too sweet for me but very high quality.", date: "Sep 28, 2023" },
  ];

  return (
    <PublicLayout>
      {/* 60/40 Split using flex */}
      <div className="flex flex-col lg:flex-row min-h-screen bg-ds-ivory">
        {/* Left: 60% Hero Image */}
        <div className="lg:w-[60%] relative bg-gray-100 min-h-[50vh] lg:min-h-screen group overflow-hidden">
          <div className="absolute inset-0 bg-ds-greige/20 mix-blend-multiply transition-transform duration-1000 group-hover:scale-105" />
          <div className="absolute top-6 left-6 z-10 hidden lg:block">
             <StatusPill status={perfume.status as "in stock" | "in transit" | "out of stock" | "new"} />
          </div>
        </div>

        {/* Right: 40% Info Panel */}
        <div className="lg:w-[40%] px-6 py-12 lg:p-16 flex flex-col h-full lg:overflow-y-auto lg:h-screen sticky top-0">
          <div className="lg:hidden mb-4">
             <StatusPill status={perfume.status as "in stock" | "in transit" | "out of stock" | "new"} />
          </div>
          
          <p className="text-sm font-semibold tracking-widest text-ds-taupe uppercase mb-2">
            {perfume.brand}
          </p>
          <h1 className="text-4xl lg:text-5xl font-serif text-ds-black mb-4">
            {perfume.name}
          </h1>
          
          <div className="flex items-center gap-4 mb-8">
            <StarRating rating={perfume.rating || 5} count={perfume.review_count} />
          </div>

          <p className="body-text text-gray-700 mb-10 leading-relaxed">
            {perfume.description}
          </p>

          <div className="mb-10">
            <h3 className="text-xs uppercase tracking-widest text-ds-taupe mb-4 border-b border-ds-greige/30 pb-2">Scent Profile</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <span className="block text-xs font-semibold mb-1">TOP</span>
                <span className="text-sm text-gray-600">{(perfume.top_notes || ["Bergamot"]).join(", ")}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold mb-1">HEART</span>
                <span className="text-sm text-gray-600">{(perfume.middle_notes || ["Rose"]).join(", ")}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold mb-1">BASE</span>
                <span className="text-sm text-gray-600">{(perfume.base_notes || ["Vanilla"]).join(", ")}</span>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-xs uppercase tracking-widest text-ds-taupe mb-4 border-b border-ds-greige/30 pb-2">Details</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {(perfume.accords || ["Citrus"]).map((accord: string) => (
                <span key={accord} className="bg-ds-nude/30 px-3 py-1 text-xs rounded-full border border-ds-nude/50">
                  {accord}
                </span>
              ))}
            </div>
            <div className="text-sm">
              <span className="font-semibold mr-2">When to Wear:</span>
              <span className="text-gray-600">{perfume.when_to_wear || "Anytime"}</span>
            </div>
          </div>

          <div className="mt-auto pt-8 border-t border-ds-greige/30">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="block text-xs text-ds-taupe mb-1">5ML DECANT</span>
                <span className="text-2xl font-serif">₱{perfume.price_5ml || 1200}</span>
              </div>
              <div>
                <span className="block text-xs text-ds-taupe mb-1">10ML DECANT</span>
                <span className="text-2xl font-serif">₱{perfume.price_10ml || 2100}</span>
              </div>
            </div>
            
            <div className="flex gap-4">
              <a
                href={`https://wa.me/639123456789?text=${encodeURIComponent(`Hi! I'm interested in ordering a 5ml decant of ${perfume.brand} - ${perfume.name}.`)}`}
                className="flex-1 inline-flex items-center justify-center bg-transparent border border-ds-black text-ds-black px-4 py-3 uppercase tracking-widest text-xs hover:bg-ds-black hover:text-white transition-colors"
                aria-disabled={perfume.status === "OUT_OF_STOCK"}
              >
                Inquire 5ml
              </a>
              <a
                href={`https://wa.me/639123456789?text=${encodeURIComponent(`Hi! I'm interested in ordering a 10ml decant of ${perfume.brand} - ${perfume.name}.`)}`}
                className="flex-1 inline-flex items-center justify-center bg-ds-black text-white px-4 py-3 uppercase tracking-widest text-xs hover:bg-ds-black/80 transition-colors"
                aria-disabled={perfume.status === "OUT_OF_STOCK"}
              >
                Inquire 10ml
              </a>
            </div>
          </div>

          {/* Reviews Section */}
          <ReviewSection reviews={dummyReviews} />
        </div>
      </div>
    </PublicLayout>
  );
}
