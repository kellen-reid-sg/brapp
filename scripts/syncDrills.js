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
  process.env.SUPABASE_SERVICE_KEY
)

async function syncDrills() {
  console.log(`🔄 Syncing ${drills.length} drills from JSON...`)
  
  // Get existing drills by title
  const { data: existing } = await supabase
    .from('drills')
    .select('title')
  
  const existingTitles = new Set(existing?.map(d => d.title) || [])
  
  // Filter to only new drills
  const newDrills = drills.filter(drill => !existingTitles.has(drill.name))
  
  if (newDrills.length === 0) {
    console.log('✅ All drills already in database.')
    
    // Update existing drills
    console.log('🔄 Updating existing drills...')
    for (const drill of drills) {
      if (existingTitles.has(drill.name)) {
        const { error } = await supabase
          .from('drills')
          .update({
            description: drill.description,
            skill_tags: drill.skillFocus || [],
            media_url: drill.diagramImageUrl || null,
            category: drill.component || null,
            duration: drill.duration || null,
            difficulty: drill.difficulty || null,
            equipment: drill.equipment || [],
            setup_instructions: drill.setupInstructions || [],
            coaching_points: drill.coachingPoints || [],
            progressions: drill.progressions || [],
            author_name: drill.author || null,
            source_url: drill.sourceUrl || null
          })
          .eq('title', drill.name)
        
        if (error) {
          console.error(`   ❌ Failed to update: ${drill.name}`, error.message)
        }
      }
    }
    console.log('✅ Updated all existing drills.')
    return
  }
  
  console.log(`📝 Found ${newDrills.length} new drills to add...`)
  
  const mappedDrills = newDrills.map(drill => ({
    title: drill.name,
    description: drill.description,
    skill_tags: drill.skillFocus || [],
    media_url: drill.diagramImageUrl || null,
    category: drill.component || null,
    duration: drill.duration || null,
    difficulty: drill.difficulty || null,
    equipment: drill.equipment || [],
    setup_instructions: drill.setupInstructions || [],
    coaching_points: drill.coachingPoints || [],
    progressions: drill.progressions || [],
    author_name: drill.author || null,
    source_url: drill.sourceUrl || null,
    author_id: null
  }))

  const { data, error } = await supabase
    .from('drills')
    .insert(mappedDrills)
    .select()
  
  if (error) {
    console.error('❌ Error syncing drills:', error)
    process.exit(1)
  } else {
    console.log(`✅ Added ${data.length} new drills:`)
    data.forEach(d => console.log(`   - ${d.title}`))
  }
}

syncDrills()
