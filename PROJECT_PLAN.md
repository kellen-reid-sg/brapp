# Boot Room MVP Project Plan (v2.0)
## 🎯 4-Week Path to Launch

**Last Updated:** January 2025  
**Goal:** Ship a mobile-first Reddit-style drill feed + dead-simple session builder  
**Timeline:** 4 weeks to testable MVP with real users

---

## 🔥 Core Principle: Ship Fast, Validate Fast

**What We're Building:**
- Reddit-style drill feed with upvotes, comments, sorting
- Dead-simple session builder (no wizard, no complexity)
- Shareable public sessions
- Basic user profiles

**What We're NOT Building (Yet):**
- Sandbox drill editor (Phase 3 - months away)
- Advanced drag-and-drop
- Admin CMS
- PDF exports
- Team features

---

## 📐 Architecture

### Tech Stack (Keep It Simple)
- **Frontend:** Next.js App Router
- **Backend:** Supabase (auth + database + storage)
- **Styling:** Tailwind CSS only
- **Deployment:** Vercel

**NO complex libraries:** No shadcn/ui, no Framer Motion, no fancy drag-and-drop yet.

### Database Schema (Simplified)

```sql
-- Core tables only
users (Supabase auth handles this)
profiles (id, display_name, avatar_url, bio, created_at)
drills (id, author_id, title, description, skill_tags[], media_url, created_at)
sessions (id, author_id, title, description, total_duration, is_public, created_at)
session_drills (id, session_id, drill_id, order_index, custom_duration, notes)
votes (id, user_id, content_kind, content_id, value, unique constraint)
comments (id, user_id, content_kind, content_id, body, created_at)
```

### Page Structure

```
3 CORE PAGES:
├── /drills - Reddit-style feed (Hot/New/Top)
├── /sessions/new - Session builder
└── /profile - User's content + settings

SUPPORTING PAGES:
├── / - Landing page (2 CTAs: Browse Drills / Build Session)
├── /auth/login & /auth/signup - Authentication
├── /drills/[id] - Drill detail with comments
├── /sessions/[id] - Public session view
└── /profile/[id] - Public user profile (optional)
```

---

## 📅 Week 1: Foundation (Database + Auth + Basic Feed)

### 🎯 Goal
Working database with RLS, seed drills, authentication, and a basic /drills feed visible on mobile.

### Day 1: Database Schema Setup

**Task:** Run complete schema in Supabase SQL Editor

<details>
<summary>📋 Click to view full SQL schema</summary>

```sql
-- 1) Types
create type content_type as enum ('drill','session');

-- 2) Profiles (public read, owners edit)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "profiles are readable by everyone"
on profiles for select using (true);

create policy "users can upsert own profile"
on profiles for insert with check (auth.uid() = id);

create policy "users can update own profile"
on profiles for update using (auth.uid() = id);

-- Optional: auto-insert profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name','Coach'));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- 3) Drills (public read)
create table if not exists drills (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references auth.users(id) on delete set null,
  title text not null,
  description text,
  skill_tags text[] default '{}',
  media_url text,
  created_at timestamptz default now()
);
alter table drills enable row level security;

create policy "drills are public readable"
on drills for select using (true);

create policy "auth users can insert drills"
on drills for insert with check (auth.uid() = author_id);

create policy "authors can update/delete own drills"
on drills for update using (auth.uid() = author_id);
create policy "authors can delete own drills"
on drills for delete using (auth.uid() = author_id);

-- 4) Sessions (public shareable via is_public)
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references auth.users(id) on delete set null,
  title text not null,
  description text,
  total_duration integer default 0,
  is_public boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table sessions enable row level security;

create policy "sessions public readable if public or owner"
on sessions for select using (is_public or auth.uid() = author_id);

create policy "auth users can insert sessions"
on sessions for insert with check (auth.uid() = author_id);

create policy "authors can update/delete own sessions"
on sessions for update using (auth.uid() = author_id);
create policy "authors can delete own sessions"
on sessions for delete using (auth.uid() = author_id);

-- 5) Session drills (composition)
create table if not exists session_drills (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  drill_id uuid not null references drills(id) on delete restrict,
  order_index integer not null,
  custom_duration integer,
  notes text,
  created_at timestamptz default now()
);
alter table session_drills enable row level security;

create policy "read session drills if session is public or owner"
on session_drills for select using (
  exists (
    select 1 from sessions s
    where s.id = session_drills.session_id
      and (s.is_public or s.author_id = auth.uid())
  )
);

create policy "insert/update/delete session drills only by session owner"
on session_drills for all using (
  exists (
    select 1 from sessions s
    where s.id = session_drills.session_id
      and s.author_id = auth.uid()
  )
) with check (
  exists (
    select 1 from sessions s
    where s.id = session_drills.session_id
      and s.author_id = auth.uid()
  )
);

-- 6) Votes (single table for drills and sessions)
create table if not exists votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content_kind content_type not null,
  content_id uuid not null,
  value smallint not null check (value in (-1, 1)),
  created_at timestamptz default now(),
  unique (user_id, content_kind, content_id)
);
alter table votes enable row level security;

create policy "votes are readable by everyone" on votes for select using (true);
create policy "users manage own votes"
on votes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 7) Comments (flat, no threading in MVP)
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content_kind content_type not null,
  content_id uuid not null,
  body text not null,
  created_at timestamptz default now()
);
alter table comments enable row level security;

create policy "comments are readable by everyone" on comments for select using (true);
create policy "users can insert comments" on comments for insert with check (auth.uid() = user_id);
create policy "users can update/delete own comments"
on comments for update using (auth.uid() = user_id);
create policy "users can delete own comments"
on comments for delete using (auth.uid() = user_id);

-- 8) Helpful indexes
create index on drills (created_at desc);
create index on sessions (created_at desc);
create index votes_lookup on votes (content_kind, content_id);
create index comments_lookup on comments (content_kind, content_id);

-- 9) Simple stats views
create or replace view drill_stats as
select
  d.id,
  coalesce(sum(case when v.value is null then 0 else v.value end), 0) as score,
  coalesce(count(c.id),0) as comment_count
from drills d
left join votes v on v.content_kind = 'drill' and v.content_id = d.id
left join comments c on c.content_kind = 'drill' and c.content_id = d.id
group by d.id;

create or replace view session_stats as
select
  s.id,
  coalesce(sum(case when v.value is null then 0 else v.value end), 0) as score,
  coalesce(count(c.id),0) as comment_count
from sessions s
left join votes v on v.content_kind = 'session' and v.content_id = s.id
left join comments c on c.content_kind = 'session' and c.content_id = s.id
group by s.id;
```

</details>

**Deliverable:** ✅ All tables created, RLS policies enabled, indexes in place

### Day 2: Supabase Client + Auth Guard

**Tasks:**
1. Create `app/lib/supabaseClient.js`:
```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

2. Update `middleware.js` to protect `/sessions` and `/profile`:
```javascript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  const protectedRoutes = ['/sessions', '/profile']
  const isProtected = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )

  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  return res
}
```

3. Verify login/signup pages work (should already exist from previous work)

**Deliverable:** ✅ Auth working; protected routes redirect to login

### Day 3: Seed Drills from JSON

**Task:** Create `scripts/seedDrills.js` to migrate existing drill data

```javascript
import { createClient } from '@supabase/supabase-js'
import drills from '../app/data/drills.json' assert { type: 'json' }

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Use service key for seeding
)

async function seedDrills() {
  console.log(`Seeding ${drills.length} drills...`)
  
  const mappedDrills = drills.map(drill => ({
    title: drill.name,
    description: drill.description,
    skill_tags: drill.skill_focus || [],
    media_url: drill.diagram_image_url || null,
    author_id: null // Seed drills have no author
  }))

  const { data, error } = await supabase
    .from('drills')
    .insert(mappedDrills)
  
  if (error) {
    console.error('Error seeding drills:', error)
  } else {
    console.log(`✅ Successfully seeded ${data.length} drills`)
  }
}

seedDrills()
```

**Run:** `node scripts/seedDrills.js`

**Deliverable:** ✅ 60+ drills in database

### Day 4: /drills Feed (New Sort)

**Task:** Create basic drill feed page

**Files to create:**
- `app/drills/page.jsx` - Main feed page
- `components/DrillCard.jsx` - Drill preview card
- `components/SortTabs.jsx` - Hot/New/Top tabs
- `components/VoteButtons.jsx` - Upvote UI (stub for now)

**Example `app/drills/page.jsx`:**
```javascript
'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
import DrillCard from '@/components/DrillCard'
import SortTabs from '@/components/SortTabs'

export default function DrillsPage() {
  const [drills, setDrills] = useState([])
  const [sort, setSort] = useState('new')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDrills()
  }, [sort])

  async function fetchDrills() {
    setLoading(true)
    
    let query = supabase
      .from('drills')
      .select(`
        *,
        drill_stats!inner(score, comment_count)
      `)
      .limit(25)
    
    if (sort === 'new') {
      query = query.order('created_at', { ascending: false })
    } else if (sort === 'top') {
      query = query.order('drill_stats(score)', { ascending: false })
    }
    
    const { data, error } = await query
    
    if (!error) setDrills(data)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Drill Library</h1>
        
        <SortTabs active={sort} onChange={setSort} />
        
        <div className="space-y-4 mt-6">
          {loading ? (
            <div>Loading...</div>
          ) : (
            drills.map(drill => (
              <DrillCard key={drill.id} drill={drill} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
```

**Deliverable:** ✅ Mobile-first drill feed showing seeded drills

### Day 5: Drill Detail Page

**Task:** Create drill detail view with comments (read-only)

**Files:**
- `app/drills/[id]/page.jsx` - Drill detail page
- `components/CommentList.jsx` - Display comments

**Deliverable:** ✅ Click drill → see full detail + comments

**🎯 Week 1 Success Criteria:**
- [ ] Auth working (login/signup/logout)
- [ ] Public /drills feed shows seeded drills
- [ ] /drills/[id] loads drill detail
- [ ] DB policies allow public read
- [ ] Mobile-responsive layout
- [ ] Project builds without errors

---

## 📅 Week 2: Community Features (Voting + Comments + Sorting)

### 🎯 Goal
Reddit-like interactions: upvotes, comments, and Hot/New/Top sorting

### Day 6: Implement Upvoting

**Tasks:**
1. Update `components/VoteButtons.jsx` with real functionality:
```javascript
'use client'
import { useState } from 'react'
import { supabase } from '@/app/lib/supabaseClient'

export default function VoteButtons({ contentKind, contentId, initialScore, userVote }) {
  const [score, setScore] = useState(initialScore)
  const [voted, setVoted] = useState(userVote)

  async function handleVote(value) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      alert('Please log in to vote')
      return
    }

    // Optimistic update
    const newVote = voted === value ? null : value
    setVoted(newVote)
    setScore(score + (newVote || 0) - (voted || 0))

    // Upsert vote
    if (newVote === null) {
      await supabase
        .from('votes')
        .delete()
        .eq('user_id', user.id)
        .eq('content_kind', contentKind)
        .eq('content_id', contentId)
    } else {
      await supabase
        .from('votes')
        .upsert({
          user_id: user.id,
          content_kind: contentKind,
          content_id: contentId,
          value: newVote
        }, { onConflict: 'user_id,content_kind,content_id' })
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleVote(1)}
        className={`p-2 ${voted === 1 ? 'text-green-600' : 'text-gray-400'}`}
      >
        ▲
      </button>
      <span className="font-bold">{score}</span>
      <button
        onClick={() => handleVote(-1)}
        className={`p-2 ${voted === -1 ? 'text-red-600' : 'text-gray-400'}`}
      >
        ▼
      </button>
    </div>
  )
}
```

**Deliverable:** ✅ Upvote/downvote works with optimistic UI

### Day 7: Implement Comments

**Tasks:**
1. Create `components/CommentForm.jsx`
2. Update `components/CommentList.jsx` to allow posting
3. Add real-time comment refresh

**Deliverable:** ✅ Users can post comments on drills

### Day 8: Hot/Top Sorting

**Task:** Implement Hot algorithm for sorting

**Add to Supabase (function for hot score):**
```sql
create or replace function get_hot_drills(lim integer default 25)
returns table (
  id uuid,
  author_id uuid,
  title text,
  description text,
  skill_tags text[],
  media_url text,
  created_at timestamptz,
  score bigint,
  comment_count bigint,
  hot_score numeric
) as $$
begin
  return query
  select 
    d.*,
    ds.score,
    ds.comment_count,
    (ds.score::float + extract(epoch from (now() - d.created_at)) / -45000.0) as hot_score
  from drills d
  join drill_stats ds on ds.id = d.id
  order by hot_score desc
  limit lim;
end;
$$ language plpgsql;
```

**Update feed to call RPC for Hot sort:**
```javascript
const { data } = await supabase.rpc('get_hot_drills', { lim: 25 })
```

**Deliverable:** ✅ Sort tabs work (Hot/New/Top)

### Day 9: Polish Drill Detail

**Tasks:**
- Add "Share" button (copy link)
- Show upvote status for logged-in users
- Improve mobile layout
- Handle long descriptions

**Deliverable:** ✅ Professional drill detail page

### Day 10: QA Week 2

**Testing Checklist:**
- [ ] Vote toggles correctly
- [ ] Comments post and display
- [ ] Sort changes query correctly
- [ ] Login required prompts work
- [ ] Mobile UX smooth

**Deliverable:** ✅ Week 2 features stable

**🎯 Week 2 Success Criteria:**
- [ ] Users can upvote/downvote drills
- [ ] Users can comment on drills
- [ ] Hot/New/Top sorting works correctly
- [ ] Mobile experience is smooth
- [ ] Login prompts appear for auth-required actions

---

## 📅 Week 3: Session Builder + Profile (The Big Week)

### 🎯 Goal
Dead-simple session builder, save/share sessions, votes/comments on sessions, basic profile

### Day 11: Session Builder Scaffold ✅ COMPLETED

**Files created:**
- ✅ `app/sessions/new/page.jsx` - Builder page with split-view layout
- ✅ `components/SessionBuilder.jsx` - Right panel: session canvas
- ✅ `components/DrillListSidebar.jsx` - Left panel: searchable drills

**Features implemented:**
- ✅ Split-view layout (50/50 grid, 16px gap)
- ✅ Background image (background-training-foto.png)
- ✅ Search drills functionality
- ✅ Age Group & Category dropdown filters (matching drill library)
- ✅ Favorites filter toggle
- ✅ Drill preview modal with "Add to Session" button
- ✅ Click drill card to add/remove from session (toggle)
- ✅ Preview tooltip on hover
- ✅ Green checkmark for selected drills
- ✅ Custom scrollbar styling (translucent)

**Deliverable:** ✅ UI scaffold with local state

### Day 12: Add/Remove/Reorder Drills ✅ COMPLETED

**Features implemented:**
- ✅ Click drill card to add to session
- ✅ Click again to remove from session (toggle functionality)
- ✅ Up/down arrows to reorder drills (NO drag-and-drop)
- ✅ Remove drill button (X) on each drill card
- ✅ Input field for custom duration (per drill)
- ✅ Notes field for each drill (optional)
- ✅ Automatic total duration calculation
- ✅ Session title & description inputs
- ✅ Empty state when no drills selected
- ✅ Numbered drill list (#1, #2, etc.)
- ✅ Category badges on drill cards

**Deliverable:** ✅ Fully interactive builder (client-side only)

### Day 13: Persist Session ✅ COMPLETED

**Features implemented:**
- ✅ Save Session button with validation
- ✅ Requires session title and at least one drill
- ✅ Inserts session record to database
- ✅ Inserts session_drills with order, duration, notes
- ✅ Calculates total_duration automatically
- ✅ Sets is_public: true by default
- ✅ Links to authenticated user as author
- ✅ Redirects to `/sessions/${session.id}` after save
- ✅ Loading state while saving
- ✅ Disabled button when invalid/saving

**Deliverable:** ✅ Sessions save to database

### Day 14: Session View Page

**Task:** Create public session view

**Files:**
- `app/sessions/[id]/page.jsx` - Display saved session

**Query to fetch session:**
```javascript
const { data } = await supabase
  .from('sessions')
  .select(`
    *,
    profiles(display_name, avatar_url),
    session_drills(
      order_index,
      custom_duration,
      notes,
      drills(*)
    ),
    session_stats!inner(score, comment_count)
  `)
  .eq('id', sessionId)
  .single()
```

**Add VoteButtons and Comments (reuse components with `content_kind='session'`)**

**Deliverable:** ✅ Shareable session page with voting/comments

### Day 15: Profile Page

**Task:** Create user profile

**Files:**
- `app/profile/page.jsx` - Own profile
- `components/ProfileHeader.jsx` - Display name, avatar, edit
- `components/SessionList.jsx` - User's sessions
- `components/DrillList.jsx` - User's uploaded drills

**Features:**
- Edit display name inline
- Show user's sessions
- Show user's uploaded drills
- Basic stats (sessions created, drills uploaded)

**Deliverable:** ✅ Working profile page

**🔍 Testing Checkpoint:**
1. Create session from scratch
2. Open share link while logged out
3. Upvote/comment as different user
4. Verify RLS allows/blocks correctly

**🎯 Week 3 Success Criteria:**
- [ ] Coaches can build complete sessions
- [ ] Sessions save and load correctly
- [ ] Session pages are publicly viewable
- [ ] Voting/commenting works on sessions
- [ ] Profile shows user's content
- [ ] Can edit profile info

---

## 📅 Week 4: Polish + Deploy + Beta

### 🎯 Goal
Mobile-first polish, error handling, production deployment, first beta users

### Day 16: Mobile Polish Pass

**Tasks:**
- Ensure 1-column layout on mobile
- Touch targets minimum 44px
- Sticky sort tabs on /drills
- Sticky save bar on /sessions/new
- Review typography and spacing
- Test on actual mobile devices

**Deliverable:** ✅ Smooth mobile experience

### Day 17: Error States + Loading

**Tasks:**
- Add skeleton loaders for lists
- Friendly empty states:
  - No drills found
  - No comments yet
  - No sessions created
- Toast notifications for actions:
  - "Session saved!"
  - "Login required"
  - "Comment posted!"
- Loading spinners for save operations

**Deliverable:** ✅ Professional error/loading UX

### Day 18: Security + RLS Review

**Security Checklist:**
- [ ] All write operations require authentication
- [ ] Anonymous users can read public pages
- [ ] Users can only edit their own content
- [ ] Votes are unique per user/content
- [ ] Input validation on:
  - [ ] Comment length (max 2000 chars)
  - [ ] Session title (max 100 chars)
  - [ ] Duration values (positive integers)

**Test scenarios:**
1. Try to vote while logged out
2. Try to edit someone else's session
3. Try to delete someone else's comment
4. Try SQL injection in comment field

**Deliverable:** ✅ Security verified

### Day 19: Performance + Deploy

**Tasks:**

**1. Performance:**
- Add pagination to drill feed (Load More button)
- Limit comments to 50 per page
- Verify database indexes are used
- Test with larger datasets

**2. Build:**
```bash
npm run build
```
Fix any build errors.

**3. Deploy to Vercel:**
1. Push code to GitHub
2. Import repo in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy
5. Test production URL

**4. Custom domain (optional):**
- Connect domain in Vercel settings

**Deliverable:** ✅ App live on Vercel

### Day 20: Beta QA + Launch

**Final QA Checklist:**

**Mobile Testing:**
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Tablet view

**Feature Testing:**
- [ ] Create account
- [ ] Log in / log out
- [ ] Browse drill feed (all sort modes)
- [ ] Upvote drill
- [ ] Comment on drill
- [ ] Build session from scratch
- [ ] Save session
- [ ] View saved session (logged in)
- [ ] View shared session (logged out)
- [ ] Edit profile
- [ ] View own profile

**Beta Launch:**
1. Create Google Form for feedback
2. Invite 5-10 coaches from your network
3. Send them:
   - Link to app
   - Quick "how to use" guide
   - Feedback form link
4. Monitor for critical bugs
5. Schedule 15-min calls with active users

**Deliverable:** ✅ First beta users testing app

**🎯 Week 4 Success Criteria:**
- [ ] App deployed to production
- [ ] Anonymous users can browse drills/sessions
- [ ] Logged-in users can create sessions
- [ ] Mobile experience is smooth
- [ ] Zero critical bugs
- [ ] 5+ beta users actively testing
- [ ] Feedback collected

---

## 🎨 Component Structure

```
app/
├── layout.jsx
├── page.js (landing)
├── lib/
│   └── supabaseClient.js
├── drills/
│   ├── page.jsx (feed)
│   └── [id]/page.jsx (detail)
├── sessions/
│   ├── new/page.jsx (builder)
│   └── [id]/page.jsx (view)
├── profile/
│   └── page.jsx
├── auth/
│   ├── login/page.jsx
│   └── signup/page.jsx
└── middleware.js

components/
├── SortTabs.jsx
├── DrillCard.jsx
├── VoteButtons.jsx
├── CommentList.jsx
├── CommentForm.jsx
├── DrillListSidebar.jsx
├── SessionCanvas.jsx
├── SessionBuilder.jsx
├── ProfileHeader.jsx
├── SessionList.jsx
└── DrillList.jsx

scripts/
└── seedDrills.js
```

---

## ⚠️ Common Pitfalls to Avoid

### Week 1
- **RLS blocking public reads:** Ensure drill/session select policies use `using (true)` for public access
- **Auth callbacks not working:** Check Supabase redirect URLs in dashboard

### Week 2
- **Duplicate votes:** Handle unique constraint error gracefully (toggle vote instead of error)
- **N+1 queries:** Always join stats views with main query
- **Vote count inflation:** Ensure unique constraint on (user_id, content_kind, content_id)

### Week 3
- **Over-complicating builder:** Keep to simple add/remove/up/down - NO drag-and-drop yet
- **Session RLS too strict:** Public sessions should be viewable by anyone (check is_public flag)
- **Reordering bugs:** Update order_index for ALL drills when one moves

### Week 4
- **Premature optimization:** Focus on working features, not perfect code
- **Scope creep:** Resist adding "just one more feature"
- **Not testing on real devices:** Desktop Chrome DevTools ≠ actual mobile

---

## 📊 MVP Success Metrics

### Technical Metrics
- [ ] 99% uptime (check Vercel analytics)
- [ ] Pages load in < 3 seconds
- [ ] Mobile-responsive on iOS and Android
- [ ] Zero critical bugs after Week 4

### User Metrics
- [ ] Users complete session creation flow
- [ ] Average session contains 3+ drills
- [ ] Users return within 7 days
- [ ] 80%+ positive feedback from beta users

### Business Validation
- [ ] 10+ active beta users
- [ ] 25+ sessions created
- [ ] Users request specific features
- [ ] Clear understanding of monetization path

---

## 🚀 What Comes After MVP

### Phase 2 (Weeks 5-8)
- Search and advanced filtering
- User follows and activity feed
- Drill templates and categories
- Email notifications
- Session templates
- **Drill Modal Enhancement:** Add detailed sections to drill modal (equipment needed, coaching points, variations, setup instructions, diagrams, etc.) - structure TBD based on user needs
- **Coach Profile Card - Simple Version (COMPLETED):** Basic profile modal showing coaching experience, licenses, specialties, current club - self-reported text fields
- **Coach Profile Card - Advanced Version:** Full gamification with XP system, badges, achievements, stats (drills posted, upvotes received, sessions created), leaderboards, credential verification

### Phase 3 (Months 3-6)
- Sandbox drill builder (visual editor)
- Team features (share with roster)
- PDF export
- Analytics dashboard
- Mobile apps (React Native)

#### Coach Profile Gamification System (Advanced)
**Overview:** Full gamification system to build coach credibility and community engagement

**Database Schema:**
```sql
-- Extend profiles table
alter table profiles add column if not exists xp integer default 0;
alter table profiles add column if not exists level integer default 1;
alter table profiles add column if not exists coaching_licenses text[];
alter table profiles add column if not exists age_groups_coached text[];
alter table profiles add column if not exists clubs_schools text[];
alter table profiles add column if not exists years_experience integer;

-- Badges system
create table badges (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  icon_url text,
  criteria jsonb not null,  -- e.g., {"drills_posted": 10}
  tier text,  -- bronze, silver, gold
  created_at timestamptz default now()
);

create table user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  badge_id uuid references badges(id) on delete cascade,
  earned_at timestamptz default now(),
  unique(user_id, badge_id)
);

-- Activity tracking for XP
create table user_activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  activity_type text not null,  -- drill_posted, upvote_received, etc.
  xp_earned integer not null,
  created_at timestamptz default now()
);
```

**Stats to Calculate:**
- **Drills Posted:** COUNT from drills table
- **Upvotes Received:** SUM of positive votes on user's content
- **Downvotes Received:** SUM of negative votes on user's content
- **Sessions Created:** COUNT from sessions table
- **Comments Made:** COUNT from comments table
- **XP Points:** Calculated from activities
- **Level:** Derived from XP thresholds

**Badge Examples:**
- **First Drill:** Post your first drill (Bronze)
- **Drill Master:** Post 50 drills (Gold)
- **Community Leader:** Receive 100 upvotes (Silver)
- **Session Planner:** Create 10 sessions (Bronze)
- **Rising Star:** Reach Level 10 (Silver)
- **Licensed Coach:** Verify coaching license (Gold)

**XP Earning Rules:**
- Post a drill: +10 XP
- Receive upvote on drill: +2 XP
- Post a session: +15 XP
- Comment on content: +1 XP
- Get your comment upvoted: +1 XP
- Daily login: +5 XP

**Verification System:**
- Upload credential documents
- Admin review queue
- Verified badge display
- Trust score calculation

**Implementation Steps:**
1. Create badge assets/icons
2. Build badge earning engine (background job)
3. Create XP calculation service
4. Add level-up notifications
5. Build admin verification dashboard
6. Create public leaderboard
7. Add achievement notifications

---

## 🆘 Getting Help

### When Stuck
1. **Read the error message** - Usually tells you exactly what's wrong
2. **Check RLS policies** - 90% of Supabase issues are RLS-related
3. **Test query in SQL editor** - Verify query works before debugging code
4. **Console.log everything** - See what data you're actually getting

### Useful Resources
- [Supabase Docs](https://supabase.com/docs)
- [Next.js App Router Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [RLS Debugger](https://supabase.com/docs/guides/auth/row-level-security)

---

## ✅ Ready to Start?

**First step:** Week 1, Day 1 - Run the complete database schema in Supabase SQL Editor.

**Remember:** 
- One week at a time
- Test constantly
- Keep it simple
- Ship fast, iterate faster

Good luck! 🚀
