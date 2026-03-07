import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusPill } from "@/components/ui/status-pill";

export default function Home() {
  return (
    <PublicLayout>
      <section className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 py-20 bg-ds-ivory">
        <h1 className="display-title mb-6">DecantSnibro</h1>
        <p className="display-subtitle mb-12 max-w-2xl text-ds-taupe">
          The art of fine fragrance, decanted.
        </p>
        <div className="flex gap-4">
          <Button variant="primary" size="lg">Explore Catalog</Button>
          <Button variant="ghost" size="lg">Our Story</Button>
        </div>
      </section>

      <section className="py-20 bg-ds-nude/30">
        <div className="container mx-auto px-4">
          <h2 className="display-subtitle mb-12 text-center">Design System Checks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8">
              <h3 className="font-serif text-2xl uppercase mb-4">Sample Product</h3>
              <StatusPill status="AVAILABLE" className="mb-4" />
              <p className="body-text mb-6">A beautiful description of a niche perfume.</p>
              <Button variant="secondary" className="w-full">Add to Cart</Button>
            </Card>

            <Card variant="charcoal" className="p-8">
              <h3 className="font-serif text-2xl uppercase mb-4">Exclusive</h3>
              <StatusPill status="OUT_OF_STOCK" className="mb-4" />
              <p className="body-text text-ds-greige mb-6">Currently unavailable, but back soon.</p>
              <Button variant="primary" className="w-full" disabled>Notify Me</Button>
            </Card>

            <Card className="p-8 flex flex-col gap-6">
              <h3 className="font-serif text-2xl uppercase mb-2">Stay Updated</h3>
              <Input label="Email Address" type="email" placeholder="you@example.com" />
              <Button variant="primary" className="w-full mt-auto">Subscribe</Button>
            </Card>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
