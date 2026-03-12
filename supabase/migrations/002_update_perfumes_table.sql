-- SQL Migration to update Perfumes table to merge Inventory and Catalog and remove ML Stock

-- 1. Remove the ML stock columns
ALTER TABLE perfumes DROP COLUMN IF EXISTS stock_5ml;
ALTER TABLE perfumes DROP COLUMN IF EXISTS stock_10ml;

-- 2. Modify the status column
-- The old status has a CHECK constraint. We need to drop it first.
-- The name of the constraint may be generic, so we find and drop it or just replace the column.
ALTER TABLE perfumes DROP CONSTRAINT IF EXISTS perfumes_status_check;

-- If it's stored as TEXT, we can just replace the check constraint.
-- If the existing values are incompatible, we might need to cast or update them.
UPDATE perfumes SET status = 'in stock' WHERE status = 'active';
UPDATE perfumes SET status = 'out of stock' WHERE status = 'out_of_stock';
-- we can set discontinued to out of stock for simplicity
UPDATE perfumes SET status = 'out of stock' WHERE status = 'discontinued';

-- 3. Add the new constraint for the status tracking
-- 'in stock', 'out of stock', 'new', 'in transit'
ALTER TABLE perfumes ADD CONSTRAINT perfumes_status_check CHECK (status IN ('in stock', 'out of stock', 'new', 'in transit'));

-- Additional changes if you need to rename prices but keeping them for now:
-- price_5ml, price_10ml are kept for pricing references when out of stock / in transit etc.
