'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabaseClient'
import Navigation from '@/components/Navigation'
import CommentList from '@/components/CommentList'
import CommentForm from '@/components/CommentForm'

export default function DrillDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [drill, setDrill] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [userVote, setUserVote] = useState(null)
  const [isFavorited, setIsFavorited] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    fetchDrill()
    fetchComments()
    checkIfFavorited()
  }, [params.id])

  async function checkIfFavorited() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('content_kind', 'drill')
      .eq('content_id', params.id)
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
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('content_kind', 'drill')
          .eq('content_id', params.id)

        if (!error) {
          setIsFavorited(false)
        }
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            content_kind: 'drill',
            content_id: params.id
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

  async function fetchDrill() {
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data, error } = await supabase
      .from('drills')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !data) {
      console.error('Error fetching drill:', error)
      setLoading(false)
      return
    }

    // Get vote stats
    const { data: votes } = await supabase
      .from('votes')
      .select('value')
      .eq('content_kind', 'drill')
      .eq('content_id', params.id)

    const score = votes?.reduce((sum, v) => sum + v.value, 0) || 0

    // Get comment count
    const { count: commentCount } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('content_kind', 'drill')
      .eq('content_id', params.id)

    setDrill({
      ...data,
      drill_stats: { score, comment_count: commentCount || 0 }
    })

    // Get user's vote if logged in
    if (user) {
      const { data: voteData } = await supabase
        .from('votes')
        .select('value')
        .eq('user_id', user.id)
        .eq('content_kind', 'drill')
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
      .eq('content_kind', 'drill')
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
          title: drill.title,
          text: drill.description,
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  if (!drill) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Drill not found</h2>
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

  const score = drill.drill_stats?.score || 0
  const commentCount = drill.drill_stats?.comment_count || 0
  const author = drill.author_name || 'Anonymous Coach'
  const duration = drill.duration || 20
  const ageGroup = drill.age_group || 'All Ages'

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

  const category = drill.category || getCategoryFromTitle(drill.title)
  const categoryColor = getCategoryColor(category)

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

        <main className="max-w-4xl mx-auto px-8 py-8">
          <button 
            onClick={() => router.push('/drills')}
            style={{
              marginBottom: '24px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Drill Library
          </button>

          {/* Main Drill Card */}
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '16px',
            position: 'relative'
          }}>
            {/* Top Right Actions */}
            <div style={{ position: 'absolute', top: '24px', right: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Star/Favorite Icon */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={(e) => {
                    e.preventDefault()
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
              
              {/* Add to Session Button */}
              <button
                onClick={(e) => {
                  e.preventDefault()
                  console.log('Add to session:', drill.id)
                  // TODO: Implement add to session functionality
                }}
                style={{
                  padding: '6px 12px',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.20)',
                  borderRadius: '4px',
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'
                }}
              >
                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Add to Session
              </button>
            </div>

            {/* Subreddit-style header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '16px'
            }}>
              <span>Posted by <span style={{ color: 'rgba(255,255,255,0.7)' }}>{author}</span></span>
              <span>•</span>
              <span>{new Date(drill.created_at).toLocaleDateString()}</span>
            </div>

            {/* Drill Title */}
            <h1 style={{
              fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
              fontSize: '32px',
              fontWeight: '900',
              fontStyle: 'italic',
              color: 'white',
              textTransform: 'uppercase',
              marginBottom: '16px',
              lineHeight: '1.2',
              paddingRight: '120px'
            }}>
              {drill.title}
            </h1>

            {/* Info badges - Duration, Age Group, Category */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '20px',
              flexWrap: 'wrap'
            }}>
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                fontSize: '13px',
                color: 'rgba(255,255,255,0.6)'
              }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                {duration} mins
              </span>
              
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                fontSize: '13px',
                color: 'rgba(255,255,255,0.6)'
              }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                {ageGroup}
              </span>

              <span style={{ 
                padding: '4px 12px',
                backgroundColor: categoryColor.bg,
                border: `1px solid ${categoryColor.border}`,
                borderRadius: '4px',
                color: categoryColor.text,
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {category}
              </span>
            </div>

            {/* Description */}
            {drill.description && (
              <p style={{ 
                color: 'rgba(255,255,255,0.8)', 
                fontSize: '15px',
                lineHeight: '1.6',
                marginBottom: '20px',
                whiteSpace: 'pre-wrap'
              }}>
                {drill.description}
              </p>
            )}

            {/* Engagement Stats - Reddit style */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(255,255,255,0.08)'
            }}>
              {/* Upvote Button */}
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
                  setDrill({
                    ...drill,
                    drill_stats: { ...drill.drill_stats, score: newScore }
                  })

                  if (newVote === null) {
                    await supabase
                      .from('votes')
                      .delete()
                      .eq('user_id', user.id)
                      .eq('content_kind', 'drill')
                      .eq('content_id', params.id)
                  } else {
                    await supabase
                      .from('votes')
                      .upsert({
                        user_id: user.id,
                        content_kind: 'drill',
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
                  if (userVote !== 1) {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'
                  }
                }}
                onMouseLeave={(e) => {
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

              <button style={{
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
                cursor: 'default',
                minWidth: '90px'
              }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {commentCount}
              </button>

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

          {/* Comment Form */}
          <div style={{ marginBottom: '16px' }}>
            <CommentForm 
              contentKind="drill" 
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
