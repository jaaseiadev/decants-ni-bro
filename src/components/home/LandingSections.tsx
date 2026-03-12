"use client";

import { useState, useEffect, useRef } from "react";
import { X, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { clsx } from "clsx";

gsap.registerPlugin(ScrollTrigger);

export function Catalog({ perfumes }: { perfumes: any[] }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedPerfume, setSelectedPerfume] = useState<any | null>(null);

  const filters = ["All", "Summer", "Winter", "Versatile fragrance"];

  const filteredPerfumes = activeFilter === "All"
    ? perfumes
    : perfumes.filter((p: any) => p.category?.toLowerCase() === activeFilter.toLowerCase());

  return (
    <section id="catalog" className="bg-[#F5F5F3] px-6 py-24 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end md:mb-16">
          <div className="flex items-baseline gap-4">
            <h2 className="font-['Outfit'] text-3xl font-light text-[#0A0A0A] md:text-4xl">
              Current Stock
            </h2>
            <span className="font-['IBM_Plex_Mono'] text-sm text-[#9A9A9A]">
              — {filteredPerfumes.length} Fragrances
            </span>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap gap-6">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`font-['Outfit'] text-sm uppercase tracking-widest transition-all ${
                  activeFilter === filter
                    ? "text-[#0A0A0A] border-b border-[#0A0A0A] pb-1"
                    : "text-[#9A9A9A] hover:text-[#0A0A0A] border-b border-transparent pb-1"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:gap-8">
          {filteredPerfumes.map((perfume: any) => (
            <div
              key={perfume.id}
              className="group cursor-pointer bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#0A0A0A] border border-transparent"
              onClick={() => setSelectedPerfume(perfume)}
            >
              <div className="aspect-square w-full overflow-hidden bg-[#F5F5F3]">
                {perfume.image ? (
                  <img
                    src={perfume.image}
                    alt={perfume.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-[#E5E5E3] transition-transform duration-700 group-hover:scale-105" />
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-['Outfit'] text-lg font-medium text-[#0A0A0A]">
                      {perfume.name}
                    </h3>
                    <p className="font-['IBM_Plex_Mono'] text-xs uppercase tracking-wider text-[#9A9A9A] mt-1">
                      {perfume.brand}
                    </p>
                  </div>
                  <span
                    className={`font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest ${
                      perfume.status === "Available" ? "text-[#0A0A0A]" :
                      perfume.status === "Out of Stock" ? "text-[#9A9A9A] line-through" :
                      "text-[#0A0A0A] italic"
                    }`}
                  >
                    {perfume.status}
                  </span>
                </div>
                
                <div className="mt-4 border-t border-[#F5F5F3] pt-4 font-['IBM_Plex_Mono'] text-xs tracking-wider text-[#0A0A0A]">
                  5ml — ₱{perfume.price5ml} · 10ml — ₱{perfume.price10ml}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal / Bottom Sheet */}
      {selectedPerfume && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/40 backdrop-blur-sm p-4 transition-opacity"
          onClick={() => setSelectedPerfume(null)}
        >
          <div
            className="w-full max-w-2xl bg-white animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:fade-in-0 duration-300 transform"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#F5F5F3] p-4 sm:p-6">
              <span className="font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest text-[#9A9A9A]">
                Product Details
              </span>
              <button
                onClick={() => setSelectedPerfume(null)}
                className="text-[#9A9A9A] hover:text-[#0A0A0A] transition-colors"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            
            <div className="p-6 sm:p-8 sm:flex sm:gap-8">
              <div className="mb-6 sm:mb-0 sm:w-1/2">
                <div className="aspect-square w-full bg-[#F5F5F3] overflow-hidden">
                  {selectedPerfume.image ? (
                    <img
                      src={selectedPerfume.image}
                      alt={selectedPerfume.name}
                      className="h-full w-full object-cover mix-blend-multiply"
                    />
                  ) : (
                    <div className="h-full w-full bg-[#E5E5E3]" />
                  )}
                </div>
              </div>
              
              <div className="sm:w-1/2 flex flex-col">
                <p className="font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest text-[#9A9A9A] mb-2">
                  {selectedPerfume.brand}
                </p>
                <h3 className="font-['Cormorant_Garamond'] text-3xl italic text-[#0A0A0A] mb-4">
                  {selectedPerfume.name}
                </h3>
                
                <p className="font-['Outfit'] text-sm font-light leading-relaxed text-[#0A0A0A] mb-6">
                  {selectedPerfume.description}
                </p>
                
                <div className="space-y-4 mb-8 flex-1">
                  <div>
                    <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9A9A9A] mb-1">Top Notes</span>
                    <p className="font-['Outfit'] text-sm text-[#0A0A0A]">{selectedPerfume.notes.top}</p>
                  </div>
                  <div>
                    <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9A9A9A] mb-1">Mid Notes</span>
                    <p className="font-['Outfit'] text-sm text-[#0A0A0A]">{selectedPerfume.notes.mid}</p>
                  </div>
                  <div>
                    <span className="block font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#9A9A9A] mb-1">Base Notes</span>
                    <p className="font-['Outfit'] text-sm text-[#0A0A0A]">{selectedPerfume.notes.base}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#F5F5F3]">
                  <div className="flex justify-between items-center mb-6 font-['IBM_Plex_Mono'] text-sm tracking-wider">
                    <span>5ml — ₱{selectedPerfume.price5ml}</span>
                    <span>10ml — ₱{selectedPerfume.price10ml}</span>
                  </div>
                  
                  <a
                    href="https://www.facebook.com/profile.php?id=61584297385882"
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full border border-[#0A0A0A] bg-[#0A0A0A] py-4 text-center font-['Outfit'] text-xs uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-[#0A0A0A]"
                  >
                    Message to Order
                  </a>
                </div>
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
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        yPercent: 20,
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
      ref={sectionRef}
      className="relative flex min-h-[60vh] w-full flex-col items-center justify-center overflow-hidden bg-[#0A0A0A] px-6 py-24 lg:px-12 lg:py-32"
    >
      {/* Parallax Background Noise */}
      <div
        ref={bgRef}
        className="pointer-events-none absolute -inset-x-0 -inset-y-[20%] z-0 h-[140%] w-full opacity-10 mix-blend-overlay"
        style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')",
          backgroundRepeat: "repeat",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl text-center">
        <h2 className="font-['Cormorant_Garamond'] text-4xl italic leading-tight text-white md:text-5xl lg:text-6xl">
          "Scent is the only sense that bypasses reason."
        </h2>
        <p className="mt-8 font-['IBM_Plex_Mono'] text-xs tracking-[0.2em] text-[#9A9A9A] uppercase">
          — The DecantSnibro Philosophy
        </p>

        <div className="mt-20 grid grid-cols-1 gap-12 text-left md:grid-cols-2 md:gap-16">
          <p className="font-['Outfit'] text-sm font-light leading-relaxed text-[#F5F5F3]">
            We decant from full bottles of the world's finest fragrances — so you can find yours before committing.
          </p>
          <p className="font-['Outfit'] text-sm font-light leading-relaxed text-[#F5F5F3]">
            Each order is hand-filled, labeled, and packed by one person. This is not a warehouse. This is a cabinet of curiosities.
          </p>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer id="order" className="bg-[#0A0A0A] px-6 py-16 lg:px-12 relative z-10">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-12 md:flex-row md:items-center md:gap-6">
        {/* Left */}
        <div className="text-left">
          <h2 className="font-['Bodoni_Moda'] text-2xl font-extralight uppercase tracking-[0.35em] text-white">
            Decantsnibro
          </h2>
        </div>

        {/* Center */}
        <div className="text-left md:text-center">
          <p className="font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-[0.2em] text-[#9A9A9A]">
            Est. 2026 · Visayas State University Baybay City Leyte / Mahaplag Leyte · Decants Only
          </p>
        </div>

        {/* Right */}
        <div className="flex flex-col items-start gap-2 md:items-end">
          <a
            href="https://www.facebook.com/profile.php?id=61584297385882"
            target="_blank"
            rel="noreferrer"
            className="group relative inline-flex items-center gap-2 font-['Outfit'] text-xs font-light uppercase tracking-[0.2em] text-white"
          >
            Facebook
            <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-white transition-all duration-300 group-hover:w-full" />
          </a>
          <p className="font-['Outfit'] text-[10px] uppercase tracking-[0.2em] text-[#9A9A9A]">
            Message to Order
          </p>
        </div>
      </div>

      <div className="mx-auto mt-24 max-w-7xl border-t border-[#1A1A1A] pt-8 text-center md:mt-32">
        <p className="font-['IBM_Plex_Mono'] text-[10px] tracking-[0.2em] text-[#666666] uppercase">
          All fragrances are decanted from authentic full bottles. Not affiliated with any brands.
        </p>
      </div>
    </footer>
  );
}

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const texts = textContainerRef.current?.children;
      if (texts) {
        gsap.from(texts, {
          y: 50,
          opacity: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.2,
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative flex h-[100dvh] w-full items-end justify-start overflow-hidden bg-black"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <img
          src="/hero-bg.jpg"
          alt="Perfume glass background"
          loading="lazy"
          className="h-full w-full object-cover object-center brightness-[0.6] grayscale-[0.2]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div
        className="relative z-10 w-full max-w-7xl px-6 pb-20 md:px-12 md:pb-24 lg:pb-32"
        ref={textContainerRef}
      >
        <p className="font-['Outfit'] text-2xl md:text-3xl font-light text-white mb-[-0.5rem] tracking-wide">
          Wear the
        </p>
        <h1 className="font-['Cormorant_Garamond'] text-[clamp(6rem,12vw,12rem)] italic leading-[0.9] text-white">
          Invisible.
        </h1>
        <div className="mt-6 md:mt-8 space-y-8">
          <p className="font-['IBM_Plex_Mono'] text-sm md:text-base tracking-widest text-white/80">
            5ml · 10ml Decants — Ship Nationwide
          </p>
          <a
            href="#catalog"
            className="group inline-flex items-center gap-2 border-b border-white pb-1 font-['Outfit'] text-sm font-light uppercase tracking-widest text-white transition-all hover:text-white/80"
          >
            Browse Collection
            <ArrowRight
              size={16}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
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
      subtitle: "Discover Your Scent",
      desc: "Explore our curated catalog of the world's most sought-after niche and designer fragrances.",
    },
    {
      number: "02",
      title: "Message Us",
      subtitle: "Place Your Order",
      desc: "Send us a direct message with your chosen fragrances and sizes. We'll handle the rest personally.",
    },
    {
      number: "03",
      title: "Receive",
      subtitle: "Unbox the Experience",
      desc: "Your decants arrive carefully packed, hand-labeled, and ready to be worn.",
    },
  ];

  return (
    <section id="about" className="bg-[#F5F5F3] px-6 py-24 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:justify-between md:gap-12 lg:gap-24">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`flex-1 ${
                index !== steps.length - 1
                  ? "border-b border-[#0A0A0A] md:border-b-0 pb-12 md:pb-0 mb-12 md:mb-0"
                  : ""
              }`}
            >
              <div className="mb-6 font-['IBM_Plex_Mono'] text-sm tracking-widest text-[#9A9A9A]">
                {step.number} — {step.title}
              </div>
              <h3 className="mb-4 font-['Cormorant_Garamond'] text-3xl italic text-[#0A0A0A]">
                {step.subtitle}
              </h3>
              <p className="font-['Outfit'] text-sm font-light leading-relaxed text-[#0A0A0A]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 300);

    if (isMenuOpen) setIsMenuOpen(false);

    const element = document.getElementById(target);
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else if (target === "top") {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 150);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: "Catalog", target: "catalog" },
    { name: "Reviews", target: "reviews" },
    { name: "Order", target: "order" }
  ];

  return (
    <div 
      className={clsx(
        "fixed top-4 left-1/2 z-50 flex flex-col overflow-hidden transition-all duration-500 border",
        isScrolled
          ? "bg-white/85 backdrop-blur-[20px] text-[#0A0A0A] border-black/12"
          : "bg-[#0A0A0A] text-white border-transparent",
        "w-[260px] sm:w-[520px]",
        isMenuOpen ? "h-[200px] rounded-[32px]" : "h-[48px] rounded-full",
        isHovered && !isMenuOpen ? "sm:w-[640px] sm:h-[56px]" : ""
      )}
      style={{ 
        transform: `translateX(-50%) scale(${isPulsing ? 1.04 : 1})`,
        transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex h-[48px] sm:h-full w-full items-center justify-between px-5 shrink-0 transition-all duration-500" style={{ height: isHovered && !isMenuOpen ? '56px' : '48px' }}>
        <a
          href="#top"
          onClick={(e) => handleLinkClick(e, "top")}
          className="font-['Bodoni_Moda'] text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-extralight shrink-0 transition-opacity hover:opacity-70"
        >
          Decantsnibro
        </a>

        <div className="hidden sm:flex items-center h-full">
          <div className={clsx(
            "h-[16px] w-[1px] transition-colors duration-500",
            isHovered ? "mx-6" : "mx-4",
            isScrolled ? "bg-black/20" : "bg-white/30"
          )} style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }} />
          <nav className={clsx(
            "flex items-center transition-all duration-500",
            isHovered ? "gap-8" : "gap-6"
          )} style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={`#${link.target}`}
                onClick={(e) => handleLinkClick(e, link.target)}
                className="font-['Outfit'] text-[0.75rem] font-light transition-opacity hover:opacity-70"
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>

        <button 
          className="sm:hidden flex flex-col gap-[4px] justify-center items-center w-6 h-6 shrink-0"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={clsx("w-4 h-[1px] transition-all duration-400", isScrolled ? "bg-black" : "bg-white", isMenuOpen && "translate-y-[2.5px] rotate-45")} />
          <span className={clsx("w-4 h-[1px] transition-all duration-400", isScrolled ? "bg-black" : "bg-white", isMenuOpen && "-translate-y-[2.5px] -rotate-45")} />
        </button>
      </div>

      <div 
        className={clsx(
          "sm:hidden flex flex-col items-center justify-center gap-5 w-full h-[152px] transition-opacity duration-300 delay-100",
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={`#${link.target}`}
            onClick={(e) => handleLinkClick(e, link.target)}
            className="font-['Outfit'] text-[0.875rem] font-light tracking-widest uppercase transition-opacity hover:opacity-70"
          >
            {link.name}
          </a>
        ))}
      </div>
    </div>
  );
}

export function NoiseOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.03] mix-blend-overlay">
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
      quote: "The perfect way to test expensive fragrances before dropping $300+. Excellent service.",
    },
    {
      id: 3,
      name: "Julian S.",
      perfume: "Aventus",
      quote: "Authentic juice. I compared it to my almost-empty retail bottle and it's 100% legit.",
    },
    {
      id: 4,
      name: "Nina M.",
      perfume: "Gypsy Water",
      quote: "Love the minimal bottles and labeling. Fits right into my aesthetic.",
    },
    {
      id: 5,
      name: "David K.",
      perfume: "Tuscan Leather",
      quote: "Fast comms and secure packaging. A reliable plug for hard-to-find decants.",
    },
  ];

  return (
    <section id="reviews" className="overflow-hidden bg-[#F5F5F3] py-24 lg:py-32">
      <div className="mb-16 px-6 lg:px-12 text-center">
        <h2 className="font-['Cormorant_Garamond'] text-4xl italic text-[#0A0A0A] md:text-5xl">
          What They're Wearing
        </h2>
      </div>

      <div className="relative flex overflow-hidden group w-full">
        {/* We use two identical lists to create an infinite loop */}
        <div className="flex w-max animate-marquee gap-6 px-3 group-hover:pause">
          {[...reviews, ...reviews, ...reviews, ...reviews].map((review, i) => (
            <div
              key={`${review.id}-${i}`}
              className="flex w-[300px] flex-col justify-between border border-[#0A0A0A] bg-white p-8 md:w-[380px] flex-shrink-0"
            >
              <div>
                <div className="mb-6 font-['IBM_Plex_Mono'] text-[10px] tracking-[0.2em] text-[#0A0A0A]">
                  ★ ★ ★ ★ ★
                </div>
                <p className="font-['Outfit'] text-lg font-light italic leading-relaxed text-[#0A0A0A]">
                  "{review.quote}"
                </p>
              </div>
              <div className="mt-8 font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest text-[#9A9A9A]">
                {review.name} — {review.perfume}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}