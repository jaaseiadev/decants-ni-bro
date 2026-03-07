"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

export function AdminLayout({ children, className }: { children: React.ReactNode; className?: string }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className={cn("min-h-screen flex flex-col font-sans bg-ds-ivory", className)}>
      <header className="sticky top-0 z-50 w-full bg-ds-black text-ds-ivory">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/admin" className="font-serif text-2xl uppercase tracking-widest">
            DecantSnibro
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/admin/dashboard" className="text-sm font-medium uppercase tracking-widest text-ds-greige hover:text-ds-ivory transition-colors">
              Dashboard
            </Link>
            <Link href="/admin/catalog" className="text-sm font-medium uppercase tracking-widest text-ds-greige hover:text-ds-ivory transition-colors">
              Catalog
            </Link>
            <button 
              onClick={handleSignOut}
              className="text-sm font-medium uppercase tracking-widest text-ds-greige hover:text-ds-ivory transition-colors flex items-center gap-2"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 -mr-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-ds-black border-t border-ds-charcoal text-ds-ivory">
          <nav className="flex flex-col container mx-auto px-4 py-4 gap-4">
            <Link 
              href="/admin/dashboard" 
              className="text-sm font-medium uppercase tracking-widest text-ds-greige hover:text-ds-ivory transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              href="/admin/catalog" 
              className="text-sm font-medium uppercase tracking-widest text-ds-greige hover:text-ds-ivory transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Catalog
            </Link>
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleSignOut();
              }}
              className="text-sm font-medium uppercase tracking-widest text-ds-greige hover:text-ds-ivory transition-colors flex items-center gap-2 text-left"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </nav>
        </div>
      )}

      <main className="flex-1 flex flex-col container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
