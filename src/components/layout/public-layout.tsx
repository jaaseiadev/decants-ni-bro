import * as React from "react";
import { cn } from "@/lib/utils";
import { DynamicIslandNavbar } from "./DynamicIslandNavbar";
import { NoiseOverlay } from "./NoiseOverlay";

export function PublicLayout({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("min-h-screen flex flex-col font-sans relative", className)}>
      <NoiseOverlay />
      <DynamicIslandNavbar />
      <main className="flex-1 flex flex-col pt-16">
        {children}
      </main>
      <footer className="bg-[#0A0A0A] text-[#F5F5F3] py-20 mt-auto border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <p className="font-serif text-xl uppercase tracking-widest mb-4">DecantSnibro</p>
          <p className="fine-print">&copy; {new Date().getFullYear()} DecantSnibro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
