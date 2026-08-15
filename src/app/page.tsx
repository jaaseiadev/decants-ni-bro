import { createClient } from '@/lib/supabase/server';
import { Navbar, Catalog, Footer } from '@/components/home/LandingSections';

type PerfumeRow = {
  id: string;
  name: string;
  brand: string;
  image_url?: string | null;
  accords?: string | null;
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
  const normalizedStatus = (perfume.status || '').toLowerCase().replace(/[_-]/g, ' ').trim();

  if (
    normalizedStatus.includes('out of stock') ||
    normalizedStatus.includes('sold out') ||
    normalizedStatus.includes('discontinued')
  ) {
    return normalizedStatus.includes('discontinued') ? 'Discontinued' : 'Out of Stock';
  }

  if (perfume.stock_5ml === 0 && perfume.stock_10ml === 0) {
    return 'Out of Stock';
  }

  if (normalizedStatus === 'in transit') {
    return 'In Transit';
  }

  if (normalizedStatus === 'new') {
    return 'New';
  }

  return 'Available';
}

function formatPerfumeGender(gender?: string | null) {
  const normalizedGender = (gender || 'unisex').toLowerCase().trim();

  if (normalizedGender === 'male') {
    return 'For Him';
  }

  if (normalizedGender === 'female') {
    return 'For Her';
  }

  return 'Unisex';
}

export default async function Home() {
  const supabase = await createClient();
  const { data: perfumesData } = await supabase.from('perfumes').select('*');

  const catalog: PerfumeRow[] = perfumesData || [];

  // Keep the database contract separate from the visual catalog model.
  const formattedPerfumes = catalog.map((p) => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    image: p.image_url || null,
    accords: p.accords
      ? p.accords
          .split(',')
          .map((accord) => accord.trim())
          .filter(Boolean)
      : [],
    gender: formatPerfumeGender(p.gender),
    status: formatPerfumeStatus(p),
    price5ml: p.price_5ml ?? 0,
    price10ml: p.price_10ml ?? 0,
    description: p.description || '',
    notes: {
      top: p.notes_top || '—',
      mid: p.notes_middle || '—',
      base: p.notes_base || '—',
    },
  }));

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#111111]">
      <Navbar />
      <main className="pt-16 sm:pt-20">
        <Catalog perfumes={formattedPerfumes} />
      </main>
      <Footer />
    </div>
  );
}
