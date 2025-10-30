'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function SessionList({ sessions, upvotedSessions, favoritedSessions, isOwnProfile }) {
    const [activeTab, setActiveTab] = useState('created')

    const displaySessions = activeTab === 'created' ? sessions : activeTab === 'upvoted' ? upvotedSessions : favoritedSessions

    return (
        <div>
            {/* Underlined Subtabs */}
            <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '32px',
                borderBottom: '2px solid rgba(255,255,255,0.1)'
            }}>
                <button
                    onClick={() => setActiveTab('created')}
                    style={{
                        padding: '12px 24px',
                        fontSize: '16px',
                        fontWeight: '700',
                        fontStyle: 'italic',
                        color: activeTab === 'created' ? 'white' : 'rgba(255,255,255,0.5)',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'created' ? '3px solid #4ADE80' : '3px solid transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        textTransform: 'uppercase'
                    }}
                >
                    Created ({sessions?.length || 0})
                </button>
                <button
                    onClick={() => setActiveTab('upvoted')}
                    style={{
                        padding: '12px 24px',
                        fontSize: '16px',
                        fontWeight: '700',
                        fontStyle: 'italic',
                        color: activeTab === 'upvoted' ? 'white' : 'rgba(255,255,255,0.5)',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'upvoted' ? '3px solid #4ADE80' : '3px solid transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        textTransform: 'uppercase'
                    }}
                >
                    Upvoted ({upvotedSessions?.length || 0})
                </button>
                <button
                    onClick={() => setActiveTab('favorited')}
                    style={{
                        padding: '12px 24px',
                        fontSize: '16px',
                        fontWeight: '700',
                        fontStyle: 'italic',
                        color: activeTab === 'favorited' ? 'white' : 'rgba(255,255,255,0.5)',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'favorited' ? '3px solid #4ADE80' : '3px solid transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        textTransform: 'uppercase'
                    }}
                >
                    Favorited ({favoritedSessions?.length || 0})
                </button>
            </div>

            {/* Session list or empty state */}
            {!displaySessions || displaySessions.length === 0 ? (
                <EmptyState tab={activeTab} isOwnProfile={isOwnProfile} />
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {displaySessions.map((session) => (
                        <SessionCard key={session.id} session={session} />
                    ))}
                </div>
            )}
        </div>
    )
}

function EmptyState({ tab, isOwnProfile }) {
    const messages = {
        created: {
            title: 'No Sessions Created',
            description: isOwnProfile
                ? "You haven't created any sessions yet"
                : "This coach hasn't created any sessions yet"
        },
        upvoted: {
            title: 'No Sessions Upvoted',
            description: isOwnProfile
                ? "You haven't upvoted any sessions yet"
                : "This coach hasn't upvoted any sessions yet"
        },
        favorited: {
            title: 'No Favorited Sessions',
            description: isOwnProfile
                ? "You haven't favorited any sessions yet"
                : "This coach hasn't favorited any sessions yet"
        }
    }

    const message = messages[tab]

    return (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <svg width="64" height="64" fill="none" stroke="rgba(255,255,255,0.3)" viewBox="0 0 24 24" strokeWidth={1.5} style={{ margin: '0 auto 24px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                fontStyle: 'italic',
                color: 'white',
                marginBottom: '12px'
            }}>
                {message.title}
            </h3>
            <p style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.6)',
                marginBottom: '24px'
            }}>
                {message.description}
            </p>
            {isOwnProfile && tab === 'created' && (
                <Link
                    href="/sessions/new"
                    style={{
                        display: 'inline-block',
                        padding: '12px 24px',
                        backgroundColor: '#16a34a',
                        border: '1px solid #16a34a',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '700',
                        fontStyle: 'italic',
                        textDecoration: 'none',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                    Create Your First Session
                </Link>
            )}
        </div>
    )
}

function SessionCard({ session }) {
    const drillCount = session.session_drills?.length || 0
    const duration = session.total_duration || 0
    const score = session.session_stats?.score || 0
    const commentCount = session.session_stats?.comment_count || 0

    return (
        <Link href={`/sessions/${session.id}`} style={{ textDecoration: 'none' }}>
            <div
                style={{
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    borderRadius: '12px',
                    padding: '20px',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#16a34a'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'}
            >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h3 style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        fontStyle: 'italic',
                        color: 'white',
                        flex: 1,
                        lineHeight: '1.3'
                    }}>
                        {session.title}
                    </h3>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginLeft: '16px',
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: '14px',
                        fontWeight: '600'
                    }}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path d="M5 15l7-7 7 7" />
                        </svg>
                        {score}
                    </div>
                </div>

                {session.description && (
                    <p style={{
                        fontSize: '14px',
                        color: 'rgba(255,255,255,0.7)',
                        lineHeight: '1.5',
                        marginBottom: '16px'
                    }}>
                        {session.description.length > 150 ? session.description.substring(0, 150) + '...' : session.description}
                    </p>
                )}

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.6)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                        </svg>
                        {duration} min
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {drillCount} drills
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {commentCount}
                    </div>

                    <div style={{ marginLeft: 'auto' }}>
                        {formatDate(session.created_at)}
                    </div>
                </div>
            </div>
        </Link>
    )
}

function formatDate(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`
    return `${Math.floor(diffDays / 365)}y ago`
}
