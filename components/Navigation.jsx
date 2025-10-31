'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@/app/lib/supabase'

export default function Navigation() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    checkUser()
    
    // Close dropdown when clicking outside
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  async function checkUser() {
    const supabase = createClientComponentClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      setUser(user)
      
      // Fetch profile for avatar
      const { data: profileData } = await supabase
        .from('profiles')
        .select('avatar_url, display_name')
        .eq('id', user.id)
        .single()
      
      if (profileData) {
        setProfile(profileData)
      }
    }
    
    setLoading(false)
  }

  async function handleSignOut() {
    const supabase = createClientComponentClient()
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setDropdownOpen(false)
    router.push('/')
  }

  return (
    <header className="px-8 py-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" style={{ textDecoration: 'none' }}>
          <h1 style={{
            fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
            fontSize: '1.5rem',
            fontWeight: '900',
            fontStyle: 'italic',
            color: 'transparent',
            WebkitTextStroke: '1.5px white',
            textStroke: '1.5px white',
            letterSpacing: '0.1em',
            transform: 'skew(-5deg)',
            cursor: 'pointer'
          }}
          className="hover:opacity-80 transition">
            THE BOOT ROOM
          </h1>
        </Link>
        
        <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <Link 
            href="/about" 
            style={{ 
              color: 'white',
              fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
              fontStyle: 'italic',
              fontWeight: '900',
              textDecoration: 'underline',
              transition: 'color 0.2s',
              letterSpacing: '0.05em',
              whiteSpace: 'nowrap',
              fontSize: '14px'
            }}
            className="hover:text-green-500"
          >
            ABOUT
          </Link>
          <Link 
            href="/drills" 
            style={{ 
              color: 'white',
              fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
              fontStyle: 'italic',
              fontWeight: '900',
              textDecoration: 'underline',
              transition: 'color 0.2s',
              letterSpacing: '0.05em',
              whiteSpace: 'nowrap',
              fontSize: '14px'
            }}
            className="hover:text-green-500"
          >
            BROWSE DRILLS
          </Link>
          <Link 
            href="/sessions/browse" 
            style={{ 
              color: 'white',
              fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
              fontStyle: 'italic',
              fontWeight: '900',
              textDecoration: 'underline',
              transition: 'color 0.2s',
              letterSpacing: '0.05em',
              whiteSpace: 'nowrap',
              fontSize: '14px'
            }}
            className="hover:text-green-500"
          >
            BROWSE SESSIONS
          </Link>
          <Link 
            href="/sessions/new" 
            style={{ 
              color: 'white',
              fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
              fontStyle: 'italic',
              fontWeight: '900',
              textDecoration: 'underline',
              transition: 'color 0.2s',
              letterSpacing: '0.05em',
              whiteSpace: 'nowrap',
              fontSize: '14px'
            }}
            className="hover:text-green-500"
          >
            BUILD SESSION
          </Link>
          
          {!loading && (
            <>
              {user ? (
                <>
                  <Link 
                    href="/sessions" 
                    style={{ 
                      color: 'white',
                      fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
                      fontStyle: 'italic',
                      fontWeight: '900',
                      textDecoration: 'underline',
                      transition: 'color 0.2s',
                      letterSpacing: '0.05em',
                      whiteSpace: 'nowrap',
                      fontSize: '14px'
                    }}
                    className="hover:text-green-500"
                  >
                    MY SESSIONS
                  </Link>
                  
                  {/* User Avatar Dropdown */}
                  <div ref={dropdownRef} style={{ position: 'relative' }}>
                    <div 
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        border: '2px solid white',
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = '#4ADE80'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'white'}
                    >
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt={profile.display_name || 'User'}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'linear-gradient(135deg, #16a34a 0%, #15803D 100%)',
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: '900',
                          fontStyle: 'italic'
                        }}>
                          {profile?.display_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'C'}
                        </div>
                      )}
                    </div>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                      <div style={{
                        position: 'absolute',
                        top: '48px',
                        right: '0',
                        backgroundColor: 'rgba(26,26,26,0.98)',
                        border: '1px solid rgba(255,255,255,0.20)',
                        borderRadius: '8px',
                        minWidth: '180px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        overflow: 'hidden',
                        zIndex: 1000
                      }}>
                        <Link href="/profile" style={{ textDecoration: 'none' }}>
                          <div 
                            onClick={() => setDropdownOpen(false)}
                            style={{
                              padding: '12px 16px',
                              color: 'white',
                              fontSize: '14px',
                              fontWeight: '600',
                              fontStyle: 'italic',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              borderBottom: '1px solid rgba(255,255,255,0.10)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.25)'
                              e.currentTarget.style.color = '#4ADE80'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent'
                              e.currentTarget.style.color = 'white'
                            }}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            My Profile
                          </div>
                        </Link>
                        
                        <div 
                          style={{
                            padding: '12px 16px',
                            color: 'rgba(255,255,255,0.5)',
                            fontSize: '14px',
                            fontWeight: '600',
                            fontStyle: 'italic',
                            cursor: 'not-allowed',
                            borderBottom: '1px solid rgba(255,255,255,0.10)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                          }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                          </svg>
                          Settings
                        </div>
                        
                        <div 
                          onClick={handleSignOut}
                          style={{
                            padding: '12px 16px',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: '600',
                            fontStyle: 'italic',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.25)'
                            e.currentTarget.style.color = '#ef4444'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent'
                            e.currentTarget.style.color = 'white'
                          }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                          </svg>
                          Sign Out
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Sign In Button */}
                  <Link href="/auth/login" style={{ textDecoration: 'none' }}>
                    <button
                      style={{
                        padding: '8px 16px',
                        backgroundColor: 'rgba(255,255,255,0.10)',
                        border: '1px solid rgba(255,255,255,0.30)',
                        borderRadius: '6px',
                        color: 'white',
                        fontSize: '13px',
                        fontWeight: '700',
                        fontStyle: 'italic',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'
                        e.currentTarget.style.borderColor = '#4ADE80'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.10)'
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.30)'
                      }}
                    >
                      Sign In
                    </button>
                  </Link>
                  
                  {/* Get Started Button */}
                  <Link href="/auth/signup" style={{ textDecoration: 'none' }}>
                    <button
                      style={{
                        padding: '7px 15px',
                        backgroundColor: 'rgba(34, 197, 94, 0.20)',
                        border: '2px solid #4ADE80',
                        borderRadius: '6px',
                        color: '#4ADE80',
                        fontSize: '13px',
                        fontWeight: '700',
                        fontStyle: 'italic',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.30)'
                        e.currentTarget.style.transform = 'scale(1.02)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.20)'
                        e.currentTarget.style.transform = 'scale(1)'
                      }}
                    >
                      Get Started
                    </button>
                  </Link>
                </>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
