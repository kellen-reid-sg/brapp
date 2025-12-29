-- Add missing drill fields to database
-- Run this in Supabase SQL Editor

ALTER TABLE drills ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE drills ADD COLUMN IF NOT EXISTS duration integer;
ALTER TABLE drills ADD COLUMN IF NOT EXISTS difficulty text;
ALTER TABLE drills ADD COLUMN IF NOT EXISTS equipment text[];
ALTER TABLE drills ADD COLUMN IF NOT EXISTS setup_instructions text[];
ALTER TABLE drills ADD COLUMN IF NOT EXISTS coaching_points text[];
ALTER TABLE drills ADD COLUMN IF NOT EXISTS progressions text[];
ALTER TABLE drills ADD COLUMN IF NOT EXISTS author_name text;
ALTER TABLE drills ADD COLUMN IF NOT EXISTS source_url text;
