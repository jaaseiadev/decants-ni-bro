-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create perfumes table
CREATE TABLE perfumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'out_of_stock', 'discontinued')),
    price_5ml NUMERIC(10, 2) NOT NULL,
    price_10ml NUMERIC(10, 2) NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 0.00,
    review_count INTEGER DEFAULT 0,
    image_url TEXT,
    notes_top TEXT,
    notes_middle TEXT,
    notes_base TEXT,
    accords TEXT,
    when_to_wear TEXT,
    stock_5ml INTEGER DEFAULT 0,
    stock_10ml INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create sales table
CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    perfume_id UUID REFERENCES perfumes(id) ON DELETE SET NULL,
    perfume_name TEXT NOT NULL,
    size TEXT NOT NULL CHECK (size IN ('5ml', '10ml', 'full_bottle')),
    qty INTEGER NOT NULL,
    revenue NUMERIC(10, 2) NOT NULL,
    profit NUMERIC(10, 2) NOT NULL,
    payment_type TEXT NOT NULL CHECK (payment_type IN ('cash', 'gcash', 'bank_transfer')),
    sale_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create inventory_log table
CREATE TABLE inventory_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    perfume_id UUID REFERENCES perfumes(id) ON DELETE CASCADE,
    perfume_name TEXT NOT NULL,
    change_ml INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('restock', 'sale', 'adjustment')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    perfume_id UUID REFERENCES perfumes(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create expenses table
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL,
    description TEXT,
    amount NUMERIC(10, 2) NOT NULL,
    month TEXT NOT NULL, -- Format: YYYY-MM
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Enable Row-Level Security (RLS)
ALTER TABLE perfumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Creating policies
-- Perfumes: Public read, Admin write
CREATE POLICY "Public read access for perfumes" ON perfumes FOR SELECT USING (true);
CREATE POLICY "Admin write access for perfumes" ON perfumes FOR ALL USING (auth.role() = 'authenticated');

-- Sales: Admin full access only
CREATE POLICY "Admin access for sales" ON sales FOR ALL USING (auth.role() = 'authenticated');

-- Inventory Log: Admin full access only
CREATE POLICY "Admin access for inventory" ON inventory_log FOR ALL USING (auth.role() = 'authenticated');

-- Reviews: Public read, Admin write
CREATE POLICY "Public read access for reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Admin write access for reviews" ON reviews FOR ALL USING (auth.role() = 'authenticated');

-- Expenses: Admin full access only
CREATE POLICY "Admin access for expenses" ON expenses FOR ALL USING (auth.role() = 'authenticated');

-- 7. Storage Bucket configuration (Requires proper superset privileges usually, or run via Dashboard. Simulating here)
INSERT INTO storage.buckets (id, name, public) VALUES ('perfume-images', 'perfume-images', true) ON CONFLICT (id) DO NOTHING;
CREATE POLICY "Public read access for images" ON storage.objects FOR SELECT USING (bucket_id = 'perfume-images');
CREATE POLICY "Admin upload access for images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'perfume-images' AND auth.role() = 'authenticated');
CREATE POLICY "Admin update access for images" ON storage.objects FOR UPDATE USING (bucket_id = 'perfume-images' AND auth.role() = 'authenticated');
CREATE POLICY "Admin delete access for images" ON storage.objects FOR DELETE USING (bucket_id = 'perfume-images' AND auth.role() = 'authenticated');
