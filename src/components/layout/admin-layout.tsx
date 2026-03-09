"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

export function AdminLayout({ children, className }: { children: React.ReactNode; className?: string }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const navLinks = [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Catalog", href: "/admin/catalog" },
    { name: "Inventory", href: "/admin/inventory" },
    { name: "Sales", href: "/admin/sales" },
    { name: "Expenses", href: "/admin/expenses" },
    { name: "Stats", href: "/admin/stats" },
  ];

  return (
    <div className={cn("min-h-screen flex flex-col font-sans bg-ds-ivory", className)}>
      <header className="sticky top-0 z-50 w-full bg-ds-black text-ds-ivory">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/admin" className="font-serif text-2xl uppercase tracking-widest">
            DecantSnibro
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium uppercase tracking-widest transition-colors",
                    isActive 
                      ? "text-ds-ivory font-bold underline underline-offset-8 decoration-2" 
                      : "text-ds-greige hover:text-ds-ivory"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
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
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "text-sm font-medium uppercase tracking-widest transition-colors",
                    isActive 
                      ? "text-ds-ivory font-bold underline underline-offset-4 decoration-2" 
                      : "text-ds-greige hover:text-ds-ivory"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
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
