'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@/app/lib/supabase'
import ProfileHeader from '@/components/ProfileHeader'
import SessionList from '@/components/SessionList'
import DrillList from '@/components/DrillList'
import Navigation from '@/components/Navigation'

export default function ProfilePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [stats, setStats] = useState(null)
    const [sessions, setSessions] = useState([])
    const [upvotedSessions, setUpvotedSessions] = useState([])
    const [favoritedSessions, setFavoritedSessions] = useState([])
    const [createdDrills, setCreatedDrills] = useState([])
    const [upvotedDrills, setUpvotedDrills] = useState([])
    const [favoritedDrills, setFavoritedDrills] = useState([])
    const [activeTab, setActiveTab] = useState('sessions')

    useEffect(() => {
        checkUser()
    }, [])

    async function checkUser() {
        const supabase = createClientComponentClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            router.push('/auth/login')
            return
        }

        setUser(user)
        await fetchProfileData(user.id)
    }

    async function fetchProfileData(userId) {
        const supabase = createClientComponentClient()
        setLoading(true)
        try {
            // Fetch profile with stats
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single()

            if (profileError) throw profileError
            setProfile(profileData)

            // Fetch sessions created
            const { data: sessionsData, error: sessionsError } = await supabase
                .from('sessions')
                .select(`
          *,
          session_drills(id),
          session_stats(score, comment_count)
        `)
                .eq('author_id', userId)
                .order('created_at', { ascending: false })

            if (!sessionsError) setSessions(sessionsData || [])

            // Fetch drills created
            const { data: drillsData, error: drillsError } = await supabase
                .from('drills')
                .select(`
          *,
          drill_stats(score, comment_count)
        `)
                .eq('author_id', userId)
                .order('created_at', { ascending: false })

            if (!drillsError) setCreatedDrills(drillsData || [])

            // Fetch upvoted drills
            const { data: drillVotesData, error: drillVotesError } = await supabase
                .from('votes')
                .select('content_id')
                .eq('user_id', userId)
                .eq('content_kind', 'drill')
                .eq('value', 1)

            if (!drillVotesError && drillVotesData && drillVotesData.length > 0) {
                const drillIds = drillVotesData.map(v => v.content_id)

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

            // Fetch upvoted sessions
            const { data: sessionVotesData, error: sessionVotesError } = await supabase
                .from('votes')
                .select('content_id')
                .eq('user_id', userId)
                .eq('content_kind', 'session')
                .eq('value', 1)

            if (!sessionVotesError && sessionVotesData && sessionVotesData.length > 0) {
                const sessionIds = sessionVotesData.map(v => v.content_id)

                const { data: upvotedSessionsData } = await supabase
                    .from('sessions')
                    .select(`
            *,
            session_drills(id),
            session_stats(score, comment_count)
          `)
                    .in('id', sessionIds)
                    .order('created_at', { ascending: false })

                if (upvotedSessionsData) setUpvotedSessions(upvotedSessionsData)
            }

            // Fetch favorited sessions
            const { data: sessionFavoritesData, error: sessionFavoritesError } = await supabase
                .from('favorites')
                .select('content_id')
                .eq('user_id', userId)
                .eq('content_kind', 'session')

            if (!sessionFavoritesError && sessionFavoritesData && sessionFavoritesData.length > 0) {
                const favSessionIds = sessionFavoritesData.map(f => f.content_id)

                const { data: favoritedSessionsData } = await supabase
                    .from('sessions')
                    .select(`
            *,
            session_drills(id),
            session_stats(score, comment_count)
          `)
                    .in('id', favSessionIds)
                    .order('created_at', { ascending: false })

                if (favoritedSessionsData) setFavoritedSessions(favoritedSessionsData)
            }

            // Fetch favorited drills
            const { data: drillFavoritesData, error: drillFavoritesError } = await supabase
                .from('favorites')
                .select('content_id')
                .eq('user_id', userId)
                .eq('content_kind', 'drill')

            if (!drillFavoritesError && drillFavoritesData && drillFavoritesData.length > 0) {
                const favDrillIds = drillFavoritesData.map(f => f.content_id)

                const { data: favoritedDrillsData } = await supabase
                    .from('drills')
                    .select(`
            *,
            drill_stats(score, comment_count)
          `)
                    .in('id', favDrillIds)
                    .order('created_at', { ascending: false })

                if (favoritedDrillsData) setFavoritedDrills(favoritedDrillsData)
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
        } finally {
            setLoading(false)
        }
    }

    async function handleProfileUpdate() {
        if (user) {
            await fetchProfileData(user.id)
        }
    }

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        border: '3px solid rgba(255,255,255,0.1)',
                        borderTop: '3px solid #16a34a',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 16px'
                    }} />
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>Loading profile...</p>
                </div>
                <style jsx>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', position: 'relative', backgroundColor: '#0a0a0a' }}>
            <Navigation />
            {/* Blurred Background Layer */}
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundImage: 'url(/images/coach-background-image.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: '50% -40%',
                    backgroundRepeat: 'no-repeat',
                    filter: 'blur(5px) grayscale(30%)',
                    WebkitFilter: 'blur(5px) grayscale(30%)',
                    opacity: 0.4,
                    zIndex: 0
                }}
            />

            {/* Fade to Black Gradient Overlay */}
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(10,10,10,1) 0%, rgba(10,10,10,0.85) 30%, rgba(10,10,10,0.70) 60%, rgba(10,10,10,0.60) 100%)',
                    zIndex: 1
                }}
            />

            <div style={{ position: 'relative', zIndex: 2 }}>
                <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
                    {/* Page Title */}
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
                        MY PROFILE
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', fontSize: '18px', marginBottom: '32px' }}>
                        Manage your coaching profile and content
                    </p>

                    {/* Two Column Layout */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '380px 1fr',
                        gap: '24px',
                        alignItems: 'stretch'
                    }}>
                        {/* Left: Profile Header */}
                        <div>
                            <ProfileHeader
                                profile={profile}
                                stats={stats}
                                isOwnProfile={true}
                                onUpdate={handleProfileUpdate}
                            />
                        </div>

                        {/* Right: Content Tabs */}
                        <div style={{
                            backgroundColor: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.10)',
                            borderRadius: '12px',
                            padding: '24px',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            {/* Tab Buttons */}
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                                <button
                                    onClick={() => setActiveTab('sessions')}
                                    style={{
                                        padding: '10px 16px',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        fontSize: '14px',
                                        fontStyle: 'italic',
                                        transition: 'all 0.2s',
                                        backgroundColor: activeTab === 'sessions' ? '#16a34a' : 'rgba(255,255,255,0.08)',
                                        color: activeTab === 'sessions' ? 'white' : 'rgba(255,255,255,0.7)',
                                        border: '1px solid ' + (activeTab === 'sessions' ? '#16a34a' : 'rgba(255,255,255,0.20)'),
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (activeTab !== 'sessions') {
                                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'
                                            e.currentTarget.style.borderColor = '#16a34a'
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (activeTab !== 'sessions') {
                                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'
                                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'
                                        }
                                    }}
                                >
                                    Sessions
                                </button>
                                <button
                                    onClick={() => setActiveTab('drills')}
                                    style={{
                                        padding: '10px 16px',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        fontSize: '14px',
                                        fontStyle: 'italic',
                                        transition: 'all 0.2s',
                                        backgroundColor: activeTab === 'drills' ? '#16a34a' : 'rgba(255,255,255,0.08)',
                                        color: activeTab === 'drills' ? 'white' : 'rgba(255,255,255,0.7)',
                                        border: '1px solid ' + (activeTab === 'drills' ? '#16a34a' : 'rgba(255,255,255,0.20)'),
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (activeTab !== 'drills') {
                                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'
                                            e.currentTarget.style.borderColor = '#16a34a'
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (activeTab !== 'drills') {
                                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'
                                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'
                                        }
                                    }}
                                >
                                    Drills
                                </button>
                            </div>

                            {/* Tab Content */}
                            <div>
                                {activeTab === 'sessions' && (
                                    <SessionList 
                                        sessions={sessions} 
                                        upvotedSessions={upvotedSessions}
                                        favoritedSessions={favoritedSessions}
                                        isOwnProfile={true} 
                                    />
                                )}
                                {activeTab === 'drills' && (
                                    <DrillList
                                        createdDrills={createdDrills}
                                        upvotedDrills={upvotedDrills}
                                        favoritedDrills={favoritedDrills}
                                        isOwnProfile={true}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Responsive CSS for mobile */}
            <style jsx>{`
                @media (max-width: 1024px) {
                    main > div {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    )
}
