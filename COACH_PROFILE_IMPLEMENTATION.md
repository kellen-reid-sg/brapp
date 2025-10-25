# Coach Profile Card - Implementation Guide

## ✅ Simple Version (COMPLETED)

### What You Need to Do

1. **Run the SQL in Supabase:**
   - Open Supabase SQL Editor
   - Run the contents of `/scripts/add-coach-profile-fields.sql`
   - This adds 4 new fields to the `profiles` table:
     - `coaching_experience` (text)
     - `licenses` (text)
     - `specialties` (text)
     - `current_club` (text)

2. **Test the Feature:**
   - Click on any drill card to open the drill modal
   - Click on the author name (it's now underlined and clickable)
   - The coach profile card will appear showing:
     - Avatar (first letter of name)
     - Display name
     - Drills posted count
     - Upvotes received count
     - Current club (if added)
     - Coaching licenses (if added)
     - Experience (if added)
     - Specialties (if added)

3. **Add Your Own Profile Info:**
   - You'll need to create a profile settings page later
   - For now, you can manually update via Supabase dashboard:
     - Go to Table Editor → profiles
     - Find your user row
     - Edit the new fields with sample data

### How It Works

- **Click author name** in drill modal → Opens coach profile modal
- **Two modals** can be open (drill modal + profile modal)
- **Stats calculated** from database (drills posted, upvotes received)
- **Self-reported** credentials (no verification yet)

### Mobile Behavior

- Profile modal appears centered on screen
- Overlays the drill modal (higher z-index)
- Click backdrop or X button to close

---

## 🚀 Advanced Version (Future - Phase 3)

See PROJECT_PLAN.md for full details. Includes:
- XP & Levels system
- Badge achievements
- Leaderboards
- Credential verification
- Activity tracking
- Admin approval system

### When to Build This

Only after:
1. ✅ You have 50+ active users
2. ✅ Users are requesting credibility features
3. ✅ You've validated coaches want gamification
4. ✅ You have time for 2-3 week implementation

---

## 📝 Future Enhancements (Simple Version)

Before building the advanced version, consider:

1. **Profile Edit Page**
   - Let users update their credentials
   - `/profile/edit` page

2. **Avatar Upload**
   - Replace letter avatar with uploaded image
   - Use Supabase Storage

3. **Social Links**
   - Add Twitter, LinkedIn, website fields
   - Display as icons in profile card

4. **Public Profile Page**
   - `/profile/[id]` route
   - Shows all drills/sessions by coach
   - Full profile view

5. **Verification Badge**
   - Simple "Verified Coach" badge
   - Admin manually approves

---

## 🐛 Known Limitations (Simple Version)

1. **No profile editing UI** - Users must update via Supabase dashboard
2. **No verification** - Anyone can claim any credentials
3. **No sessions count** - Only shows drills posted
4. **No avatar upload** - Just shows first letter
5. **Anonymous drills** - Won't have author_id, profile won't open

These will be addressed in future iterations.
