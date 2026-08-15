'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, ChevronDown, X } from 'lucide-react';
import { clsx } from 'clsx';

const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61584297385882';

type Perfume = {
  id: string;
  name: string;
  brand: string;
  image: string | null;
  accords: string[];
  gender: string;
  status: string;
  price5ml: number;
  price10ml: number;
  description: string;
  notes: {
    top: string;
    mid: string;
    base: string;
  };
};

function isUnavailable(status: string) {
  const normalizedStatus = status.toLowerCase().replace(/[_-]/g, ' ');
  return (
    normalizedStatus.includes('out of stock') ||
    normalizedStatus.includes('sold out') ||
    normalizedStatus.includes('discontinued')
  );
}

function getAvailabilityRank(status: string) {
  const normalizedStatus = status.toLowerCase().replace(/[_-]/g, ' ').trim();

  if (normalizedStatus === 'available' || normalizedStatus === 'in stock') return 0;
  if (isUnavailable(status)) return 2;
  return 1;
}

function formatPrice(price: number) {
  return `₱${Number(price).toLocaleString('en-PH', {
    maximumFractionDigits: 2,
  })}`;
}

function getPerfumeTags(perfume: Perfume) {
  return [...new Set(perfume.accords.filter(Boolean))];
}

export function Navbar() {
  return (
      <header
        id="top"
        className="landing-hero relative isolate flex min-h-[clamp(360px,64vw,720px)] w-full items-start justify-center overflow-hidden border-b border-[#8e887f]/60 px-5 pt-24 pb-10 text-center sm:min-h-[clamp(460px,54vw,720px)] sm:px-8 sm:pt-32 sm:pb-14"
        style={{
          backgroundImage: "url('/bg.png')",
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
      <div aria-hidden="true" className="landing-hero-wash absolute inset-0 -z-10" />

      <div className="mx-auto flex w-full max-w-[680px] flex-col items-center">
        <p className="text-[10px] font-semibold tracking-[0.3em] text-[#3f3a34] uppercase sm:text-xs">
          Decants Ni Bro
        </p>
        <p className="mt-6 font-serif text-[clamp(2.35rem,6vw,5.5rem)] leading-[0.9] font-semibold tracking-[-0.045em] text-[#1d1a17]">
          Find the scent that stays with you.
        </p>
        <p className="mt-6 max-w-[420px] text-[11px] leading-5 text-[#514b44] sm:text-sm sm:leading-6">
          Original fragrances, thoughtfully decanted in 5ml and 10ml.
        </p>

        <a
          href="#catalog"
          className="group mt-8 inline-flex items-center gap-2 border-b border-[#39342f] pb-1.5 text-[9px] font-semibold tracking-[0.2em] text-[#302c28] uppercase transition-opacity duration-200 hover:opacity-55 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-black sm:mt-10 sm:text-[10px]"
          aria-label="Explore the perfume collection"
        >
          Explore the collection
          <ChevronDown
            aria-hidden="true"
            size={13}
            strokeWidth={1.5}
            className="transition-transform duration-200 group-hover:translate-y-0.5"
          />
        </a>
      </div>
    </header>
  );
}

function ProductCard({ perfume, onSelect }: { perfume: Perfume; onSelect: () => void }) {
  const unavailable = isUnavailable(perfume.status);

  return (
    <article className="group min-w-0">
      <button
        type="button"
        onClick={onSelect}
        className="block w-full text-left focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-black"
        aria-label={`View details for ${perfume.name}`}
      >
        <div className="relative aspect-[4/5] border border-[#d8d5cf] bg-[#f1f0ed] p-2 sm:p-2.5">
          {perfume.image && (
            <img
              src={perfume.image}
              alt={perfume.name}
              loading="lazy"
              className={clsx(
                'h-full w-full object-contain transition duration-200 ease-out group-hover:scale-[1.02]',
                unavailable && 'opacity-45 grayscale'
              )}
            />
          )}
        </div>

        <div className="pt-2">
          <h3 className="line-clamp-1 text-[11px] leading-4 font-medium tracking-[-0.02em] text-[#111111] transition-opacity duration-200 group-hover:opacity-65 sm:text-xs">
            {perfume.name}
          </h3>
          <p className="line-clamp-1 text-[8px] leading-3.5 text-[#716e69] sm:text-[9px]">
            {perfume.brand}
          </p>

          <p className="mt-1 flex items-center gap-1.5 text-[8px] leading-3.5 text-[#575450] sm:text-[9px] sm:leading-4">
            <span>{perfume.gender}</span>
            <span aria-hidden="true" className="text-[#b1ada7]">
              ·
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className={clsx(
                  'h-1 w-1 rounded-full',
                  unavailable ? 'bg-[#a7a29b]' : 'bg-[#252525]'
                )}
              />
              {perfume.status}
            </span>
          </p>

          <dl className="mt-1.5 border-t border-[#dedbd6] pt-1 text-[8px] leading-3.5 text-[#34322f] sm:text-[9px] sm:leading-4">
            <div className="flex items-center justify-between gap-1 sm:gap-4">
              <dt className="text-[#85817b]">5ml</dt>
              <dd>{formatPrice(perfume.price5ml)}</dd>
            </div>
            <div className="flex items-center justify-between gap-1 sm:gap-4">
              <dt className="text-[#85817b]">10ml</dt>
              <dd>{formatPrice(perfume.price10ml)}</dd>
            </div>
          </dl>
        </div>
      </button>
    </article>
  );
}

function ProductDialog({ perfume, onClose }: { perfume: Perfume; onClose: () => void }) {
  const unavailable = isUnavailable(perfume.status);
  const tags = getPerfumeTags(perfume);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-6"
      onMouseDown={onClose}
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
        className="max-h-[92dvh] w-full max-w-[780px] overflow-y-auto bg-[#fbfaf7] p-5 sm:p-8"
      >
        <div className="flex items-center justify-between border-b border-[#d8d5cf] pb-4">
          <p className="text-[10px] font-medium tracking-[0.18em] text-[#77736f] uppercase">
            Product details
          </p>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center text-[#111111] transition-opacity hover:opacity-50 focus-visible:outline focus-visible:outline-1 focus-visible:outline-black"
            aria-label="Close product details"
          >
            <X size={17} strokeWidth={1.5} />
          </button>
        </div>

        <div className="grid gap-8 pt-7 sm:grid-cols-[0.9fr_1.1fr] sm:gap-10">
          <div className="aspect-[4/5] border border-[#d8d5cf] bg-[#f1f0ed] p-5 sm:p-6">
            {perfume.image && (
              <img
                src={perfume.image}
                alt={perfume.name}
                className={clsx(
                  'h-full w-full object-contain',
                  unavailable && 'opacity-45 grayscale'
                )}
              />
            )}
          </div>

          <div className="flex flex-col">
            <p className="text-[9px] tracking-[0.13em] text-[#77736f] uppercase sm:text-[10px]">
              {perfume.brand}
            </p>
            <h2
              id="product-dialog-title"
              className="mt-2 text-2xl leading-[1.08] font-medium tracking-[-0.035em] text-[#111111] sm:text-[28px]"
            >
              {perfume.name}
            </h2>
            <p className="mt-3 text-[10px] text-[#5e5a55] sm:text-[11px]">
              {perfume.gender} <span className="mx-1.5 text-[#aaa59e]">·</span> {perfume.status}
            </p>

            {perfume.description && (
              <p className="mt-5 text-[11px] leading-5 text-[#6e6a65] sm:text-xs">
                {perfume.description}
              </p>
            )}

            {tags.length > 0 && (
              <p className="mt-4 text-[9px] leading-4 text-[#8a8782] sm:text-[10px]">
                {tags.join(' / ')}
              </p>
            )}

            <dl className="mt-5 border-y border-[#d8d5cf] py-3 text-[10px] leading-4 sm:text-[11px]">
              {(['top', 'mid', 'base'] as const).map((note) => (
                <div key={note} className="grid grid-cols-[52px_1fr] gap-4 py-1.5">
                  <dt className="text-[#8a8782] capitalize">{note === 'mid' ? 'Heart' : note}</dt>
                  <dd className="text-[#4a4743]">{perfume.notes[note]}</dd>
                </div>
              ))}
            </dl>

            <dl className="mt-4 text-[11px] leading-5 text-[#34322f] sm:text-xs">
              <div className="flex justify-between">
                <dt className="text-[#85817b]">5ml</dt>
                <dd>{formatPrice(perfume.price5ml)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#85817b]">10ml</dt>
                <dd>{formatPrice(perfume.price10ml)}</dd>
              </div>
            </dl>

            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex h-11 items-center justify-between border border-[#191919] px-4 text-[10px] font-medium tracking-[0.16em] text-[#111111] uppercase transition-colors duration-200 hover:bg-[#111111] hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              {unavailable ? 'Ask about restock' : 'Message to order'}
              <ArrowUpRight size={15} strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export function Catalog({ perfumes }: { perfumes: Perfume[] }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null);

  const filters = useMemo(() => {
    const values = perfumes.flatMap((perfume) => [perfume.gender, ...getPerfumeTags(perfume)]);

    return [
      'All',
      ...values.filter(
        (value, index, array) =>
          value && array.findIndex((item) => item.toLowerCase() === value.toLowerCase()) === index
      ),
    ];
  }, [perfumes]);

  const filteredPerfumes = useMemo(() => {
    if (activeFilter === 'All') return perfumes;
    const normalizedFilter = activeFilter.toLowerCase();

    return perfumes.filter(
      (perfume) =>
        perfume.gender.toLowerCase() === normalizedFilter ||
        getPerfumeTags(perfume).some((tag) => tag.toLowerCase() === normalizedFilter)
    );
  }, [activeFilter, perfumes]);

  const displayedPerfumes = useMemo(
    () =>
      [...filteredPerfumes].sort(
        (first, second) => getAvailabilityRank(first.status) - getAvailabilityRank(second.status)
      ),
    [filteredPerfumes]
  );

  return (
    <>
      <section id="catalog" className="mx-auto w-full max-w-[780px] px-4 pb-24 sm:px-6 sm:pb-32">
        <div className="border-b border-[#cfcac3] pb-5">
          <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-medium tracking-[0.17em] text-[#716d67] uppercase">
                Current collection
              </p>
              <p className="mt-2 text-sm tracking-[-0.01em] text-[#262522]">
                {activeFilter === 'All'
                  ? `${perfumes.length} fragrances available to explore.`
                  : `${filteredPerfumes.length} of ${perfumes.length} fragrances.`}
              </p>
            </div>

            <label className="relative w-full sm:w-auto sm:shrink-0">
              <span className="sr-only">Filter fragrances</span>
              <select
                value={activeFilter}
                onChange={(event) => setActiveFilter(event.target.value)}
                className="h-9 w-full appearance-none border-0 border-b border-[#8f8a83] bg-transparent py-1 pr-6 pl-0 text-left text-[11px] text-[#34322f] transition-colors outline-none hover:border-black focus:border-black sm:w-auto sm:max-w-[210px] sm:text-right"
              >
                {filters.map((filter) => (
                  <option key={filter} value={filter}>
                    {filter === 'All' ? 'Filter · All' : filter}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                size={13}
                strokeWidth={1.5}
                className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 text-[#6f6b65]"
              />
            </label>
          </div>
        </div>

        {filteredPerfumes.length > 0 ? (
          <div className="catalog-enter grid grid-cols-5 gap-x-2 gap-y-6 pt-6 sm:gap-x-4 sm:gap-y-8 sm:pt-8">
            {displayedPerfumes.map((perfume) => (
              <ProductCard
                key={perfume.id}
                perfume={perfume}
                onSelect={() => setSelectedPerfume(perfume)}
              />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center text-sm text-[#77736f]">
            No fragrances match this filter.
          </div>
        )}
      </section>

      {selectedPerfume && (
        <ProductDialog perfume={selectedPerfume} onClose={() => setSelectedPerfume(null)} />
      )}
    </>
  );
}

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-[780px] px-4 pb-10 sm:px-6 sm:pb-12">
      <div className="flex flex-col gap-8 border-t border-[#cfcac3] pt-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium tracking-[0.18em] text-[#1b1a18] uppercase">
            Decants Ni Bro
          </p>
          <p className="mt-2 text-xs text-[#7b7771]">Premium fragrance decants.</p>
        </div>
        <div className="text-left text-[11px] leading-5 text-[#77736f] sm:text-right">
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-[#aaa59e] underline-offset-4 transition-colors hover:text-black"
          >
            Facebook
          </a>
          <p className="mt-2">© 2026 Decants Ni Bro</p>
        </div>
      </div>
    </footer>
  );
}
