ALTER TABLE perfumes
ADD COLUMN IF NOT EXISTS gender TEXT DEFAULT 'unisex';

UPDATE perfumes
SET gender = 'unisex'
WHERE gender IS NULL;

ALTER TABLE perfumes
DROP CONSTRAINT IF EXISTS perfumes_gender_check;

ALTER TABLE perfumes
ADD CONSTRAINT perfumes_gender_check CHECK (gender IN ('male', 'female', 'unisex'));
