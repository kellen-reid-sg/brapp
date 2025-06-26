# Boot Room MVP Project Plan

## 📋 Overview

This project plan will guide you through building The Boot Room from its current state to a fully functional MVP that real users can test. The plan is designed for someone with limited software engineering experience and includes detailed steps and explanations.

**Total Timeline: 7-8 weeks**  
**Goal: Launch MVP with user accounts, session building, and drill library**

---

## 🎯 Current State Analysis

### ✅ What You Already Have
- Next.js application with basic routing
- Landing page with professional styling
- Session creation flow components (partially built)
- 60+ high-quality drills in JSON format
- Responsive design and UI components

### ❌ What's Missing for MVP
- User authentication (login/signup)
- Database to store user data and sessions
- Working session builder that saves data
- User dashboard to view saved sessions
- Mobile-optimized experience

---

## 📅 Phase 1: Backend Foundation (Week 1-2)

### 🎯 Goal
Set up Supabase as your backend database and authentication system.

### 1.1 Supabase Setup (Day 1-2) ✅

**Step 1: Create Supabase Account** ✅
1. Go to [supabase.com](https://supabase.com) and sign up ✅
2. Create a new project (choose a region close to your users) ✅
3. Wait for project to finish setting up (5-10 minutes) ✅

**Step 2: Get Your Keys** ✅
1. In Supabase dashboard, go to Settings → API ✅
2. Copy your `Project URL` and `anon public key` ✅
3. Create `.env.local` file in your project root: ✅
```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**Step 3: Install Supabase in Your Project** ✅
```bash
npm install @supabase/supabase-js @supabase/ssr
```

### 1.2 Database Schema Setup (Day 3-4) ✅

**What This Means:** Think of database tables like Excel spreadsheets. Each table stores different types of information.

**Step 1: Create Tables in Supabase** ✅
Go to Supabase dashboard → Table Editor → Create new table for each:

**Users Table** (Supabase creates this automatically with auth) ✅
- This stores user account information

**Drills Table** ✅
```sql
CREATE TABLE drills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  component TEXT NOT NULL,
  skill_focus TEXT[] NOT NULL,
  difficulty TEXT NOT NULL,
  description TEXT NOT NULL,
  duration INTEGER NOT NULL,
  equipment TEXT[] NOT NULL,
  diagram_image_url TEXT,
  setup_instructions TEXT[] NOT NULL,
  coaching_points TEXT[] NOT NULL,
  progressions TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Sessions Table** ✅
```sql
CREATE TABLE sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  total_duration INTEGER NOT NULL,
  team_size INTEGER NOT NULL,
  skill_level TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Sessions_Drills Table** (connects sessions to drills) ✅
```sql
CREATE TABLE session_drills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  drill_id TEXT REFERENCES drills(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  custom_duration INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Step 2: Set Up Row Level Security (RLS)** ✅
This ensures users can only see their own data.

```sql
-- Enable RLS on all tables ✅
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions_drills ENABLE ROW LEVEL SECURITY;

-- Users can only see their own sessions ✅
CREATE POLICY "Users can view own sessions" ON sessions
  FOR ALL USING (auth.uid() = user_id);

-- Users can only see drills connected to their sessions ✅
CREATE POLICY "Users can view session drills" ON sessions_drills
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM sessions 
      WHERE sessions.id = sessions_drills.session_id 
      AND sessions.user_id = auth.uid()
    )
  );

-- All users can read drills (public drill library) ✅
CREATE POLICY "Public drills read access" ON drills
  FOR SELECT USING (true);
```

### 1.3 Authentication System (Day 5-7) ✅

**Step 1: Create Supabase Client** ✅
Create `app/lib/supabase.js`:
```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Step 2: Create Authentication Pages** ✅
- Create `app/auth/login/page.jsx` - Login form ✅
- Create `app/auth/signup/page.jsx` - Registration form ✅ 
- Create `app/auth/callback/route.js` - Handles auth redirects ✅

**Step 3: Add Protected Routes** ✅
Create `middleware.js` in project root to protect certain pages:
```javascript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  // Protect these routes
  const protectedRoutes = ['/sessions', '/profile', '/library']
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  return res
}
```

---

## 📅 Phase 2: Core Data Layer (Week 2-3)

### 🎯 Goal
Move your drill data into the database and create the backend logic for sessions.

### 2.1 Drill Data Migration (Day 8-10)

**What This Means:** Take your existing drill data from the JSON file and put it into your Supabase database so users can search and filter it.

**Step 1: Create Migration Script**
Create `scripts/migrate-drills.js`:
```javascript
const { createClient } = require('@supabase/supabase-js')
const drillsData = require('../app/data/drills.json')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // You'll need this key from Supabase
)

async function migrateDrills() {
  for (const drill of drillsData) {
    const { error } = await supabase
      .from('drills')
      .insert({
        id: drill.id,
        name: drill.name,
        component: drill.component,
        skill_focus: drill.skillFocus,
        difficulty: drill.difficulty,
        description: drill.description,
        duration: drill.duration,
        equipment: drill.equipment,
        diagram_image_url: drill.diagramImageUrl,
        setup_instructions: drill.setupInstructions,
        coaching_points: drill.coachingPoints,
        progressions: drill.progressions
      })
    
    if (error) console.error('Error inserting drill:', drill.id, error)
    else console.log('Inserted drill:', drill.name)
  }
}

migrateDrills()
```

**Step 2: Run Migration**
```bash
node scripts/migrate-drills.js
```

### 2.2 API Endpoints (Day 11-14)

**What This Means:** Create "endpoints" - these are like phone numbers that your frontend can call to get or save data.

**Step 1: Create Drill API**
Create `app/api/drills/route.js`:
```javascript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { searchParams } = new URL(request.url)
  
  // Allow filtering by component, difficulty, etc.
  const component = searchParams.get('component')
  const difficulty = searchParams.get('difficulty')
  
  let query = supabase.from('drills').select('*')
  
  if (component) query = query.eq('component', component)
  if (difficulty) query = query.eq('difficulty', difficulty)
  
  const { data, error } = await query
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ drills: data })
}
```

**Step 2: Create Sessions API**
Create `app/api/sessions/route.js` for creating and getting sessions
Create `app/api/sessions/[id]/route.js` for updating specific sessions

---

## 📅 Phase 3: Frontend Features (Week 3-5)

### 🎯 Goal
Build the user-facing features that make your app functional.

### 3.1 Session Builder (Day 15-21)

**What This Means:** Create the interface where coaches can build their training sessions by selecting drills.

**Key Components to Build:**
1. **Session Setup Form** - Where users input team size, skill level, duration
2. **Drill Selection Interface** - Browse and filter drills
3. **Session Timeline** - Drag and drop drills to build session
4. **Session Preview** - See the complete session before saving

**Step 1: Update Existing Session Builder**
Your existing `CreateSession` components need to be connected to the database:

**Step 2: Add Real Data Fetching**
Replace hardcoded data with API calls:
```javascript
// In your session builder component
const [drills, setDrills] = useState([])

useEffect(() => {
  async function fetchDrills() {
    const response = await fetch('/api/drills')
    const data = await response.json()
    setDrills(data.drills)
  }
  fetchDrills()
}, [])
```

**Step 3: Add Save Functionality**
```javascript
async function saveSession(sessionData) {
  const response = await fetch('/api/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sessionData)
  })
  
  if (response.ok) {
    router.push('/sessions') // Redirect to user's sessions
  }
}
```

### 3.2 Drill Library Page (Day 22-25)

**Step 1: Create Library Page**
Create `app/library/page.jsx`:
- Search bar for drill names
- Filter buttons for components (warm-up, finishing, etc.)
- Filter by difficulty level
- Grid layout showing drill cards

**Step 2: Drill Detail Modal**
When users click a drill, show a popup with:
- Drill diagram
- Detailed instructions
- Coaching points
- Equipment needed

### 3.3 User Dashboard (Day 26-28)

**Step 1: Create Sessions Dashboard**
Create `app/sessions/page.jsx`:
- List of user's saved sessions
- Search and filter saved sessions
- Quick actions: duplicate, edit, delete
- Session statistics (total time, number of drills)

---

## 📅 Phase 4: User Experience (Week 5-6)

### 🎯 Goal
Make sure the app works great on mobile devices and has professional features.

### 4.1 Mobile Optimization (Day 29-35)

**What This Means:** Ensure your app looks and works great on phones and tablets.

**Key Areas to Focus:**
1. **Touch-Friendly Buttons** - Make buttons big enough for fingers
2. **Responsive Layout** - Content should adapt to screen size
3. **Mobile Navigation** - Easy-to-use menu on small screens
4. **Session Viewing** - Coaches can easily read sessions on field

**Step 1: Test on Mobile**
- Use Chrome DevTools to test different screen sizes
- Test on actual phones/tablets if available

**Step 2: Improve Mobile Experience**
- Add bottom navigation for mobile
- Make drill cards touch-friendly
- Ensure text is readable without zooming

### 4.2 Export Features (Day 36-42)

**Step 1: PDF Export**
Install PDF generation library:
```bash
npm install jspdf html2canvas
```

Create function to generate PDF of session:
```javascript
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export async function generateSessionPDF(sessionElement) {
  const canvas = await html2canvas(sessionElement)
  const imgData = canvas.toDataURL('image/png')
  
  const pdf = new jsPDF()
  pdf.addImage(imgData, 'PNG', 0, 0)
  pdf.save('training-session.pdf')
}
```

**Step 2: Session Sharing**
Create shareable links for sessions:
- Generate unique session URLs
- Allow viewing sessions without login (read-only)

---

## 📅 Phase 5: Testing & Launch Prep (Week 6-7)

### 🎯 Goal
Make sure everything works correctly and prepare for users.

### 5.1 Quality Assurance (Day 43-46)

**Manual Testing Checklist:**
- [ ] User can create account
- [ ] User can log in/out
- [ ] User can build and save session
- [ ] User can view saved sessions
- [ ] User can browse drill library
- [ ] All links work correctly
- [ ] Mobile experience is smooth
- [ ] PDF export works
- [ ] Session sharing works

**Error Testing:**
- Try to break things intentionally
- Test with bad internet connection
- Test with empty data
- Test edge cases (very long session names, etc.)

### 5.2 Performance & Deployment (Day 47-49)

**Step 1: Optimize Performance**
```bash
npm run build  # Check for any build errors
```

**Step 2: Deploy to Vercel**
1. Push code to GitHub
2. Connect Vercel to your GitHub repo
3. Add environment variables in Vercel dashboard
4. Deploy and test live site

---

## 📅 Phase 6: Beta Testing (Week 7-8)

### 🎯 Goal
Get real coaches using your app and collect feedback.

### 6.1 Beta User Recruitment (Day 50-52)

**Where to Find Beta Users:**
- Local soccer clubs
- Coaching Facebook groups
- Soccer coaching forums
- Personal network of coaches

**What to Offer:**
- Free access during beta
- Direct line to developer (you)
- Influence on future features

### 6.2 Feedback Collection (Day 53-56)

**Set Up Analytics:**
- Google Analytics for usage data
- Simple feedback form in app
- Schedule calls with active users

**Key Questions to Ask:**
- What's confusing about the app?
- What features are missing?
- Would you pay for this?
- How does this compare to what you use now?

---

## 🎯 Success Metrics for MVP Launch

### Technical Metrics
- [ ] 99% uptime
- [ ] Page loads in under 3 seconds
- [ ] Mobile-responsive design
- [ ] Zero critical bugs

### User Metrics
- [ ] Users can complete full session creation flow
- [ ] Average session contains 4+ drills
- [ ] Users return to app within 7 days
- [ ] Positive feedback from 80%+ of beta users

### Business Metrics
- [ ] 50+ active beta users
- [ ] 100+ sessions created
- [ ] Clear path to monetization identified

---

## 🚨 Common Pitfalls to Avoid

### Technical Issues
- **Don't skip database design** - Plan your tables carefully upfront
- **Test early and often** - Don't wait until the end to test features
- **Keep it simple** - Resist adding complex features during MVP

### User Experience Issues
- **Mobile-first thinking** - Many coaches will use this on phones
- **Keep drill entry simple** - Don't overwhelm with too many options
- **Fast loading** - Coaches need quick access during training

### Project Management Issues
- **Scope creep** - Stick to MVP features only
- **Perfect is the enemy of good** - Launch with good enough, improve later
- **Get user feedback early** - Don't build in isolation

---

## 📞 Getting Help

### When You Get Stuck
1. **Check the error message** - Often tells you exactly what's wrong
2. **Google the error** - Usually someone has solved it before
3. **Ask ChatGPT/Claude** - Describe your specific problem
4. **Check documentation** - Supabase and Next.js have great docs

### Useful Resources
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Stack Overflow](https://stackoverflow.com) - For specific coding questions
- [YouTube tutorials](https://youtube.com) - Visual learners

---

## ✅ Ready to Start?

**Your first step:** Begin with Phase 1.1 - Create your Supabase account and get familiar with the dashboard. Take it one day at a time, and don't try to rush through multiple phases at once.

**Remember:** This is a marathon, not a sprint. Focus on building something that works well rather than something that has every feature imaginable.

Good luck! 🚀
