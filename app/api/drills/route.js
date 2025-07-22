import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(request.url)
    
    // Allow filtering by component, difficulty, etc.
    const component = searchParams.get('component')
    const difficulty = searchParams.get('difficulty')
    
    let query = supabase.from('drills').select('*')
    
    if (component) {
      // Handle multiple components (stored as comma-separated string)
      query = query.ilike('component', `%${component}%`)
    }
    if (difficulty) {
      query = query.eq('difficulty', difficulty)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ drills: data || [] })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Failed to fetch drills' }, { status: 500 })
  }
}
