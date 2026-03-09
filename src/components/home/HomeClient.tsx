"use client";

import { useEffect, useRef } from "react";
import { PerfumeCard } from "@/components/catalog/PerfumeCard";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export function HomeClient({ catalog }: { catalog: any[] }) {
  const container = useRef(null);
  const parallaxRef = useRef(null);

  useGSAP(() => {
    // Hero Animations
    const tl = gsap.timeline();
    tl.fromTo(
      ".hero-text",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power3.out", delay: 0.2 }
    );

    // Parallax
    gsap.to(".parallax-bg", {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: parallaxRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }, { scope: container });

  return (
    <div ref={container} className="bg-[#F5F5F3]">
      
      {/* Cinematic Hero */}
      <section className="relative h-[90vh] flex flex-col justify-end pb-24 px-6 md:px-12">
        <div className="absolute inset-0 bg-[#0A0A0A]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80 z-10" />
        </div>
        
        <div className="relative z-20 max-w-4xl text-white">
          <h1 className="hero-text font-serif text-6xl md:text-8xl lg:text-9xl tracking-tight leading-[0.9] mb-6">
            The Art<br />of Scent.
          </h1>
          <p className="hero-text font-sans font-light text-lg md:text-xl text-white/70 max-w-lg mb-10">
            Curated niche decants. Experience the world's most luxurious fragrances without the commitment of a full bottle.
          </p>
          <a 
            href="#catalog"
            className="hero-text inline-block border-b border-white pb-1 font-sans text-sm tracking-[0.2em] uppercase hover:text-white/60 hover:border-white/60 transition-colors"
          >
            Explore Collection
          </a>
        </div>
      </section>

      {/* Marquee */}
      <section className="py-6 border-y border-[#0A0A0A]/10 overflow-hidden bg-[#F5F5F3]">
        <div className="flex w-[200%] md:w-[150%] animate-marquee whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-16 px-8 items-center text-sm font-serif italic text-[#0A0A0A]/60 shrink-0">
              <span>"An absolute game changer for my collection."</span>
              <span>•</span>
              <span>"Authentic niche decants, elegantly presented."</span>
              <span>•</span>
              <span>"The only way I test fragrances now."</span>
              <span>•</span>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial Parallax Strip */}
      <section ref={parallaxRef} className="h-[70vh] relative overflow-hidden bg-[#0A0A0A] flex items-center justify-center">
        <div className="parallax-bg absolute inset-0 -top-[20%] h-[140%] w-full bg-[#111]">
          {/* Using a placeholder gradient since user didn't specify an image, but added an aesthetic dark element. */}
          <div className="w-full h-full opacity-30 bg-gradient-to-br from-[#222] to-[#0A0A0A]" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h2 className="font-serif text-4xl md:text-6xl mb-6">Signature Selection</h2>
          <p className="font-sans font-light text-white/70 max-w-md mx-auto">
            Every drop carefully extracted. Every bottle meticulously sourced. Discover our signature decants.
          </p>
        </div>
      </section>

      {/* Catalog */}
      <section id="catalog" className="px-6 md:px-12 py-24 bg-[#F5F5F3]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 border-b border-[#0A0A0A]/10 pb-8">
          <h2 className="font-serif text-5xl md:text-6xl text-[#0A0A0A]">Current Stock</h2>
          <div className="flex gap-4">
            <select className="bg-transparent border-b border-[#0A0A0A] pb-1 pr-4 text-xs font-sans tracking-widest uppercase focus:outline-none">
              <option value="">All Accords</option>
              <option value="woody">Woody</option>
              <option value="floral">Floral</option>
              <option value="fresh">Fresh</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {catalog.map((perfume, index) => (
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
      </section>

    </div>
  );
}
