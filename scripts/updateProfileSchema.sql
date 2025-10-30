-- Add missing fields to profiles table for enhanced user profiles

-- Add location field (city, state, country)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location TEXT;

-- Add clubs/schools coached (array of text)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS clubs_schools TEXT[] DEFAULT '{}';

-- Add licenses/badges field (array of text)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS licenses TEXT[] DEFAULT '{}';

-- Add index for faster profile lookups
CREATE INDEX IF NOT EXISTS idx_profiles_display_name ON profiles(display_name);

-- Create a view for profile stats
CREATE OR REPLACE VIEW profile_stats AS
SELECT
  p.id,
  p.display_name,
  p.avatar_url,
  p.bio,
  p.location,
  p.clubs_schools,
  p.licenses,
  p.created_at,
  COALESCE(COUNT(DISTINCT s.id), 0) AS sessions_created,
  COALESCE(COUNT(DISTINCT d.id), 0) AS drills_posted,
  COALESCE(SUM(CASE 
    WHEN v.value = 1 AND (v.content_kind = 'drill' AND d2.author_id = p.id 
         OR v.content_kind = 'session' AND s2.author_id = p.id) 
    THEN 1 
    ELSE 0 
  END), 0) AS upvotes_received
FROM profiles p
LEFT JOIN sessions s ON s.author_id = p.id
LEFT JOIN drills d ON d.author_id = p.id
LEFT JOIN drills d2 ON d2.author_id = p.id
LEFT JOIN sessions s2 ON s2.author_id = p.id
LEFT JOIN votes v ON (v.content_kind = 'drill' AND v.content_id = d2.id) 
                   OR (v.content_kind = 'session' AND v.content_id = s2.id)
GROUP BY p.id, p.display_name, p.avatar_url, p.bio, p.location, p.clubs_schools, p.licenses, p.created_at;
