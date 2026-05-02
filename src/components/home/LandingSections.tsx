"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { clsx } from "clsx";

gsap.registerPlugin(ScrollTrigger);

const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61584297385882";
const reveal = {
  initial: { y: 28, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true, amount: 0.35 },
  transition: { duration: 0.7, ease: "easeOut" as const },
};

type Perfume = {
  id: string;
  name: string;
  brand: string;
  image: string;
  category: string;
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

function scrollToSection(target: string) {
  if (target === "top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans text-[11px] font-bold uppercase leading-4 tracking-[0.16em] text-[#4c4546]">
      {children}
    </p>
  );
}

function isUnavailable(status: string) {
  const normalizedStatus = status.toLowerCase().replace(/[_-]/g, " ");
  return (
    normalizedStatus.includes("out of stock") ||
    normalizedStatus.includes("sold out") ||
    normalizedStatus.includes("discontinued")
  );
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed left-0 top-0 z-50 w-full border-b border-black/15 bg-[#fbf9f9] text-black transition-colors",
        isScrolled && "bg-white",
      )}
    >
      <div className="flex min-h-20 items-center px-5 md:px-10">
        <button
          type="button"
          onClick={() => scrollToSection("top")}
          className="font-serif text-3xl font-bold uppercase leading-none tracking-[-0.04em] md:text-4xl"
        >
          DecantSnibro
        </button>
      </div>
    </header>
  );
}

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-reveal]", {
        y: 42,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="top"
      ref={heroRef}
      className="grid min-h-[calc(100dvh-4rem)] grid-cols-1 border-b-2 border-black bg-[#fbf9f9] pt-16 lg:grid-cols-12"
    >
      <div className="flex flex-col justify-between border-b-2 border-black px-5 py-8 md:px-10 md:py-12 lg:col-span-7 lg:border-b-0 lg:border-r-2">
        <div data-reveal className="grid grid-cols-2 gap-4 md:grid-cols-7">
          <Kicker>Authentic decants / 5ml and 10ml</Kicker>
          <p className="col-span-2 hidden max-w-sm font-sans text-sm leading-6 text-[#4c4546] md:block">
            A precise catalog of niche and designer perfumes, decanted by hand
            for slower testing and sharper buying decisions.
          </p>
        </div>

        <div className="mt-20 md:mt-28">
          <motion.h1
            data-reveal
            {...reveal}
            className="max-w-[11ch] font-serif text-[clamp(4.75rem,14vw,11.5rem)] font-bold uppercase leading-[0.82] tracking-[-0.055em] text-black"
          >
            Wear the Invisible
          </motion.h1>
          <motion.div
            data-reveal
            {...reveal}
            transition={{ ...reveal.transition, delay: 0.08 }}
            className="mt-8 grid gap-6 border-t-2 border-black pt-6 md:grid-cols-7"
          >
            <p className="font-sans text-lg leading-7 text-black md:col-span-4">
              Small-format perfume access with editorial restraint: sharp labels,
              real stock, and direct ordering through message.
            </p>
            <a
              href="#catalog"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection("catalog");
              }}
              className="inline-flex h-14 items-center justify-between border-2 border-black bg-black px-5 font-sans text-xs font-bold uppercase tracking-[0.16em] text-white transition-transform hover:scale-[0.98] md:col-span-3"
            >
              Browse Collection
              <ArrowRight size={18} strokeWidth={1.75} />
            </a>
          </motion.div>
        </div>
      </div>

      <div className="relative min-h-[480px] overflow-hidden bg-black lg:col-span-5">
        <img
          src="/hero-bg.jpg"
          alt="Perfume bottle in high contrast monochrome light"
          className="h-full w-full object-cover grayscale"
        />
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute bottom-0 left-0 right-0 grid grid-cols-2 border-t-2 border-black bg-white">
          <div className="border-r-2 border-black p-5">
            <Kicker>Est. 2026</Kicker>
          </div>
          <div className="p-5">
            <Kicker>Ship Nationwide</Kicker>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Browse",
      desc: "Scan the catalog by mood, status, notes, and available sizes.",
    },
    {
      number: "02",
      title: "Message",
      desc: "Send the fragrance names and bottle sizes directly through Facebook.",
    },
    {
      number: "03",
      title: "Receive",
      desc: "Each decant is hand-filled, labeled, packed, and sent with care.",
    },
  ];

  return (
    <section id="about" className="border-b-2 border-black bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="border-b-2 border-black px-5 py-10 md:px-10 lg:col-span-3 lg:border-b-0 lg:border-r-2">
          <Kicker>Method</Kicker>
        </div>
        <div className="grid lg:col-span-9 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={clsx(
                "min-h-72 border-b-2 border-black p-5 md:p-10 lg:border-b-0",
                index !== steps.length - 1 && "lg:border-r-2",
              )}
            >
              <Kicker>{step.number}</Kicker>
              <h2 className="mt-16 font-serif text-5xl font-semibold uppercase leading-none tracking-[-0.04em]">
                {step.title}
              </h2>
              <p className="mt-5 max-w-sm font-sans text-sm leading-6 text-[#4c4546]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Catalog({ perfumes }: { perfumes: Perfume[] }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null);

  const filters = useMemo(() => {
    const categories = perfumes
      .map((perfume) => perfume.category)
      .filter(Boolean)
      .filter((value, index, array) => array.indexOf(value) === index);
    return ["All", "For Him", "For Her", "Unisex", ...categories.slice(0, 5)];
  }, [perfumes]);

  const filteredPerfumes =
    activeFilter === "All"
      ? perfumes
      : perfumes.filter(
          (perfume) =>
            perfume.category?.toLowerCase() === activeFilter.toLowerCase() ||
            perfume.gender?.toLowerCase() === activeFilter.toLowerCase(),
        );
  const selectedUnavailable = selectedPerfume ? isUnavailable(selectedPerfume.status) : false;

  return (
    <section id="catalog" className="bg-[#fbf9f9] px-5 py-14 md:px-10 lg:py-20">
      <div className="mx-auto max-w-7xl">
      <div className="mb-10 grid border-b border-black/20 pb-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Kicker>Current collection / {filteredPerfumes.length} fragrances</Kicker>
          <h2 className="mt-4 font-serif text-[clamp(3.25rem,8vw,6.75rem)] font-bold uppercase leading-[0.9] tracking-[-0.045em]">
            Current Stock
          </h2>
        </div>
        <div className="mt-8 flex items-end lg:col-span-4 lg:mt-0 lg:justify-end">
          <label className="w-full max-w-xs">
            <span className="mb-2 block font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#4c4546]">
              Filter
            </span>
            <select
              value={activeFilter}
              onChange={(event) => setActiveFilter(event.target.value)}
              className="h-12 w-full appearance-none border border-black/30 bg-white px-4 font-sans text-xs font-bold uppercase tracking-[0.14em] text-black outline-none transition-colors hover:border-black focus:border-black"
            >
              {filters.map((filter) => (
                <option key={filter} value={filter}>
                  {filter}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredPerfumes.map((perfume, index) => {
          const unavailable = isUnavailable(perfume.status);

          return (
            <motion.button
              key={perfume.id}
              type="button"
              onClick={() => setSelectedPerfume(perfume)}
              {...reveal}
              transition={{ ...reveal.transition, delay: Math.min(index * 0.04, 0.2) }}
              className="group flex h-[560px] flex-col border border-black/25 bg-white text-left transition-colors hover:border-black"
            >
              <div className="relative flex h-[340px] items-center justify-center overflow-hidden bg-[#efeded] p-6">
                {perfume.image ? (
                  <img
                    src={perfume.image}
                    alt={perfume.name}
                    loading="lazy"
                    className={clsx(
                      "h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]",
                      unavailable && "blur-[2px] grayscale opacity-45",
                    )}
                  />
                ) : (
                  <img
                    src="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80"
                    alt={perfume.name}
                    loading="lazy"
                    className={clsx(
                      "h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]",
                      unavailable && "blur-[2px] grayscale opacity-45",
                    )}
                  />
                )}
                {unavailable && (
                  <div className="absolute inset-0 grid place-items-center bg-white/45">
                    <span className="border border-black bg-white px-4 py-2 font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-black">
                      {perfume.status}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col border-t border-black/15 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="line-clamp-2 font-serif text-3xl font-semibold uppercase leading-none tracking-[-0.035em]">
                      {perfume.name}
                    </h3>
                    <p className="mt-2 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#4c4546]">
                      {perfume.brand}
                    </p>
                    <p className="mt-1 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-black/55">
                      {perfume.gender}
                    </p>
                  </div>
                  <span
                    className={clsx(
                      "shrink-0 border px-2 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.12em]",
                      unavailable
                        ? "border-black bg-black text-white"
                        : "border-black text-black",
                    )}
                  >
                    {perfume.status}
                  </span>
                </div>
                <p className="mt-5 line-clamp-2 font-sans text-sm leading-6 text-[#4c4546]">
                  {perfume.category}
                </p>
                <div
                  className={clsx(
                    "mt-auto flex justify-between border-t border-black/15 pt-4 font-sans text-xs font-bold uppercase tracking-[0.12em]",
                    unavailable && "text-black/45 line-through decoration-black/40",
                  )}
                >
                  <span>5ml / PHP {perfume.price5ml}</span>
                  <span>10ml / PHP {perfume.price10ml}</span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
      </div>

      {selectedPerfume && (
        <div
          className="fixed inset-0 z-[60] flex items-end bg-black/70 p-0 sm:items-center sm:justify-center sm:p-6"
          onClick={() => setSelectedPerfume(null)}
        >
          <div
            className="grid max-h-[92dvh] w-full max-w-5xl overflow-auto border-t-4 border-black bg-white sm:border-4 lg:grid-cols-2"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b-2 border-black bg-[#fbf9f9] p-8 lg:border-b-0 lg:border-r-2">
              <div className="flex items-center justify-between">
                <Kicker>Product details</Kicker>
                <button
                  type="button"
                  onClick={() => setSelectedPerfume(null)}
                  className="grid h-10 w-10 place-items-center border-2 border-black transition-colors hover:bg-black hover:text-white"
                  aria-label="Close product details"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="mt-10 flex min-h-[360px] items-center justify-center bg-[#efeded]">
                {selectedPerfume.image ? (
                  <img
                    src={selectedPerfume.image}
                    alt={selectedPerfume.name}
                    className={clsx(
                      "h-[360px] w-full object-cover",
                      selectedUnavailable && "blur-[2px] grayscale opacity-50",
                    )}
                  />
                ) : (
                  <img
                    src="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80"
                    alt={selectedPerfume.name}
                    className={clsx(
                      "h-[360px] w-full object-cover",
                      selectedUnavailable && "blur-[2px] grayscale opacity-50",
                    )}
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col p-8">
              <Kicker>{selectedPerfume.brand}</Kicker>
              <h3 className="mt-4 font-serif text-6xl font-bold uppercase leading-[0.88] tracking-[-0.05em]">
                {selectedPerfume.name}
              </h3>
                {selectedUnavailable && (
                  <span className="mt-5 w-fit border border-black bg-black px-3 py-2 font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-white">
                    {selectedPerfume.status}
                  </span>
                )}
              <span className="mt-5 w-fit border border-black/30 px-3 py-2 font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-black">
                {selectedPerfume.gender}
              </span>
              <p className="mt-8 font-sans text-sm leading-7 text-[#4c4546]">
                {selectedPerfume.description}
              </p>

              <div className="mt-10 grid gap-0 border-2 border-black">
                {[
                  ["Top", selectedPerfume.notes.top],
                  ["Mid", selectedPerfume.notes.mid],
                  ["Base", selectedPerfume.notes.base],
                ].map(([label, value], index) => (
                  <div
                    key={label}
                    className={clsx(
                      "grid grid-cols-[96px_1fr]",
                      index !== 2 && "border-b-2 border-black",
                    )}
                  >
                    <div className="border-r-2 border-black p-3">
                      <Kicker>{label}</Kicker>
                    </div>
                    <p className="p-3 font-sans text-sm leading-6">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-10">
                <div className="mb-4 flex justify-between border-y-2 border-black py-4 font-sans text-xs font-bold uppercase tracking-[0.12em]">
                  <span>5ml / PHP {selectedPerfume.price5ml}</span>
                  <span>10ml / PHP {selectedPerfume.price10ml}</span>
                </div>
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noreferrer"
                  className={clsx(
                    "flex h-14 items-center justify-between border-2 border-black px-5 font-sans text-xs font-bold uppercase tracking-[0.16em] transition-transform hover:scale-[0.98]",
                    selectedUnavailable
                      ? "bg-white text-black"
                      : "bg-black text-white",
                  )}
                >
                  {selectedUnavailable ? "Ask About Restock" : "Message to Order"}
                  <ArrowRight size={18} strokeWidth={1.75} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export function EditorialStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(imageRef.current, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="editorial"
      ref={sectionRef}
      className="grid min-h-[80vh] grid-cols-1 border-y-2 border-black bg-black text-white lg:grid-cols-12"
    >
      <div className="relative min-h-[420px] overflow-hidden lg:col-span-5">
        <img
          ref={imageRef}
          src="/hero-bg.jpg"
          alt="Decant bottle editorial crop"
          className="h-[115%] w-full object-cover grayscale"
        />
      </div>
      <div className="flex flex-col justify-between border-t-2 border-black p-5 md:p-10 lg:col-span-7 lg:border-l-2 lg:border-t-0">
        <Kicker>Editorial note</Kicker>
        <div className="mt-20">
          <motion.h2
            {...reveal}
            className="font-serif text-[clamp(3.25rem,8vw,8rem)] font-bold uppercase leading-[0.86] tracking-[-0.055em]"
          >
            Scent before commitment.
          </motion.h2>
          <div className="mt-10 grid gap-8 border-t-2 border-white pt-8 md:grid-cols-2">
            <p className="font-sans text-sm leading-7 text-[#f2f0f0]">
              We decant from authentic full bottles so you can wear a fragrance
              in real life before buying the full presentation.
            </p>
            <p className="font-sans text-sm leading-7 text-[#f2f0f0]">
              This is a small operation: direct messages, careful stock, clean
              labels, and no unnecessary theatre.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Reviews() {
  const reviews = [
    {
      id: 1,
      name: "Marcus T.",
      perfume: "Santal 33",
      quote: "Exactly as described. Fast shipping and the presentation is beautiful. Will order more next week.",
    },
    {
      id: 2,
      name: "Elaine R.",
      perfume: "Baccarat Rouge 540",
      quote: "The perfect way to test expensive fragrances before dropping full-bottle money. Excellent service.",
    },
    {
      id: 3,
      name: "Julian S.",
      perfume: "Aventus",
      quote: "Authentic juice. I compared it to my retail bottle and it was exact.",
    },
    {
      id: 4,
      name: "Nina M.",
      perfume: "Gypsy Water",
      quote: "Love the minimal bottles and labeling. Clean, direct, and reliable.",
    },
  ];

  return (
    <section id="reviews" className="overflow-hidden bg-[#fbf9f9] py-24 lg:py-36">
      <div className="px-5 md:px-10">
        <div className="mb-8 border-b-2 border-black pb-6">
          <Kicker>Client notes</Kicker>
          <h2 className="mt-4 font-serif text-[clamp(3rem,8vw,7rem)] font-bold uppercase leading-[0.86] tracking-[-0.05em]">
            Worn and verified
          </h2>
        </div>
      </div>

      <div className="flex w-max animate-marquee border-y-2 border-black">
        {[...reviews, ...reviews, ...reviews].map((review, index) => (
          <article
            key={`${review.id}-${index}`}
            className="flex h-80 w-[340px] shrink-0 flex-col justify-between border-r-2 border-black bg-white p-6 md:w-[420px]"
          >
            <p className="font-serif text-3xl font-semibold leading-none tracking-[-0.035em]">
              &quot;{review.quote}&quot;
            </p>
            <div className="font-sans text-[11px] font-bold uppercase leading-5 tracking-[0.14em] text-[#4c4546]">
              {review.name}
              <br />
              {review.perfume}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer id="order" className="border-t-4 border-black bg-white text-black">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="border-b-2 border-black p-5 md:p-10 lg:col-span-4 lg:border-b-0 lg:border-r-2">
          <h2 className="font-serif text-5xl font-bold uppercase leading-none tracking-[-0.05em]">
            DecantSnibro
          </h2>
        </div>
        <div className="grid border-b-2 border-black lg:col-span-5 lg:border-b-0 lg:border-r-2">
          {["Privacy", "Terms", "Shipping", "Contact"].map((item) => (
            <a
              key={item}
              href={item === "Contact" ? FACEBOOK_URL : "#top"}
              target={item === "Contact" ? "_blank" : undefined}
              rel={item === "Contact" ? "noreferrer" : undefined}
              className="border-b-2 border-black px-5 py-5 font-sans text-xs font-bold uppercase tracking-[0.16em] transition-colors last:border-b-0 hover:bg-black hover:text-white md:px-10"
            >
              {item}
            </a>
          ))}
        </div>
        <div className="flex flex-col justify-between gap-16 p-5 md:p-10 lg:col-span-3">
          <Kicker>Visayas State University / Mahaplag Leyte / Decants Only</Kicker>
          <p className="font-sans text-[11px] font-bold uppercase leading-5 tracking-[0.14em] text-[#4c4546]">
            All fragrances are decanted from authentic full bottles. Not
            affiliated with any brands.
          </p>
        </div>
      </div>
    </footer>
  );
}

export function NoiseOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[70] h-full w-full opacity-[0.025] mix-blend-multiply">
      <svg className="h-full w-full opacity-100">
        <filter id="noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </div>
  );
}
