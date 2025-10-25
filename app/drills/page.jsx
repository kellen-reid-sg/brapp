'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
import Navigation from '@/components/Navigation'
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
    
    try {
      // Get current user (if logged in)
      const { data: { user } } = await supabase.auth.getUser()
      
      const { data: drillsData, error } = await supabase
        .from('drills')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(25)
      
      if (error) {
        console.error('Error fetching drills:', error)
        setLoading(false)
        return
      }

    // Get stats for each drill
    const drillsWithStats = await Promise.all(
      drillsData.map(async (drill) => {
        const { data: statsData } = await supabase
          .from('drill_stats')
          .select('*')
          .eq('id', drill.id)
          .single()
        
        // Get user's vote if logged in
        let userVote = null
        if (user) {
          const { data: voteData, error: voteError } = await supabase
            .from('votes')
            .select('value')
            .eq('user_id', user.id)
            .eq('content_kind', 'drill')
            .eq('content_id', drill.id)
            .maybeSingle()
          
          if (!voteError && voteData) {
            userVote = voteData.value
          }
        }
        
        return {
          ...drill,
          drill_stats: statsData || { score: 0, comment_count: 0 },
          user_vote: userVote
        }
      })
    )

      // Sort based on selected option
      let sortedDrills = [...drillsWithStats]
      if (sort === 'hot') {
        // Hot algorithm: score / time_decay
        sortedDrills.sort((a, b) => {
          const aHot = (a.drill_stats.score || 0) / (Math.max(1, (Date.now() - new Date(a.created_at)) / (1000 * 60 * 60)))
          const bHot = (b.drill_stats.score || 0) / (Math.max(1, (Date.now() - new Date(b.created_at)) / (1000 * 60 * 60)))
          return bHot - aHot
        })
      } else if (sort === 'top') {
        sortedDrills.sort((a, b) => (b.drill_stats.score || 0) - (a.drill_stats.score || 0))
      }
      
      setDrills(sortedDrills)
      setLoading(false)
    } catch (error) {
      console.error('Error in fetchDrills:', error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#0a0a0a' }}>
      {/* Blurred Background Layer */}
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: 'url(/images/Gemini_Generated_Image_Ariel_Shot.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(5px) grayscale(30%)',
          WebkitFilter: 'blur(5px) grayscale(30%)',
          opacity: 0.6,
          zIndex: 0
        }}
      />
      
      {/* Fade to Black Gradient Overlay */}
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(10,10,10,1) 0%, rgba(10,10,10,0.85) 30%, rgba(10,10,10,0.60) 60%, rgba(10,10,10,0.50) 100%)',
          zIndex: 1
        }}
      />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <Navigation />

        <main className="max-w-7xl mx-auto px-8 py-8">
        <h2 style={{
          fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
          fontSize: '3.5rem',
          fontWeight: '900',
          fontStyle: 'italic',
          color: 'white',
          textTransform: 'uppercase',
          transform: 'skew(-5deg)',
          marginBottom: '0.5rem'
        }}>
          DRILL LIBRARY
        </h2>
        <p className="text-gray-400 italic text-lg mb-8">Browse community-shared training drills</p>
        
        <SortTabs active={sort} onChange={setSort} />
        
        <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading...</div>
          ) : drills.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No drills found</div>
          ) : (
            drills.map(drill => (
              <DrillCard key={drill.id} drill={drill} />
            ))
          )}
        </div>
      </main>
      </div>
    </div>
  )
}
