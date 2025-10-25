'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
import VoteButtons from './VoteButtons'
import DrillModal from './DrillModal'

export default function DrillCard({ drill }) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const score = drill.drill_stats?.score || 0
  const commentCount = drill.drill_stats?.comment_count || 0
  const userVote = drill.user_vote || null
  const author = drill.author_name || 'Anonymous Coach'
  const duration = drill.duration || 20
  const ageGroup = drill.age_group || 'All Ages'
  const createdAt = new Date(drill.created_at)
  const timeAgo = getTimeAgo(createdAt)

  // Check if drill is favorited on mount
  useEffect(() => {
    checkIfFavorited()
  }, [drill.id])

  async function checkIfFavorited() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('content_kind', 'drill')
      .eq('content_id', drill.id)
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
          .eq('content_kind', 'drill')
          .eq('content_id', drill.id)

        if (!error) {
          setIsFavorited(false)
        }
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            content_kind: 'drill',
            content_id: drill.id
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
    <div style={{
      backgroundColor: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.10)',
      borderRadius: '12px',
      padding: '20px',
      transition: 'all 0.2s',
      position: 'relative'
    }}
    className="hover:border-green-500"
    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(22,163,74,0.5)'}
    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'}
    >
      {/* Top Right Actions */}
      <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
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

      <div className="flex" style={{ gap: '40px' }}>
        <div style={{ 
          width: '80px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <VoteButtons 
            contentKind="drill" 
            contentId={drill.id} 
            initialScore={score} 
            userVote={userVote} 
          />
        </div>
        
        <div className="flex-1">
          <div 
            onClick={() => setIsModalOpen(true)} 
            className="block group" 
            style={{ textDecoration: 'none', cursor: 'pointer' }}
          >
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
              {drill.title}
            </h3>
            
            {drill.description && (
              <p style={{ 
                color: 'rgba(255,255,255,0.7)', 
                fontSize: '14px',
                lineHeight: '1.5',
                marginBottom: '12px'
              }}>
                {drill.description.length > 180 ? drill.description.substring(0, 180) + '...' : drill.description}
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
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                {ageGroup}
              </span>
              
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}
              </span>
              
              {(() => {
                const category = drill.category || getCategoryFromTitle(drill.title)
                const categoryColor = getCategoryColor(category)
                return (
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
                )
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <DrillModal 
        drill={drill} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
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
    'Warm-up': {
      bg: 'rgba(251, 191, 36, 0.15)',
      border: 'rgba(251, 191, 36, 0.3)',
      text: '#FCD34D'
    },
    'Passing': {
      bg: 'rgba(59, 130, 246, 0.15)',
      border: 'rgba(59, 130, 246, 0.3)',
      text: '#60A5FA'
    },
    'Possession': {
      bg: 'rgba(139, 92, 246, 0.15)',
      border: 'rgba(139, 92, 246, 0.3)',
      text: '#A78BFA'
    },
    'Finishing': {
      bg: 'rgba(239, 68, 68, 0.15)',
      border: 'rgba(239, 68, 68, 0.3)',
      text: '#F87171'
    },
    'Defending': {
      bg: 'rgba(34, 197, 94, 0.15)',
      border: 'rgba(34, 197, 94, 0.3)',
      text: '#4ADE80'
    },
    'Dribbling': {
      bg: 'rgba(236, 72, 153, 0.15)',
      border: 'rgba(236, 72, 153, 0.3)',
      text: '#F472B6'
    },
    'Technical': {
      bg: 'rgba(156, 163, 175, 0.15)',
      border: 'rgba(156, 163, 175, 0.3)',
      text: '#9CA3AF'
    }
  }
  
  return colors[category] || colors['Technical']
}
