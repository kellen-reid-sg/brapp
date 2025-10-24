import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Read drills from JSON file
const drillsPath = join(__dirname, '../app/data/drills.json')
const drills = JSON.parse(readFileSync(drillsPath, 'utf-8'))

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Use service key to bypass RLS
)

async function seedDrills() {
  console.log(`🌱 Seeding ${drills.length} drills...`)
  
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
    .select()
  
  if (error) {
    console.error('❌ Error seeding drills:', error)
    process.exit(1)
  } else {
    console.log(`✅ Successfully seeded ${data.length} drills`)
  }
}

seedDrills()
