'use client';

import { useMemo, useState } from 'react';
import { Crown, Droplets, PhilippinePeso, Trophy } from 'lucide-react';

export interface RankedPerfume {
  id: string;
  name: string;
  brand: string | null;
  imageUrl: string | null;
  ml: number;
  totalRev: number;
  orders: number;
}

interface AllTimePerfumeRankingProps {
  perfumes: RankedPerfume[];
  totalRevenue: number;
  totalMlSold: number;
}

type RankingMetric = 'revenue' | 'ml';

const currency = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  maximumFractionDigits: 0,
});

function PerfumeImage({ perfume, className }: { perfume: RankedPerfume; className: string }) {
  if (perfume.imageUrl) {
    return (
      <img
        src={perfume.imageUrl}
        alt={perfume.name}
        className={`${className} object-cover`}
        crossOrigin="anonymous"
      />
    );
  }

  return (
    <div
      className={`${className} bg-ds-nude text-ds-taupe flex items-center justify-center font-serif text-3xl`}
      aria-hidden="true"
    >
      {perfume.name.charAt(0).toUpperCase()}
    </div>
  );
}

export default function AllTimePerfumeRanking({
  perfumes,
  totalRevenue,
  totalMlSold,
}: AllTimePerfumeRankingProps) {
  const [metric, setMetric] = useState<RankingMetric>('revenue');
  const ranked = useMemo(
    () =>
      [...perfumes].sort((a, b) =>
        metric === 'revenue'
          ? b.totalRev - a.totalRev || b.ml - a.ml || a.name.localeCompare(b.name)
          : b.ml - a.ml || b.totalRev - a.totalRev || a.name.localeCompare(b.name)
      ),
    [metric, perfumes]
  );
  const leaders = ranked.slice(0, 3);
  const maximum = Math.max(
    1,
    ...ranked.map((perfume) => (metric === 'revenue' ? perfume.totalRev : perfume.ml))
  );

  return (
    <section className="space-y-8">
      <div className="border-ds-black bg-ds-black overflow-hidden border text-white">
        <div className="grid gap-px bg-white/20 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="bg-ds-black p-6 md:p-8">
            <div className="text-ds-greige mb-8 flex items-center gap-2">
              <Trophy size={18} />
              <span className="text-[10px] font-bold tracking-[0.24em] uppercase">
                Lifetime performance
              </span>
            </div>
            <h2 className="max-w-xl font-serif text-4xl leading-none md:text-6xl">
              Every bottle has a story. These are your bestsellers.
            </h2>
          </div>
          <div className="bg-ds-black flex flex-col justify-end p-6 md:p-8">
            <PhilippinePeso className="text-ds-greige mb-5" size={22} />
            <p className="font-serif text-4xl md:text-5xl">{currency.format(totalRevenue)}</p>
            <p className="text-ds-greige mt-2 text-[10px] tracking-[0.2em] uppercase">
              All-time sales
            </p>
          </div>
          <div className="bg-ds-black flex flex-col justify-end p-6 md:p-8">
            <Droplets className="text-ds-greige mb-5" size={22} />
            <p className="font-serif text-4xl md:text-5xl">{totalMlSold.toLocaleString()} ml</p>
            <p className="text-ds-greige mt-2 text-[10px] tracking-[0.2em] uppercase">
              Fragrance sold
            </p>
          </div>
        </div>
      </div>

      <div className="border-ds-greige flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-ds-taupe text-[10px] font-bold tracking-[0.22em] uppercase">
            The podium
          </p>
          <h3 className="mt-2 font-serif text-3xl">Top performers</h3>
        </div>
        <div className="border-ds-black flex border bg-white p-1">
          <button
            type="button"
            onClick={() => setMetric('revenue')}
            className={`px-4 py-2 text-[10px] font-bold tracking-[0.16em] uppercase ${
              metric === 'revenue' ? 'bg-ds-black text-white' : 'text-ds-taupe'
            }`}
          >
            Pesos sold
          </button>
          <button
            type="button"
            onClick={() => setMetric('ml')}
            className={`px-4 py-2 text-[10px] font-bold tracking-[0.16em] uppercase ${
              metric === 'ml' ? 'bg-ds-black text-white' : 'text-ds-taupe'
            }`}
          >
            ML sold
          </button>
        </div>
      </div>

      {ranked.length === 0 ? (
        <div className="border-ds-greige text-ds-taupe border border-dashed py-16 text-center text-sm">
          Upload perfumes to begin building the leaderboard.
        </div>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-3">
            {leaders.map((perfume, index) => (
              <article
                key={perfume.id}
                className={`group relative overflow-hidden border bg-white ${
                  index === 0 ? 'border-ds-black lg:-translate-y-2' : 'border-ds-greige'
                }`}
              >
                <div className="bg-ds-nude relative aspect-[4/3] overflow-hidden">
                  <PerfumeImage
                    perfume={perfume}
                    className="h-full w-full transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
                    <span className="bg-ds-black flex h-11 w-11 items-center justify-center font-serif text-xl text-white">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {index === 0 && (
                      <span className="flex items-center gap-2 bg-white px-3 py-2 text-[10px] font-bold tracking-widest uppercase">
                        <Crown size={14} /> Leader
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-ds-taupe text-[10px] font-bold tracking-[0.2em] uppercase">
                    {perfume.brand || 'Decants ni Bro'}
                  </p>
                  <h4 className="mt-2 font-serif text-2xl">{perfume.name}</h4>
                  <div className="border-ds-greige mt-5 grid grid-cols-2 border-t pt-4">
                    <div>
                      <p className="text-lg font-semibold">{currency.format(perfume.totalRev)}</p>
                      <p className="text-ds-taupe mt-1 text-[9px] tracking-widest uppercase">
                        Pesos sold
                      </p>
                    </div>
                    <div className="border-ds-greige border-l pl-4">
                      <p className="text-lg font-semibold">{perfume.ml.toLocaleString()} ml</p>
                      <p className="text-ds-taupe mt-1 text-[9px] tracking-widest uppercase">
                        Volume sold
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="border-ds-greige border bg-white">
            <div className="border-ds-greige flex items-end justify-between border-b p-5 md:p-6">
              <div>
                <p className="text-ds-taupe text-[10px] font-bold tracking-[0.2em] uppercase">
                  Complete ranking
                </p>
                <h3 className="mt-2 font-serif text-2xl">All uploaded perfumes</h3>
              </div>
              <span className="text-ds-taupe text-xs">{ranked.length} fragrances</span>
            </div>
            <div className="divide-ds-greige divide-y">
              {ranked.map((perfume, index) => {
                const value = metric === 'revenue' ? perfume.totalRev : perfume.ml;
                const progress = (value / maximum) * 100;

                return (
                  <div
                    key={perfume.id}
                    className="hover:bg-ds-ivory grid grid-cols-[2.5rem_3.25rem_1fr] items-center gap-3 p-4 transition-colors sm:grid-cols-[3rem_4rem_1fr_auto] sm:gap-5 md:px-6"
                  >
                    <span className="text-ds-taupe font-serif text-2xl">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <PerfumeImage perfume={perfume} className="h-13 w-13 sm:h-16 sm:w-16" />
                    <div className="min-w-0">
                      <p className="truncate font-serif text-lg">{perfume.name}</p>
                      <p className="text-ds-taupe mt-1 truncate text-[9px] font-bold tracking-[0.18em] uppercase">
                        {perfume.brand || 'No brand'} · {perfume.orders.toLocaleString()} bottles
                        sold
                      </p>
                      <div className="bg-ds-nude mt-3 h-1 w-full">
                        <div
                          className="bg-ds-black h-full transition-[width] duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="border-ds-nude col-span-3 grid grid-cols-2 gap-4 border-t pt-3 text-right sm:col-span-1 sm:flex sm:min-w-64 sm:border-0 sm:pt-0">
                      <div className="sm:w-32">
                        <p className="font-semibold">{currency.format(perfume.totalRev)}</p>
                        <p className="text-ds-taupe text-[9px] tracking-widest uppercase">Pesos</p>
                      </div>
                      <div className="sm:w-28">
                        <p className="font-semibold">{perfume.ml.toLocaleString()} ml</p>
                        <p className="text-ds-taupe text-[9px] tracking-widest uppercase">Sold</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
