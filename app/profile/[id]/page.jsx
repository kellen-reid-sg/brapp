'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClientComponentClient } from '@/app/lib/supabase'
import ProfileHeader from '@/components/ProfileHeader'
import SessionList from '@/components/SessionList'
import DrillList from '@/components/DrillList'

export default function PublicProfilePage() {
  const params = useParams()
  const profileId = params.id
  
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState(null)
  const [sessions, setSessions] = useState([])
  const [createdDrills, setCreatedDrills] = useState([])
  const [upvotedDrills, setUpvotedDrills] = useState([])
  const [activeTab, setActiveTab] = useState('sessions')
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetchProfileData()
  }, [profileId])

  async function fetchProfileData() {
    const supabase = createClientComponentClient()
    setLoading(true)
    setNotFound(false)
    
    try {
      // Get current user (if logged in)
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single()

      if (profileError) {
        console.error('Profile not found:', profileError)
        setNotFound(true)
        setLoading(false)
        return
      }
      
      setProfile(profileData)

      // Fetch public sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('sessions')
        .select(`
          *,
          session_drills(id),
          session_stats(score, comment_count)
        `)
        .eq('author_id', profileId)
        .eq('is_public', true)
        .order('created_at', { ascending: false })

      if (!sessionsError) setSessions(sessionsData || [])

      // Fetch drills created
      const { data: drillsData, error: drillsError } = await supabase
        .from('drills')
        .select(`
          *,
          drill_stats(score, comment_count)
        `)
        .eq('author_id', profileId)
        .order('created_at', { ascending: false })

      if (!drillsError) setCreatedDrills(drillsData || [])

      // Fetch upvoted drills (public votes)
      const { data: votesData, error: votesError } = await supabase
        .from('votes')
        .select('content_id')
        .eq('user_id', profileId)
        .eq('content_kind', 'drill')
        .eq('value', 1)

      if (!votesError && votesData && votesData.length > 0) {
        const drillIds = votesData.map(v => v.content_id)
        
        const { data: upvotedDrillsData } = await supabase
          .from('drills')
          .select(`
            *,
            drill_stats(score, comment_count)
          `)
          .in('id', drillIds)
          .order('created_at', { ascending: false })

        if (upvotedDrillsData) setUpvotedDrills(upvotedDrillsData)
      }

      // Calculate stats
      const { data: upvotesData } = await supabase
        .from('votes')
        .select('value, content_kind, content_id')
        .eq('value', 1)

      let upvotesReceived = 0
      if (upvotesData) {
        // Count upvotes on user's drills
        const drillUpvotes = upvotesData.filter(v => 
          v.content_kind === 'drill' && 
          drillsData?.some(d => d.id === v.content_id)
        )
        
        // Count upvotes on user's sessions
        const sessionUpvotes = upvotesData.filter(v => 
          v.content_kind === 'session' && 
          sessionsData?.some(s => s.id === v.content_id)
        )
        
        upvotesReceived = drillUpvotes.length + sessionUpvotes.length
      }

      setStats({
        sessions_created: sessionsData?.length || 0,
        drills_posted: drillsData?.length || 0,
        upvotes_received: upvotesReceived
      })

    } catch (error) {
      console.error('Error fetching profile data:', error)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">This coach profile does not exist.</p>
          <a 
            href="/drills"
            className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium"
          >
            Browse Drills
          </a>
        </div>
      </div>
    )
  }

  const isOwnProfile = currentUser?.id === profileId

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar - Profile Header */}
          <div className="lg:col-span-1">
            <ProfileHeader 
              profile={profile} 
              stats={stats}
              isOwnProfile={isOwnProfile}
              onUpdate={fetchProfileData}
            />
          </div>

          {/* Right content - Tabs for Sessions and Drills */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              {/* Tab headers */}
              <div className="flex gap-6 mb-6 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('sessions')}
                  className={`pb-3 px-2 font-semibold text-sm border-b-2 transition-colors ${
                    activeTab === 'sessions'
                      ? 'border-green-600 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Sessions
                </button>
                <button
                  onClick={() => setActiveTab('drills')}
                  className={`pb-3 px-2 font-semibold text-sm border-b-2 transition-colors ${
                    activeTab === 'drills'
                      ? 'border-green-600 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Drills
                </button>
              </div>

              {/* Tab content */}
              <div>
                {activeTab === 'sessions' && (
                  <SessionList sessions={sessions} isOwnProfile={isOwnProfile} />
                )}
                {activeTab === 'drills' && (
                  <DrillList 
                    createdDrills={createdDrills} 
                    upvotedDrills={upvotedDrills}
                    isOwnProfile={isOwnProfile}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
