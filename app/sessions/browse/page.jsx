'use client'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/app/lib/supabase'
import SortTabs from '@/components/SortTabs'
import SessionCard from '@/components/SessionCard'
import Navigation from '@/components/Navigation'
import styles from './Sessions.module.css'

export default function BrowseSessionsPage() {
  const supabase = createClientComponentClient()
  const [sessions, setSessions] = useState([])
  const [sort, setSort] = useState('new')
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(10) // Mobile pagination

  useEffect(() => {
    fetchSessions()
  }, [sort])

  // Reset pagination when sort changes
  useEffect(() => {
    setVisibleCount(10)
  }, [sort])

  async function fetchSessions() {
    setLoading(true)
    
    try {
      // Get current user (if logged in)
      const { data: { user } } = await supabase.auth.getUser()
      
      const { data: sessionsData, error } = await supabase
        .from('sessions')
        .select(`
          *,
          session_drills(id)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(25)
      
      if (error) {
        console.error('Error fetching sessions:', error)
        setLoading(false)
        return
      }

      // Get stats and profile data for each session
      const sessionsWithStats = await Promise.all(
        sessionsData.map(async (session) => {
          const { data: statsData } = await supabase
            .from('session_stats')
            .select('*')
            .eq('id', session.id)
            .single()
          
          // Get profile data if session has an author
          let profileData = null
          if (session.author_id) {
            const { data } = await supabase
              .from('profiles')
              .select('display_name, avatar_url')
              .eq('id', session.author_id)
              .single()
            profileData = data
          }
          
          // Get user's vote if logged in
          let userVote = null
          if (user) {
            const { data: voteData, error: voteError } = await supabase
              .from('votes')
              .select('value')
              .eq('user_id', user.id)
              .eq('content_kind', 'session')
              .eq('content_id', session.id)
              .maybeSingle()
            
            if (!voteError && voteData) {
              userVote = voteData.value
            }
          }
          
          return {
            ...session,
            profiles: profileData,
            session_stats: statsData || { score: 0, comment_count: 0 },
            user_vote: userVote,
            drill_count: session.session_drills?.length || 0
          }
        })
      )

      // Sort based on selected option
      let sortedSessions = [...sessionsWithStats]
      if (sort === 'hot') {
        // Hot algorithm: score / time_decay
        sortedSessions.sort((a, b) => {
          const aHot = (a.session_stats.score || 0) / (Math.max(1, (Date.now() - new Date(a.created_at)) / (1000 * 60 * 60)))
          const bHot = (b.session_stats.score || 0) / (Math.max(1, (Date.now() - new Date(b.created_at)) / (1000 * 60 * 60)))
          return bHot - aHot
        })
      } else if (sort === 'top') {
        sortedSessions.sort((a, b) => (b.session_stats.score || 0) - (a.session_stats.score || 0))
      }
      
      setSessions(sortedSessions)
      setLoading(false)
    } catch (error) {
      console.error('Error in fetchSessions:', error)
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
        <main className={styles.pageMain}>
          <h2 className={styles.pageTitle}>
            BROWSE SESSIONS
          </h2>
          <p className="text-gray-400 italic text-lg mb-8">Explore training sessions from coaches worldwide</p>
          
          {/* Sort Tabs */}
          <div className={styles.sortTabsContainer}>
            <SortTabs active={sort} onChange={setSort} />
          </div>
          
          <div className={styles.sessionsList}>
            {loading ? (
              <div className="text-center py-8 text-gray-400">Loading...</div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No sessions found</div>
            ) : (
              <>
                {sessions.slice(0, visibleCount).map(session => (
                  <SessionCard key={session.id} session={session} />
                ))}
                
                {/* Load More Button (Mobile Only) */}
                {sessions.length > visibleCount && (
                  <div className={styles.loadMoreContainer}>
                    <button
                      onClick={() => setVisibleCount(prev => prev + 10)}
                      className={styles.loadMoreButton}
                    >
                      Load More
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
