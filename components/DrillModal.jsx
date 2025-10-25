'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
import CoachProfileModal from './CoachProfileModal'

export default function DrillModal({ drill, isOpen, onClose }) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)

  const author = drill.author_name || 'Anonymous Coach'
  const duration = drill.duration || 20
  const ageGroup = drill.age_group || 'All Ages'

  // Check if drill is favorited on mount
  useEffect(() => {
    if (isOpen) {
      checkIfFavorited()
    }
  }, [isOpen, drill.id])
  
  if (!isOpen) return null

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
    <>
      {/* Backdrop - Dark scrim */}
      <div 
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.70)',
          zIndex: 50,
          backdropFilter: 'blur(8px)'
        }}
      />

      {/* Modal - Dark card with white border */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: 'calc(50% - 510px)',
        transform: 'translateY(-50%)',
        width: '700px',
        maxHeight: '85vh',
        backgroundColor: 'rgba(26,26,26,0.95)',
        borderRadius: '12px',
        border: '2px solid rgba(255,255,255,0.20)',
        zIndex: 51,
        overflow: 'hidden',
        boxShadow: '0 24px 48px rgba(0,0,0,0.5)'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid rgba(255,255,255,0.10)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '16px'
        }}>
          <div style={{ flex: 1 }}>
            {/* Title - Using display font, italic, bold */}
            <h2 style={{
              fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
              fontSize: '32px',
              fontWeight: '900',
              fontStyle: 'italic',
              color: 'white',
              lineHeight: '1.2',
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em'
            }}>
              {drill.title}
            </h2>
            
            {/* Author info */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              color: 'rgba(255,255,255,0.6)'
            }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>
                {author}
              </span>
            </div>
          </div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.20)',
              borderRadius: '8px',
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'
              e.currentTarget.style.color = 'white'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
            }}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content - Scrollable */}
        <div style={{
          padding: '24px',
          overflowY: 'auto',
          maxHeight: 'calc(85vh - 140px)'
        }}>
          {/* Description */}
          {drill.description && (
            <p style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '16px',
              lineHeight: '1.6',
              marginBottom: '24px'
            }}>
              {drill.description}
            </p>
          )}

          {/* Stats Badges and Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            fontSize: '13px'
          }}>
            {/* Left: Duration and Age Group */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              color: 'rgba(255,255,255,0.6)'
            }}>
              {/* Duration Badge */}
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                {duration} mins
              </span>
              
              {/* Age Group Badge */}
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                {ageGroup}
              </span>
            </div>

            {/* Right: Action Icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
          </div>

          {/* Placeholder for drill steps/details */}
          <div style={{
            padding: '24px',
            backgroundColor: 'rgba(255,255,255,0.04)',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.08)',
            textAlign: 'center'
          }}>
            <div style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Drill details and instructions coming soon...
            </div>
          </div>
        </div>
      </div>

      {/* Coach Profile Modal - Shows automatically if drill has author */}
      {/* TEMP: Always showing for testing - will add condition later */}
      <CoachProfileModal 
        authorId={drill.author_id || 'test'}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  )
}
