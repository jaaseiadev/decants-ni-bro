import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function PublicLayout({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("min-h-screen flex flex-col font-sans", className)}>
      <header className="sticky top-0 z-50 w-full bg-ds-ivory/80 backdrop-blur-md border-b border-ds-nude">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl uppercase tracking-widest text-ds-black">
            DecantSnibro
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium uppercase tracking-widest hover:text-ds-taupe transition-colors">
              Catalog
            </Link>
            <Link href="/about" className="text-sm font-medium uppercase tracking-widest hover:text-ds-taupe transition-colors">
              Our Story
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <footer className="bg-ds-black text-ds-ivory py-12 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="font-serif text-xl uppercase tracking-widest mb-4">DecantSnibro</p>
          <p className="fine-print">&copy; {new Date().getFullYear()} DecantSnibro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
