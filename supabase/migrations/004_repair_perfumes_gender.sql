ALTER TABLE perfumes
ADD COLUMN IF NOT EXISTS gender TEXT;

UPDATE perfumes
SET gender = 'unisex'
WHERE gender IS NULL
   OR gender NOT IN ('male', 'female', 'unisex');

ALTER TABLE perfumes
ALTER COLUMN gender SET DEFAULT 'unisex';

ALTER TABLE perfumes
ALTER COLUMN gender SET NOT NULL;

ALTER TABLE perfumes
DROP CONSTRAINT IF EXISTS perfumes_gender_check;

ALTER TABLE perfumes
ADD CONSTRAINT perfumes_gender_check CHECK (gender IN ('male', 'female', 'unisex'));

NOTIFY pgrst, 'reload schema';
