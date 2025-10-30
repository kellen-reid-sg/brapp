# Profile Feature Setup Guide

## 🗄️ Database Migration

Run the following SQL in your Supabase SQL Editor:

```sql
-- Add missing fields to profiles table for enhanced user profiles

-- Add location field (city, state, country)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location TEXT;

-- Add clubs/schools coached (array of text)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS clubs_schools TEXT[] DEFAULT '{}';

-- Add licenses/badges field (array of text)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS licenses TEXT[] DEFAULT '{}';

-- Add index for faster profile lookups
CREATE INDEX IF NOT EXISTS idx_profiles_display_name ON profiles(display_name);
```

## 📦 Storage Bucket Setup

You need to create a storage bucket for profile images in Supabase:

### Step 1: Create Bucket
1. Go to Supabase Dashboard → Storage
2. Click "Create a new bucket"
3. Name: `profile-images`
4. Public bucket: ✅ YES (check the box)
5. Click "Create bucket"

### Step 2: Set Storage Policies
Run this SQL to allow authenticated users to upload avatars:

```sql
-- Policy: Allow authenticated users to upload their own avatars
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-images' 
  AND (storage.foldername(name))[1] = 'avatars'
  AND auth.uid()::text = (string_to_array(name, '-'))[1]
);

-- Policy: Allow public read access to all profile images
CREATE POLICY "Public read access to profile images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-images');

-- Policy: Allow users to update their own avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-images'
  AND (storage.foldername(name))[1] = 'avatars'
  AND auth.uid()::text = (string_to_array(name, '-'))[1]
);

-- Policy: Allow users to delete their own avatar
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-images'
  AND (storage.foldername(name))[1] = 'avatars'
  AND auth.uid()::text = (string_to_array(name, '-'))[1]
);
```

## ✅ Features Implemented

### Profile Header Component
- ✅ Circular avatar with upload functionality
- ✅ Banner background (green gradient)
- ✅ Editable fields: Display name, bio, location, clubs/schools
- ✅ View-only licenses/badges
- ✅ Stats display: Sessions, Drills, Upvotes, Boot Room Age
- ✅ Social Links placeholder (UI only)
- ✅ Edit mode with save/cancel

### Session List Component
- ✅ Grid display of user's sessions
- ✅ Shows title, description, duration, drill count
- ✅ Score and comment count
- ✅ Clickable cards linking to session detail
- ✅ Empty state with CTA

### Drill List Component
- ✅ Two tabs: Created & Upvoted
- ✅ Grid display with drill cards
- ✅ Shows drill image, title, description, tags
- ✅ Score and comment count
- ✅ Empty states for both tabs

### Pages
- ✅ `/profile` - Own profile (auth required)
- ✅ `/profile/[id]` - Public profile viewing
- ✅ Automatic redirect to login if not authenticated
- ✅ 404 state for non-existent profiles

## 🧪 Testing Checklist

1. **Database Migration**
   - [ ] Run SQL migration in Supabase
   - [ ] Verify new columns exist in profiles table
   - [ ] Check indexes are created

2. **Storage Setup**
   - [ ] Create profile-images bucket
   - [ ] Set bucket to public
   - [ ] Apply storage policies

3. **Profile Functionality**
   - [ ] Navigate to `/profile` while logged in
   - [ ] Edit display name and save
   - [ ] Edit bio and save
   - [ ] Edit location and save
   - [ ] Add clubs/schools (comma-separated) and save
   - [ ] Upload avatar image
   - [ ] Verify avatar appears correctly

4. **Tabs & Lists**
   - [ ] Switch between Sessions and Drills tabs
   - [ ] Verify sessions list displays correctly
   - [ ] Verify drills list shows Created and Upvoted tabs
   - [ ] Click session card → navigates to session detail
   - [ ] Click drill card → navigates to drill detail

5. **Public Profiles**
   - [ ] Visit `/profile/[another-user-id]`
   - [ ] Verify you can't edit other user's profiles
   - [ ] Verify public sessions are visible
   - [ ] Visit `/profile/invalid-id` → should show 404 state

6. **Stats Accuracy**
   - [ ] Create a session → verify Sessions count increases
   - [ ] Post a drill → verify Drills count increases
   - [ ] Have someone upvote your content → verify Upvotes count increases
   - [ ] Check Boot Room Age calculation

## 📝 Next Steps

After testing the profile pages:

1. **Add Navigation Link**
   - Update Navigation component to include link to `/profile`
   - Consider adding user avatar dropdown in nav bar

2. **Link Author Names**
   - In SessionCard, DrillCard, and comments: link author names to `/profile/[id]`

3. **Enhance Social Links**
   - Implement actual social link storage and display
   - Add platforms: Twitter, LinkedIn, Instagram, YouTube, Website

4. **License Verification**
   - Build admin interface for license verification
   - Add upload functionality for license documents

## 🐛 Known Limitations

- Social Links are UI placeholders only (not functional yet)
- Licenses are view-only (no upload/edit yet)
- Avatar upload requires storage bucket setup first
- Stats calculation happens client-side (could be optimized with a view/function)
