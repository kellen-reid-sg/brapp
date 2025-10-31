'use client'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/app/lib/supabase'

export default function CoachProfileModal({ authorId, isOpen, onClose, className }) {
  const supabase = createClientComponentClient()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [drillCount, setDrillCount] = useState(0)
  const [upvotes, setUpvotes] = useState(0)

  useEffect(() => {
    if (isOpen && authorId) {
      fetchProfile()
      fetchStats()
    }
  }, [isOpen, authorId])

  if (!isOpen) return null

  async function fetchProfile() {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authorId)
      .single()

    if (!error && data) {
      setProfile(data)
    }
    setLoading(false)
  }

  async function fetchStats() {
    // Count drills posted by this coach
    const { count: drillsCount } = await supabase
      .from('drills')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', authorId)

    setDrillCount(drillsCount || 0)

    // Count total upvotes received on their drills
    const { data: drillIds } = await supabase
      .from('drills')
      .select('id')
      .eq('author_id', authorId)

    if (drillIds && drillIds.length > 0) {
      const ids = drillIds.map(d => d.id)
      const { data: votes } = await supabase
        .from('votes')
        .select('value')
        .eq('content_kind', 'drill')
        .in('content_id', ids)
        .eq('value', 1)

      setUpvotes(votes?.length || 0)
    }
  }

  return (
    <div className={className}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
            Loading...
          </div>
        ) : (
          <>
            {/* Header with Close Button */}
            <div style={{
              padding: '20px',
              borderBottom: '1px solid rgba(255,255,255,0.10)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: 'white'
              }}>
                Coach Profile
              </h3>
              
              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onClose()
                }}
                style={{
                  padding: '4px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'rgba(255,255,255,0.7)',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'white'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
              {/* Profile Header - Avatar and Name side by side */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                {/* Avatar - Top Left */}
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: '700',
                  color: 'white',
                  flexShrink: 0
                }}>
                  {profile ? (profile.display_name || 'Coach')[0].toUpperCase() : 'C'}
                </div>
                
                {/* Name - To the right of avatar */}
                <div style={{ flex: 1 }}>
                  <h2 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: 'white',
                    marginBottom: '4px'
                  }}>
                    {profile ? profile.display_name || 'Anonymous Coach' : 'Anonymous Coach'}
                  </h2>
                  {profile && profile.bio && (
                    <p style={{
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.6)',
                      lineHeight: '1.4'
                    }}>
                      {profile.bio}
                    </p>
                  )}
                </div>
              </div>

              {/* Licenses */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'rgba(255,255,255,0.5)',
                  marginBottom: '6px'
                }}>
                  Licenses
                </div>
                <div style={{
                  fontSize: '13px',
                  color: 'white',
                  lineHeight: '1.5'
                }}>
                  {profile && profile.licenses ? profile.licenses : 'Not specified'}
                </div>
              </div>

              {/* Coaching Experience */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'rgba(255,255,255,0.5)',
                  marginBottom: '6px'
                }}>
                  Experience
                </div>
                <div style={{
                  fontSize: '13px',
                  color: 'white',
                  lineHeight: '1.5'
                }}>
                  {profile && profile.coaching_experience ? profile.coaching_experience : 'Not specified'}
                </div>
              </div>

              {/* Specialties */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'rgba(255,255,255,0.5)',
                  marginBottom: '6px'
                }}>
                  Specialties
                </div>
                <div style={{
                  fontSize: '13px',
                  color: 'white',
                  lineHeight: '1.5'
                }}>
                  {profile && profile.specialties ? profile.specialties : 'Not specified'}
                </div>
              </div>

              {/* Current/Previous Clubs */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'rgba(255,255,255,0.5)',
                  marginBottom: '6px'
                }}>
                  Clubs/Schools
                </div>
                <div style={{
                  fontSize: '13px',
                  color: 'white',
                  lineHeight: '1.5'
                }}>
                  {profile && profile.current_club ? profile.current_club : 'Not specified'}
                </div>
              </div>
            </div>
          </>
        )}
    </div>
  )
}
