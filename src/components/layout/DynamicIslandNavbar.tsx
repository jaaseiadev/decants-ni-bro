"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";

export function DynamicIslandNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePulse = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    el.style.transform = "scale(1.04)";
    setTimeout(() => {
      el.style.transform = "scale(1)";
    }, 150);
  };

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav
        className={cn(
          "pointer-events-auto flex flex-col justify-center overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          scrolled
            ? "bg-white/85 backdrop-blur-[20px] text-ds-black shadow-lg border border-gray-200/50"
            : "bg-[#0A0A0A] text-white shadow-xl hover:bg-[#111]",
          // Dimensions logic
          mobileMenuOpen ? "w-[260px] h-[200px] rounded-3xl" : 
          hovered ? "w-[640px] h-[56px] rounded-full hidden md:flex" : "w-[260px] md:w-[520px] h-[48px] rounded-full"
        )}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setMobileMenuOpen(false);
        }}
      >
        {/* Top/Main Bar */}
        <div className="flex items-center justify-between w-full px-6 h-[48px] shrink-0">
          <Link href="/" className="font-serif text-lg tracking-widest uppercase">
            Decants
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              onClick={handlePulse}
              className={cn("text-sm font-light tracking-widest transition-transform duration-150", scrolled ? "hover:text-ds-taupe" : "hover:text-gray-300")}
            >
              Catalog
            </Link>
            <Link 
              href="/about" 
              onClick={handlePulse}
              className={cn("text-sm font-light tracking-widest transition-transform duration-150", scrolled ? "hover:text-ds-taupe" : "hover:text-gray-300")}
            >
              Story
            </Link>
          </div>

          <button 
            className="md:hidden flex flex-col gap-1.5 justify-center items-center w-6 h-6"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className={cn("h-[1px] w-5 transition-colors", scrolled ? "bg-black" : "bg-white")} />
            <div className={cn("h-[1px] w-5 transition-colors", scrolled ? "bg-black" : "bg-white")} />
          </button>
        </div>

        {/* Mobile Expanded Menu */}
        <div className={cn(
          "flex flex-col gap-4 px-6 pt-4 pb-6 transition-opacity duration-300 md:hidden",
          mobileMenuOpen ? "opacity-100" : "opacity-0"
        )}>
           <Link 
              href="#catalog" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-light tracking-widest uppercase"
            >
              Catalog
            </Link>
            <Link 
              href="/about" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-light tracking-widest uppercase"
            >
              Story
            </Link>
        </div>
      </nav>
    </div>
  );
}
