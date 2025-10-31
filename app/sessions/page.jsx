'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@/app/lib/supabase'
import Navigation from '@/components/Navigation'

export default function MySessionsPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [activeTab, setActiveTab] = useState('mine')
  const [mySessions, setMySessions] = useState([])
  const [favoritedSessions, setFavoritedSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      fetchSessions()
    }
  }, [user, activeTab])

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/auth/login')
      return
    }
    
    setUser(user)
  }

  async function fetchSessions() {
    setLoading(true)

    if (activeTab === 'mine') {
      // Fetch user's created sessions with drill details
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          session_drills(
            drills(id, title)
          )
        `)
        .eq('author_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setMySessions(data)
      }
    } else {
      // Fetch favorited sessions - two-step process
      // Step 1: Get favorite records
      const { data: favorites, error: favError } = await supabase
        .from('favorites')
        .select('content_id')
        .eq('user_id', user.id)
        .eq('content_kind', 'session')

      if (favError || !favorites || favorites.length === 0) {
        setFavoritedSessions([])
        setLoading(false)
        return
      }

      // Step 2: Get session details for favorited IDs
      const sessionIds = favorites.map(f => f.content_id)
      const { data: sessions, error: sessionsError } = await supabase
        .from('sessions')
        .select(`
          *,
          session_drills(
            drills(id, title)
          )
        `)
        .in('id', sessionIds)
        .order('created_at', { ascending: false })

      if (!sessionsError && sessions) {
        setFavoritedSessions(sessions)
      }
    }

    setLoading(false)
  }

  async function deleteSession(sessionId) {
    if (!confirm('Are you sure you want to delete this session?')) return

    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('id', sessionId)

    if (!error) {
      setMySessions(mySessions.filter(s => s.id !== sessionId))
    } else {
      alert('Failed to delete session')
    }
  }

  async function removeFavorite(sessionId) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('content_kind', 'session')
      .eq('content_id', sessionId)

    if (!error) {
      setFavoritedSessions(favoritedSessions.filter(s => s.id !== sessionId))
    } else {
      alert('Failed to remove from favorites')
    }
  }

  function formatDate(dateString) {
    if (!dateString) return 'No date set'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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
      'Warm-up': '#FCD34D',
      'Passing': '#60A5FA',
      'Possession': '#A78BFA',
      'Finishing': '#F87171',
      'Defending': '#4ADE80',
      'Dribbling': '#F472B6',
      'Technical': '#22D3EE'
    }
    return colors[category] || colors['Technical']
  }

  function getCategoryBreakdown(session) {
    if (!session.session_drills || session.session_drills.length === 0) return []
    
    const categoryCount = {}
    
    session.session_drills.forEach(sd => {
      if (sd.drills) {
        const category = getCategoryFromTitle(sd.drills.title)
        categoryCount[category] = (categoryCount[category] || 0) + 1
      }
    })

    const totalDrills = Object.values(categoryCount).reduce((sum, count) => sum + count, 0)
    
    return Object.entries(categoryCount).map(([category, count]) => ({
      category,
      count,
      percentage: (count / totalDrills) * 100,
      color: getCategoryColor(category)
    }))
  }

  const sessionsToDisplay = activeTab === 'mine' ? mySessions : favoritedSessions

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#0a0a0a' }}>
      <Navigation />
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
        <main className="max-w-6xl mx-auto px-8 py-8">
          {/* Page Header */}
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
            MY SESSIONS
          </h2>
          <p className="text-gray-400 italic text-lg mb-8">Your training session repository</p>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '32px',
            borderBottom: '2px solid rgba(255,255,255,0.1)'
          }}>
            <button
              onClick={() => setActiveTab('mine')}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '700',
                fontStyle: 'italic',
                color: activeTab === 'mine' ? 'white' : 'rgba(255,255,255,0.5)',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === 'mine' ? '3px solid #4ADE80' : '3px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textTransform: 'uppercase'
              }}
            >
              My Sessions ({mySessions.length})
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '700',
                fontStyle: 'italic',
                color: activeTab === 'favorites' ? 'white' : 'rgba(255,255,255,0.5)',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === 'favorites' ? '3px solid #4ADE80' : '3px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textTransform: 'uppercase'
              }}
            >
              Favorites ({favoritedSessions.length})
            </button>
          </div>

          {/* Sessions List */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '64px', color: 'rgba(255,255,255,0.5)' }}>
              Loading sessions...
            </div>
          ) : sessionsToDisplay.length === 0 ? (
            // Empty State
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '2px dashed rgba(255,255,255,0.15)',
              borderRadius: '12px',
              padding: '64px 32px',
              textAlign: 'center'
            }}>
              <svg width="64" height="64" fill="none" stroke="rgba(255,255,255,0.3)" viewBox="0 0 24 24" strokeWidth="1.5" style={{ margin: '0 auto 16px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
              {activeTab === 'mine' ? (
                <>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: 'white',
                    marginBottom: '8px'
                  }}>
                    No sessions yet
                  </h3>
                  <p style={{
                    fontSize: '15px',
                    color: 'rgba(255,255,255,0.6)',
                    marginBottom: '24px'
                  }}>
                    Start building your first training session!
                  </p>
                  <button
                    onClick={() => router.push('/sessions/new')}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: 'rgba(34, 197, 94, 0.20)',
                      border: '2px solid #4ADE80',
                      borderRadius: '8px',
                      color: '#4ADE80',
                      fontSize: '16px',
                      fontWeight: '700',
                      fontStyle: 'italic',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.30)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.20)'
                    }}
                  >
                    Build Session
                  </button>
                </>
              ) : (
                <>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: 'white',
                    marginBottom: '8px'
                  }}>
                    No favorited sessions yet
                  </h3>
                  <p style={{
                    fontSize: '15px',
                    color: 'rgba(255,255,255,0.6)'
                  }}>
                    Browse sessions from other coaches and save your favorites
                  </p>
                </>
              )}
            </div>
          ) : (
            // Session Cards Grid
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '24px',
              gridAutoRows: '1fr'
            }}>
              {sessionsToDisplay.map(session => (
                <div
                  key={session.id}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    borderRadius: '12px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onClick={() => router.push(`/sessions/${session.id}`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.10)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'
                  }}
                >
                  {/* Session Title */}
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    fontStyle: 'italic',
                    color: 'white',
                    marginBottom: '8px',
                    textTransform: 'uppercase'
                  }}>
                    {session.title}
                  </h3>

                  {/* Session Metadata with Category Bar */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    marginBottom: '12px',
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.6)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 6v6l4 2" />
                        </svg>
                        {session.total_duration} mins
                      </span>
                      <span>{session.session_drills?.length || 0} drills</span>
                    </div>

                    {/* Category Breakdown Bar */}
                    {(() => {
                      const breakdown = getCategoryBreakdown(session)
                      if (breakdown.length === 0) return null

                      return (
                        <div
                          style={{
                            position: 'relative',
                            width: '140px',
                            height: '8px',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            display: 'flex',
                            gap: '2px',
                            padding: '0 2px'
                          }}
                          title={breakdown.map(b => `${b.category} (${b.count})`).join(' • ')}
                        >
                          {breakdown.map((segment, idx) => (
                            <div
                              key={idx}
                              style={{
                                flex: `${segment.percentage} 0 0`,
                                height: '100%',
                                backgroundColor: segment.color,
                                borderRadius: '2px'
                              }}
                            />
                          ))}
                        </div>
                      )
                    })()}
                  </div>

                  {/* Description Preview */}
                  <div style={{ flex: 1 }}>
                    {session.description && (
                      <p style={{
                        fontSize: '13px',
                        color: 'rgba(255,255,255,0.7)',
                        lineHeight: '1.5',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        marginBottom: '12px'
                      }}>
                        {session.description}
                      </p>
                    )}
                    
                    {/* Session Date */}
                    {session.session_date && (
                      <div style={{
                        fontSize: '12px',
                        color: 'rgba(255,255,255,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginBottom: '16px'
                      }}>
                        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        {formatDate(session.session_date)}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(255,255,255,0.08)'
                  }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/sessions/${session.id}`)
                      }}
                      style={{
                        flex: 1,
                        padding: '8px',
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '6px',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.10)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'
                      }}
                    >
                      View
                    </button>
                    {activeTab === 'mine' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteSession(session.id)
                        }}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '6px',
                          color: '#F87171',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.25)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)'
                        }}
                      >
                        Delete
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeFavorite(session.id)
                        }}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: 'rgba(234, 179, 8, 0.15)',
                          border: '1px solid rgba(234, 179, 8, 0.3)',
                          borderRadius: '6px',
                          color: '#EAB308',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(234, 179, 8, 0.25)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(234, 179, 8, 0.15)'
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
