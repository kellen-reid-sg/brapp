'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClientComponentClient } from '@/app/lib/supabase'
import SortTabs from '@/components/SortTabs'
import VoteButtons from '@/components/VoteButtons'
import Navigation from '@/components/Navigation'

export default function BrowseSessionsPage() {
  const supabase = createClientComponentClient()
  const [sessions, setSessions] = useState([])
  const [sort, setSort] = useState('new')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSessions()
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
            BROWSE SESSIONS
          </h2>
          <p className="text-gray-400 italic text-lg mb-8">Explore training sessions from coaches worldwide</p>
          
          {/* Sort Tabs */}
          <div style={{ marginBottom: '32px' }}>
            <SortTabs active={sort} onChange={setSort} />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {loading ? (
              <div className="text-center py-8 text-gray-400">Loading...</div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No sessions found</div>
            ) : (
              sessions.map(session => (
                <SessionCard key={session.id} session={session} />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

function SessionCard({ session }) {
  const supabase = createClientComponentClient()
  const [isFavorited, setIsFavorited] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  
  const score = session.session_stats?.score || 0
  const commentCount = session.session_stats?.comment_count || 0
  const drillCount = session.drill_count || 0
  const duration = session.total_duration || 0
  const userVote = session.user_vote || null
  const author = session.profiles?.display_name || 'Anonymous Coach'
  const createdAt = new Date(session.created_at)
  const timeAgo = getTimeAgo(createdAt)

  // Check if session is favorited on mount
  useEffect(() => {
    checkIfFavorited()
  }, [session.id])

  async function checkIfFavorited() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('content_kind', 'session')
      .eq('content_id', session.id)
      .maybeSingle()

    if (!error && data) {
      setIsFavorited(true)
    }
  }

  async function toggleFavorite() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('Please log in to save favorites')
      return
    }

    setIsUpdating(true)

    try {
      if (isFavorited) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('content_kind', 'session')
          .eq('content_id', session.id)

        if (!error) {
          setIsFavorited(false)
        }
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            content_kind: 'session',
            content_id: session.id
          })

        if (!error) {
          setIsFavorited(true)
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div 
      onClick={() => window.location.href = `/sessions/${session.id}`}
      style={{
        backgroundColor: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: '12px',
        padding: '20px',
        transition: 'all 0.2s',
        position: 'relative',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = '#16a34a'}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'}
    >
      {/* Top Right Star/Favorite Icon */}
      <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ position: 'relative' }}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleFavorite()
            }}
            disabled={isUpdating}
            style={{
              padding: '6px',
              backgroundColor: 'transparent',
              border: 'none',
              color: isFavorited ? '#EAB308' : 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#EAB308'
              setShowTooltip(true)
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = isFavorited ? '#EAB308' : 'rgba(255,255,255,0.6)'
              setShowTooltip(false)
            }}
          >
            <svg width="20" height="20" fill={isFavorited ? '#EAB308' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
          {showTooltip && (
            <div style={{
              position: 'absolute',
              bottom: '-32px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0,0,0,0.9)',
              color: 'white',
              padding: '6px 10px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '500',
              whiteSpace: 'nowrap',
              zIndex: 1000,
              pointerEvents: 'none'
            }}>
              Add to Favorites
            </div>
          )}
        </div>
      </div>

      <div className="flex" style={{ gap: '40px' }}>
        <div style={{ 
          width: '80px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <VoteButtons 
            contentKind="session" 
            contentId={session.id} 
            initialScore={score} 
            userVote={userVote} 
          />
        </div>
        
        <div className="flex-1">
          <div className="block group">
            <div className="flex items-center mb-2" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', gap: '10px' }}>
              <span>Posted by <span style={{ color: 'rgba(255,255,255,0.7)' }}>{author}</span></span>
              <span>•</span>
              <span>{timeAgo}</span>
            </div>

            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: 'white',
              fontStyle: 'italic',
              marginBottom: '8px',
              transition: 'color 0.2s'
            }}
            className="group-hover:text-green-500">
              {session.title}
            </h3>
            
            {session.description && (
              <p style={{ 
                color: 'rgba(255,255,255,0.7)', 
                fontSize: '14px',
                lineHeight: '1.5',
                marginBottom: '12px'
              }}>
                {session.description.length > 180 ? session.description.substring(0, 180) + '...' : session.description}
              </p>
            )}
            
            <div className="flex items-center" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', gap: '32px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                {duration} mins
              </span>
              
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {drillCount} drills
              </span>
              
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  window.location.href = `/sessions/${session.id}`
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '13px',
                  cursor: 'pointer',
                  padding: '0',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000)
  
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)}mo ago`
  return `${Math.floor(seconds / 31536000)}y ago`
}
