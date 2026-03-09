import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DecantSnibro | Premium Perfume Decants",
  description: "Curated collection of high-quality perfume decants.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`antialiased selection:bg-ds-black selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
