"use client";

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '../lib/supabase'
import { useRouter } from 'next/navigation'

const Navbar = () => {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Load user data when component mounts
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true)
        const supabase = createClientComponentClient()
        
        try {
          const { data: { user }, error } = await supabase.auth.getUser()
          console.log('Navbar - Auth state:', user ? 'Logged in' : 'Not logged in', user?.email)
          
          if (user) {
            setUser(user)
            // You can still use localStorage for profile image if needed
            const userDataStr = localStorage.getItem('soccer_coach_user_profile')
            if (userDataStr) {
              const userData = JSON.parse(userDataStr)
              setProfileImage(userData.profileImage)
            }
          } else {
            setUser(null)
          }
        } catch (authError) {
          // Handle auth session missing error
          console.log('Auth session not found or expired')
          setUser(null)
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadUserData()
    
    // Set up auth listener
    const supabase = createClientComponentClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadUserData()
    })
    
    return () => subscription?.unsubscribe()
  }, [])
  
  return (
    <nav className="bg-green-800 text-white shadow-md border-b-2 border-green-600">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Brand Logo/Text using the same style as main heading */}
          <Link href="/" className="flex items-center border-0 outline-none no-underline">
            <span className="br-main-heading text-2xl br-logo">The Boot Room</span>
          </Link>
          
          <div className="flex items-center">
            <div className="flex mr-8 items-center justify-end">
              {/* Navigation options for signed-in users */}
              {user ? (
                <>
                  <div className="mx-3">
                    <Link 
                      href="/" 
                      className="text-white hover:text-gray-200 nav-link"
                    >
                      Home
                    </Link>
                  </div>
                  <div className="mx-3">
                    <Link 
                      href="/schedule" 
                      className="text-white hover:text-gray-200 nav-link"
                    >
                      Schedule
                    </Link>
                  </div>
                  <div className="mx-3">
                    <Link 
                      href="/sessions/my-sessions" 
                      className="text-white hover:text-gray-200 nav-link"
                    >
                      My Sessions
                    </Link>
                  </div>
                  <div className="mx-3">
                    <Link 
                      href="/themes" 
                      className="text-white hover:text-gray-200 nav-link"
                    >
                      Session Themes
                    </Link>
                  </div>
                  <div className="mx-3">
                    <button
                      onClick={async () => {
                        try {
                          const supabase = createClientComponentClient()
                          await supabase.auth.signOut()
                          setUser(null)
                          // Clear any auth-related cookies or local storage
                          localStorage.removeItem('soccer_coach_user_profile')
                          // Redirect to home page
                          window.location.href = '/'
                        } catch (error) {
                          console.error('Error signing out:', error)
                        }
                      }}
                      className="br-button"
                      style={{fontSize: '0.9rem', padding: '8px 16px', backgroundColor: '#b91c1c'}}
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                /* Navigation options for non-signed-in users */
                <>
                  <div className="mx-3">
                    <Link 
                      href="/pricing" 
                      className="text-white hover:text-gray-200 nav-link"
                    >
                      Pricing
                    </Link>
                  </div>
                  <div className="mx-3">
                    <Link 
                      href="/features" 
                      className="text-white hover:text-gray-200 nav-link"
                    >
                      Features
                    </Link>
                  </div>
                  <div className="mx-3">
                    <Link 
                      href="/reviews" 
                      className="text-white hover:text-gray-200 nav-link"
                    >
                      Reviews
                    </Link>
                  </div>
                  <div className="mx-3">
                    <Link 
                      href="/faq" 
                      className="text-white hover:text-gray-200 nav-link"
                    >
                      FAQ
                    </Link>
                  </div>
                  <div className="mx-3">
                    <Link 
                      href="/blog" 
                      className="text-white hover:text-gray-200 nav-link"
                    >
                      Blog
                    </Link>
                  </div>
                  <div className="mx-3">
                    <Link 
                      href="/auth/login" 
                      className="br-button"
                      style={{fontSize: '0.9rem', padding: '8px 16px'}}
                    >
                      Sign In
                    </Link>
                  </div>
                </>
              )}
            </div>
            
            {/* Profile Icon - only show if user is logged in */}
            {user && (
              <Link href="/profile" className="relative group">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white flex items-center justify-center bg-green-600 hover:bg-green-500 transition-colors">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="hidden group-hover:block absolute top-full right-0 mt-1 w-auto whitespace-nowrap bg-gray-800 text-white text-xs rounded py-1 px-2">My Profile</span>
              </Link>
            )}
            
            {/* Mobile Menu Button - shown only on small screens */}
            <button className="ml-4 hidden sm:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar