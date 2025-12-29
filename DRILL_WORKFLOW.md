# Drill Addition Workflow

## Quick Start

When you find a drill on Twitter/X, paste the tweet text here and say:

> "Add this drill: [paste tweet text]"

I will:
1. Create the drill JSON entry
2. Generate an SVG diagram using the template
3. Add to `drills.json`
4. You run the sync command

---

## What I Need From You

Paste the drill info in any format. At minimum:
- **Drill name**
- **Field dimensions** (e.g., 24x30 yards)
- **Number of players/teams** (e.g., 6v6 + 3 neutrals)
- **Rules/scoring** (e.g., 8 passes = 1 point)

Optional but helpful:
- Equipment needed
- Coaching points
- Progressions
- Source/author credit

---

## Diagram Template

All diagrams use this consistent style:

### Colors (matches site theme)
| Role | Color | Hex |
|------|-------|-----|
| Team A | Cyan | #00D9FF |
| Team B | Red | #EF4444 |
| Neutrals | Amber | #F59E0B |
| Team C (if needed) | Purple | #A855F7 |
| Team D (if needed) | Green | #10B981 |
| Goalkeeper | Pink | #EC4899 |

### Layout
- Dark background (#1a1a1a)
- Field dimensions labeled outside with bracket lines
- Green field with white border
- Simple white soccer ball
- Players as colored circles (r=15)
- Evenly spaced legend at bottom

### File Location
`/public/images/drills/[drill-name].svg`

---

## Drill JSON Format

```json
{
  "id": "category-xx",
  "name": "Drill Name",
  "component": "Possession|Finishing|Defending|Warm-up|etc",
  "skillFocus": ["Skill 1", "Skill 2"],
  "difficulty": "Beginner|Intermediate|Advanced",
  "description": "Full description of the drill...",
  "duration": 20,
  "equipment": ["Cones", "Balls", "Bibs"],
  "diagramImageUrl": "/images/drills/drill-name.svg",
  "setupInstructions": [
    "Step 1...",
    "Step 2..."
  ],
  "coachingPoints": [
    "Point 1...",
    "Point 2..."
  ],
  "progressions": [
    "Progression 1...",
    "Progression 2..."
  ],
  "author": "Coach Name (@handle)",
  "sourceUrl": "https://x.com/..."
}
```

---

## After I Create The Drill

### 1. Sync to Database
```bash
node scripts/syncDrills.js
```

### 2. Deploy to Production
```bash
git add .
git commit -m "Add [drill name] drill"
git push
```

---

## Where Fields Display

### DrillModal (Preview popup)
- ✅ Equipment
- ✅ Setup Instructions
- ✅ Coaching Points
- ✅ Progressions
- ✅ Source Attribution
- ❌ Diagram (not shown here)

### Individual Drill Page (/drills/[id])
- ✅ Diagram (right column)
- ✅ Equipment
- ✅ Setup Instructions
- ✅ Coaching Points
- ✅ Progressions
- ✅ Source Attribution

### Drill Card (feed)
- ❌ These details don't show (just title, description, category tag)

---

## Database Fields

These columns exist in the `drills` table:
- `title` - Drill name
- `description` - Full description
- `skill_tags` - Array of skills
- `media_url` - Path to SVG diagram
- `category` - Possession, Finishing, etc.
- `duration` - Minutes
- `difficulty` - Beginner/Intermediate/Advanced
- `equipment` - Array of items
- `setup_instructions` - Array of steps
- `coaching_points` - Array of points
- `progressions` - Array of progressions
- `author_name` - Credit
- `source_url` - Original link

---

## Example Session

**You paste:**
> Add this drill: 6v6 + 3 Counter Pressing. 24x30 yards. 8 passes = 1 point. Can only use neutrals after pass 2. From @mattdanaher

**I create:**
1. SVG diagram at `/public/images/drills/counter-pressing-6v6.svg`
2. JSON entry in `app/data/drills.json`

**You run:**
```bash
node scripts/syncDrills.js
git add . && git commit -m "Add counter pressing drill" && git push
```

**Done.** Drill is live with diagram and all details.
