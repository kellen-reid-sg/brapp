'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClientComponentClient } from '@/app/lib/supabase'
import VoteButtons from '@/components/VoteButtons'
import CommentList from '@/components/CommentList'
import CommentForm from '@/components/CommentForm'
import Navigation from '@/components/Navigation'
import styles from '../SessionDetail.module.css'

export default function SessionViewPage() {
  const supabase = createClientComponentClient()
  const params = useParams()
  const router = useRouter()
  const [session, setSession] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [userVote, setUserVote] = useState(null)
  const [favoritesCount, setFavoritesCount] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)
  const [expandedDrills, setExpandedDrills] = useState({})
  const [showUpvoteTooltip, setShowUpvoteTooltip] = useState(false)
  const [showFavoriteTooltip, setShowFavoriteTooltip] = useState(false)
  const [showCommentTooltip, setShowCommentTooltip] = useState(false)

  useEffect(() => {
    fetchSession()
    fetchComments()
  }, [params.id])

  async function fetchSession() {
    const { data: { user } } = await supabase.auth.getUser()
    
    // First, try to get just the basic session
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !data) {
      console.error('Error fetching session:', error)
      console.error('Session ID:', params.id)
      console.error('Current user:', user)
      setLoading(false)
      return
    }

    // Fetch profile separately
    if (data.author_id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('id', data.author_id)
        .single()
      
      data.profiles = profile
    }

    // Fetch session drills separately
    const { data: sessionDrills } = await supabase
      .from('session_drills')
      .select('*, drills(*)')
      .eq('session_id', params.id)
      .order('order_index', { ascending: true })

    data.session_drills = sessionDrills || []

    // Get vote stats separately
    const { data: votes } = await supabase
      .from('votes')
      .select('value')
      .eq('content_kind', 'session')
      .eq('content_id', params.id)

    const score = votes?.reduce((sum, v) => sum + v.value, 0) || 0

    // Get comment count separately
    const { count: commentCount } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('content_kind', 'session')
      .eq('content_id', params.id)

    // Get favorites count separately
    const { count: favCount } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('content_kind', 'session')
      .eq('content_id', params.id)

    setFavoritesCount(favCount || 0)

    // Check if current user has favorited this session
    if (user) {
      const { data: userFav } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('content_kind', 'session')
        .eq('content_id', params.id)
        .maybeSingle()
      
      if (userFav) {
        setIsFavorited(true)
      }
    }

    data.session_stats = { score, comment_count: commentCount || 0 }

    // Sort drills by order_index
    if (data.session_drills) {
      data.session_drills.sort((a, b) => a.order_index - b.order_index)
    }

    setSession(data)

    // Get user's vote if logged in
    if (user) {
      const { data: voteData } = await supabase
        .from('votes')
        .select('value')
        .eq('user_id', user.id)
        .eq('content_kind', 'session')
        .eq('content_id', params.id)
        .maybeSingle()
      
      if (voteData) {
        setUserVote(voteData.value)
      }
    }
    
    setLoading(false)
  }

  async function fetchComments() {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles(display_name, avatar_url)
      `)
      .eq('content_kind', 'session')
      .eq('content_id', params.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setComments(data)
    }
  }

  function handleCommentAdded(newComment) {
    setComments([newComment, ...comments])
  }

  async function handleShare() {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: session.title,
          text: session.description,
          url: url
        })
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyToClipboard(url)
        }
      }
    } else {
      copyToClipboard(url)
    }
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
    alert('Link copied to clipboard!')
  }

  function getCategoryFromTitle(title) {
    const lower = title.toLowerCase()
    if (lower.includes('warm') || lower.includes('stretch')) return 'Warm-up'
    if (lower.includes('pass')) return 'Passing'
    if (lower.includes('rondo') || lower.includes('possession')) return 'Possession'
    if (lower.includes('finish') || lower.includes('shoot') || lower.includes('1v1')) return 'Finishing'
    if (lower.includes('defend')) return 'Defending'
    if (lower.includes('dribbl')) return 'Dribbling'
    return 'Technical'
  }

  function getCategoryColor(category) {
    const colors = {
      'Warm-up': { bg: 'rgba(251, 191, 36, 0.15)', border: 'rgba(251, 191, 36, 0.3)', text: '#FCD34D' },
      'Passing': { bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.3)', text: '#60A5FA' },
      'Possession': { bg: 'rgba(139, 92, 246, 0.15)', border: 'rgba(139, 92, 246, 0.3)', text: '#A78BFA' },
      'Finishing': { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.3)', text: '#F87171' },
      'Defending': { bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.3)', text: '#4ADE80' },
      'Dribbling': { bg: 'rgba(236, 72, 153, 0.15)', border: 'rgba(236, 72, 153, 0.3)', text: '#F472B6' },
      'Technical': { bg: 'rgba(34, 211, 238, 0.15)', border: 'rgba(34, 211, 238, 0.3)', text: '#22D3EE' }
    }
    return colors[category] || colors['Technical']
  }

  function toggleDrillExpansion(drillId) {
    setExpandedDrills(prev => ({
      ...prev,
      [drillId]: !prev[drillId]
    }))
  }

  async function toggleFavorite() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      alert('Please log in to favorite sessions')
      return
    }

    if (isFavorited) {
      // Remove favorite
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('content_kind', 'session')
        .eq('content_id', params.id)

      if (!error) {
        setIsFavorited(false)
        setFavoritesCount(favoritesCount - 1)
      }
    } else {
      // Add favorite
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          content_kind: 'session',
          content_id: params.id
        })

      if (!error) {
        setIsFavorited(true)
        setFavoritesCount(favoritesCount + 1)
      }
    }
  }

  function scrollToComments() {
    const commentsSection = document.getElementById('comments-section')
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Session not found</h2>
          <button 
            onClick={() => router.push('/drills')}
            className="text-green-500 hover:underline"
          >
            Back to drills
          </button>
        </div>
      </div>
    )
  }

  const score = session.session_stats?.score || 0
  const commentCount = session.session_stats?.comment_count || 0
  const author = session.profiles?.display_name || 'Anonymous Coach'

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#0a0a0a' }}>
      {/* Blurred Background Layer */}
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: 'url(/images/background-training-foto.png)',
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
        <main className={styles.pageContainer}>
          <button 
            onClick={() => router.push('/sessions/browse')}
            className={styles.backButton}
            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Session Library
          </button>

          {/* Main Session Card */}
          <div className={styles.sessionCard}>
            {/* Session header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '16px'
            }}>
              <span>Created by <span style={{ color: 'rgba(255,255,255,0.7)' }}>{author}</span></span>
              <span>•</span>
              <span>{new Date(session.created_at).toLocaleDateString()}</span>
            </div>

            {/* Session Title */}
            <h1 style={{
              fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
              fontSize: '32px',
              fontWeight: '900',
              fontStyle: 'italic',
              color: 'white',
              textTransform: 'uppercase',
              marginBottom: session.description ? '12px' : '20px',
              lineHeight: '1.2'
            }}>
              {session.title}
            </h1>

            {/* Description */}
            {session.description && (
              <p style={{ 
                color: 'rgba(255,255,255,0.7)', 
                fontSize: '15px',
                lineHeight: '1.6',
                marginBottom: '16px',
                whiteSpace: 'pre-wrap'
              }}>
                {session.description}
              </p>
            )}

            {/* Session Metadata - Duration & Drill Count */}
            <div className={styles.sessionMetadata}>
              <span className={styles.metadataBadge}>
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                {session.total_duration} mins
              </span>
              <span style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '15px',
                fontWeight: '600',
                color: 'rgba(255,255,255,0.6)'
              }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {session.session_drills?.length || 0} drills
              </span>
            </div>

            {/* Engagement Stats */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(255,255,255,0.08)'
            }}>
              {/* Upvote Button */}
              <div style={{ position: 'relative' }}>
                <button 
                onClick={async () => {
                  const { data: { user } } = await supabase.auth.getUser()
                  if (!user) {
                    alert('Please log in to vote')
                    return
                  }

                  const newVote = userVote === 1 ? null : 1
                  const oldVote = userVote
                  setUserVote(newVote)
                  
                  const newScore = score + (newVote || 0) - (oldVote || 0)
                  setSession({
                    ...session,
                    session_stats: { ...session.session_stats, score: newScore }
                  })

                  if (newVote === null) {
                    await supabase
                      .from('votes')
                      .delete()
                      .eq('user_id', user.id)
                      .eq('content_kind', 'session')
                      .eq('content_id', params.id)
                  } else {
                    await supabase
                      .from('votes')
                      .upsert({
                        user_id: user.id,
                        content_kind: 'session',
                        content_id: params.id,
                        value: newVote
                      }, { onConflict: 'user_id,content_kind,content_id' })
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  backgroundColor: userVote === 1 ? 'rgba(22,163,74,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${userVote === 1 ? 'rgba(22,163,74,0.4)' : 'rgba(255,255,255,0.10)'}`,
                  borderRadius: '6px',
                  color: userVote === 1 ? '#22C55E' : 'rgba(255,255,255,0.7)',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  minWidth: '80px'
                }}
                onMouseEnter={(e) => {
                  setShowUpvoteTooltip(true)
                  if (userVote !== 1) {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'
                  }
                }}
                onMouseLeave={(e) => {
                  setShowUpvoteTooltip(false)
                  if (userVote !== 1) {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'
                  }
                }}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 15l7-7 7 7" />
                </svg>
                {score}
              </button>
              {showUpvoteTooltip && (
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
                  Upvote this session
                </div>
              )}
              </div>

              <div style={{ position: 'relative' }}>
                <button 
                onClick={toggleFavorite}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  backgroundColor: isFavorited ? 'rgba(234, 179, 8, 0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isFavorited ? 'rgba(234, 179, 8, 0.4)' : 'rgba(255,255,255,0.10)'}`,
                  borderRadius: '6px',
                  color: isFavorited ? '#EAB308' : 'rgba(255,255,255,0.7)',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  minWidth: '90px'
                }}
                onMouseEnter={(e) => {
                  setShowFavoriteTooltip(true)
                  if (!isFavorited) {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'
                  }
                }}
                onMouseLeave={(e) => {
                  setShowFavoriteTooltip(false)
                  if (!isFavorited) {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'
                  }
                }}
              >
                <svg width="16" height="16" fill={isFavorited ? '#EAB308' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {favoritesCount}
              </button>
              {showFavoriteTooltip && (
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
                  {isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                </div>
              )}
              </div>

              <div style={{ position: 'relative' }}>
                <button 
                onClick={scrollToComments}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    borderRadius: '6px',
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                      minWidth: '90px'
                  }}
                onMouseEnter={(e) => {
                    setShowCommentTooltip(true)
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'
                  }}
                  onMouseLeave={(e) => {
                    setShowCommentTooltip(false)
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'
                  }}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {commentCount}
                </button>
                {showCommentTooltip && (
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
                    Jump to comments
                  </div>
                )}
              </div>

              <button 
                onClick={handleShare}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  borderRadius: '6px',
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'
                }}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/>
                </svg>
                Share
              </button>
            </div>
          </div>

          {/* Drills List */}
          <div className={styles.drillsListCard}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '700',
              fontStyle: 'italic',
              color: 'white',
              textTransform: 'uppercase',
              marginBottom: '16px'
            }}>
              Session Plan
            </h2>

            {session.session_drills && session.session_drills.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {session.session_drills.map((sessionDrill, index) => {
                  const drill = sessionDrill.drills
                  const category = drill.category || getCategoryFromTitle(drill.title)
                  const categoryColor = getCategoryColor(category)
                  const isExpanded = expandedDrills[drill.id]

                  return (
                    <div
                      key={sessionDrill.id}
                      className={styles.drillItem}
                    >
                      {/* Drill Header - Clickable */}
                      <div 
                        onClick={() => toggleDrillExpansion(drill.id)}
                        className={styles.drillHeader}
                      >
                        <span style={{
                          fontSize: '16px',
                          fontWeight: '700',
                          color: 'rgba(255,255,255,0.5)',
                          minWidth: '30px'
                        }}>
                          #{index + 1}
                        </span>
                        <div style={{ flex: 1 }}>
                          <h3 style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            fontStyle: 'italic',
                            color: 'white',
                            marginBottom: '6px',
                            lineHeight: '1.3'
                          }}>
                            {drill.title}
                          </h3>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            flexWrap: 'wrap'
                          }}>
                            <span style={{ 
                              padding: '3px 10px',
                              backgroundColor: categoryColor.bg,
                              border: `1px solid ${categoryColor.border}`,
                              borderRadius: '4px',
                              color: categoryColor.text,
                              fontSize: '11px',
                              fontWeight: '600'
                            }}>
                              {category}
                            </span>
                            <span style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '13px',
                              fontWeight: '600',
                              color: '#4ADE80'
                            }}>
                              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 6v6l4 2" />
                              </svg>
                              {sessionDrill.custom_duration} mins
                            </span>
                          </div>
                        </div>
                        
                        {/* Expand/Collapse Arrow */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '24px',
                          height: '24px',
                          transition: 'transform 0.2s'
                        }}>
                          <svg 
                            width="16" 
                            height="16" 
                            fill="none" 
                            stroke="rgba(255,255,255,0.6)" 
                            viewBox="0 0 24 24" 
                            strokeWidth="2"
                            style={{
                              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.2s'
                            }}
                          >
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </div>
                      </div>

                      {/* Expandable Content */}
                      {isExpanded && (
                        <div className={styles.drillExpandedContent}>
                          {/* Left Column - Drill Details */}
                          <div className={styles.drillDetailsColumn}>
                            {/* Description */}
                            {drill.description && (
                              <div className={styles.drillDetailSection}>
                                <h4 className={styles.drillDetailHeading}>
                                  Description
                                </h4>
                                <p className={styles.drillDetailText}>
                                  {drill.description}
                                </p>
                              </div>
                            )}

                            {/* Placeholder sections - will populate when schema is updated */}
                            <div className={styles.drillDetailSection}>
                              <h4 className={styles.drillDetailHeading}>
                                Equipment
                              </h4>
                              <p className={styles.drillDetailPlaceholder}>
                                Equipment list coming soon...
                              </p>
                            </div>

                            <div className={styles.drillDetailSection}>
                              <h4 className={styles.drillDetailHeading}>
                                Setup Instructions
                              </h4>
                              <p className={styles.drillDetailPlaceholder}>
                                Setup instructions coming soon...
                              </p>
                            </div>

                            <div className={styles.drillDetailSection}>
                              <h4 className={styles.drillDetailHeading}>
                                Coaching Points
                              </h4>
                              <p className={styles.drillDetailPlaceholder}>
                                Coaching points coming soon...
                              </p>
                            </div>

                            <div className={styles.drillDetailSection}>
                              <h4 className={styles.drillDetailHeading}>
                                Progressions
                              </h4>
                              <p className={styles.drillDetailPlaceholder}>
                                Progression ideas coming soon...
                              </p>
                            </div>
                          </div>

                          {/* Right Column - Drill Diagram Placeholder */}
                          <div className={styles.drillDiagramPlaceholder}>
                            <svg width="64" height="64" fill="none" stroke="rgba(255,255,255,0.3)" viewBox="0 0 24 24" strokeWidth="1.5" style={{ marginBottom: '12px' }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                            <p style={{
                              fontSize: '13px',
                              color: 'rgba(255,255,255,0.5)',
                              fontWeight: '600',
                              marginBottom: '4px'
                            }}>
                              Drill Diagram
                            </p>
                            <p style={{
                              fontSize: '11px',
                              color: 'rgba(255,255,255,0.4)',
                              fontStyle: 'italic'
                            }}>
                              Visual diagram coming soon
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      {sessionDrill.notes && !isExpanded && (
                        <div style={{
                          marginLeft: '42px',
                          padding: '8px 12px',
                          backgroundColor: 'rgba(255,255,255,0.04)',
                          borderLeft: '2px solid rgba(255,255,255,0.2)',
                          borderRadius: '4px'
                        }}>
                          <div style={{
                            fontSize: '11px',
                            fontWeight: '600',
                            color: 'rgba(255,255,255,0.5)',
                            marginBottom: '4px',
                            textTransform: 'uppercase'
                          }}>
                            Notes
                          </div>
                          <p style={{
                            fontSize: '13px',
                            color: 'rgba(255,255,255,0.8)',
                            lineHeight: '1.5',
                            fontStyle: 'italic'
                          }}>
                            {sessionDrill.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                color: 'rgba(255,255,255,0.5)',
                padding: '32px'
              }}>
                No drills in this session
              </div>
            )}
          </div>

          {/* Comment Form */}
          <div id="comments-section" style={{ marginBottom: '16px' }}>
            <CommentForm 
              contentKind="session" 
              contentId={params.id} 
              onCommentAdded={handleCommentAdded}
            />
          </div>

          {/* Comments Section */}
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: '12px',
            padding: '24px'
          }}>
            <CommentList comments={comments} />
          </div>
        </main>
      </div>
    </div>
  )
}
