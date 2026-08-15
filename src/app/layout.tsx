import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Decants Ni Bro | Premium Fragrance Decants",
  description: "A carefully curated collection of premium fragrance decants.",
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
