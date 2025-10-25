-- Add simple coach profile fields to profiles table
-- Run this in Supabase SQL Editor

alter table profiles 
  add column if not exists coaching_experience text,
  add column if not exists licenses text,
  add column if not exists specialties text,
  add column if not exists current_club text;

-- Example values:
-- coaching_experience: "10+ years coaching youth soccer"
-- licenses: "UEFA B License, USSF A License"
-- specialties: "U12-U18, Possession-based football"
-- current_club: "Manchester United Academy"
