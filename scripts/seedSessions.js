import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function seedSessions() {
  console.log('Starting to seed mock sessions...')

  // First, get some drills from the database
  const { data: drills, error: drillsError } = await supabase
    .from('drills')
    .select('id, title')
    .limit(30)

  if (drillsError) {
    console.error('Error fetching drills:', drillsError)
    return
  }

  console.log(`Found ${drills.length} drills to work with`)

  // Get the first user (or use null for system-created sessions)
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id')
    .limit(1)

  const authorId = profiles?.[0]?.id || null

  // Define mock sessions
  const sessions = [
    {
      title: "U12 Possession & Finishing Focus",
      description: "Technical session combining possession work with finishing opportunities. Focus on maintaining possession under pressure and converting chances in the final third.",
      author_id: authorId,
      is_public: true,
      drills: ['warm-01', 'poss-01', 'fin-01', 'fin-02'] // warm-up, rondo, 1v1 to goal, crossing
    },
    {
      title: "High-Intensity Pressing Session",
      description: "Defensive-focused session working on team pressing, defensive transitions, and counter-attacking from turnovers.",
      author_id: authorId,
      is_public: true,
      drills: ['warm-02', 'def-02', 'poss-02', 'fin-01'] // passing gates, channel defending, possession grid, finishing
    },
    {
      title: "Technical Development Circuit",
      description: "Individual skill development session focused on ball mastery, dribbling, and technical excellence. Perfect for younger age groups.",
      author_id: authorId,
      is_public: true,
      drills: ['warm-01', 'tech-01', 'tech-02', 'pass-01'] // dynamic stretching, technical circuit, four corners, triangle passing
    },
    {
      title: "Match Preparation: Build-Up Play",
      description: "Pre-match session emphasizing build-up patterns, possession retention, and creating scoring opportunities through combination play.",
      author_id: authorId,
      is_public: true,
      drills: ['warm-02', 'pass-01', 'poss-01', 'poss-02', 'fin-02'] // passing gates, triangle passing, rondo, possession grid, crossing
    },
    {
      title: "Defending & Counter-Attack Workshop",
      description: "Complete defensive session covering individual defending, team defensive shape, and transitioning quickly to attack after winning possession.",
      author_id: authorId,
      is_public: true,
      drills: ['warm-01', 'def-01', 'def-02', 'fin-01'] // dynamic stretching, shadow work, channel defending, 1v1 to goal
    },
    {
      title: "Small-Sided Games Masterclass",
      description: "Game-realistic session using rondos and possession games to develop decision-making, awareness, and technical execution under pressure.",
      author_id: authorId,
      is_public: true,
      drills: ['warm-02', 'poss-01', 'poss-02', 'tech-01'] // passing gates, 4v2 rondo, possession grid, technical circuit
    }
  ]

  for (const sessionData of sessions) {
    try {
      // Find the actual drill IDs from the database based on our reference IDs
      const drillIds = []
      let totalDuration = 0

      for (const drillRef of sessionData.drills) {
        const drill = drills.find(d => d.title.toLowerCase().includes(getDrillKeyword(drillRef)))
        if (drill) {
          const defaultDuration = getDefaultDuration(drillRef)
          drillIds.push({ id: drill.id, duration: defaultDuration })
          totalDuration += defaultDuration
        }
      }

      if (drillIds.length === 0) {
        console.log(`⚠️  Skipping "${sessionData.title}" - no matching drills found`)
        continue
      }

      // Create the session
      const { data: session, error: sessionError } = await supabase
        .from('sessions')
        .insert({
          title: sessionData.title,
          description: sessionData.description,
          author_id: sessionData.author_id,
          is_public: sessionData.is_public,
          total_duration: totalDuration,
          created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() // Random date within last week
        })
        .select()
        .single()

      if (sessionError) {
        console.error(`Error creating session "${sessionData.title}":`, sessionError)
        continue
      }

      // Add drills to the session
      const sessionDrills = drillIds.map((drill, index) => ({
        session_id: session.id,
        drill_id: drill.id,
        order_index: index,
        custom_duration: drill.duration
      }))

      const { error: drillsError } = await supabase
        .from('session_drills')
        .insert(sessionDrills)

      if (drillsError) {
        console.error(`Error adding drills to "${sessionData.title}":`, drillsError)
      } else {
        console.log(`✅ Created "${sessionData.title}" with ${drillIds.length} drills (${totalDuration} min)`)
      }

    } catch (error) {
      console.error(`Error processing session "${sessionData.title}":`, error)
    }
  }

  console.log('\n🎉 Session seeding complete!')
}

function getDrillKeyword(drillRef) {
  const keywords = {
    'warm-01': 'dynamic stretching',
    'warm-02': 'passing gates',
    'poss-01': 'rondo',
    'poss-02': 'possession grid',
    'fin-01': '1v1 to goal',
    'fin-02': 'crossing',
    'def-01': 'shadow',
    'def-02': 'channel defending',
    'tech-01': 'technical circuit',
    'tech-02': 'four corner',
    'pass-01': 'triangle passing'
  }
  return keywords[drillRef] || drillRef
}

function getDefaultDuration(drillRef) {
  const durations = {
    'warm-01': 10,
    'warm-02': 15,
    'poss-01': 20,
    'poss-02': 25,
    'fin-01': 20,
    'fin-02': 30,
    'def-01': 15,
    'def-02': 20,
    'tech-01': 20,
    'tech-02': 15,
    'pass-01': 15
  }
  return durations[drillRef] || 15
}

seedSessions()
