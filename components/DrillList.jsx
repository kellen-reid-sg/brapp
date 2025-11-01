'use client'
import { useState } from 'react'
import Link from 'next/link'
import styles from './DrillList.module.css'

export default function DrillList({ createdDrills, upvotedDrills, favoritedDrills, isOwnProfile }) {
    const [activeTab, setActiveTab] = useState('created')

    const drills = activeTab === 'created' ? createdDrills : activeTab === 'upvoted' ? upvotedDrills : favoritedDrills

    return (
        <div>
            {/* Underlined Subtabs */}
            <div className={styles.subtabsContainer}>
                <button
                    onClick={() => setActiveTab('created')}
                    className={`${styles.subtabButton} ${activeTab === 'created' ? styles.active : ''}`}
                >
                    Created ({createdDrills?.length || 0})
                </button>
                <button
                    onClick={() => setActiveTab('upvoted')}
                    className={`${styles.subtabButton} ${activeTab === 'upvoted' ? styles.active : ''}`}
                >
                    Upvoted ({upvotedDrills?.length || 0})
                </button>
                <button
                    onClick={() => setActiveTab('favorited')}
                    className={`${styles.subtabButton} ${activeTab === 'favorited' ? styles.active : ''}`}
                >
                    Favorited ({favoritedDrills?.length || 0})
                </button>
            </div>

            {/* Drill grid or empty state */}
            {!drills || drills.length === 0 ? (
                <EmptyState tab={activeTab} isOwnProfile={isOwnProfile} />
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '16px'
                }}>
                    {drills.map((drill) => (
                        <DrillCard key={drill.id} drill={drill} />
                    ))}
                </div>
            )}
        </div>
    )
}

function EmptyState({ tab, isOwnProfile }) {
    const messages = {
        created: {
            title: 'No Drills Created',
            description: isOwnProfile
                ? "You haven't created any drills yet"
                : "This coach hasn't created any drills yet"
        },
        upvoted: {
            title: 'No Drills Upvoted',
            description: isOwnProfile
                ? "You haven't upvoted any drills yet"
                : "This coach hasn't upvoted any drills yet"
        },
        favorited: {
            title: 'No Favorited Drills',
            description: isOwnProfile
                ? "You haven't favorited any drills yet"
                : "This coach hasn't favorited any drills yet"
        }
    }

    const message = messages[tab]

    return (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <svg width="64" height="64" fill="none" stroke="rgba(255,255,255,0.3)" viewBox="0 0 24 24" strokeWidth={1.5} style={{ margin: '0 auto 24px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
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
                    href="/drills"
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
                    Browse Drills
                </Link>
            )}
        </div>
    )
}

function DrillCard({ drill }) {
    const score = drill.drill_stats?.score || 0
    const commentCount = drill.drill_stats?.comment_count || 0

    return (
        <Link href={`/drills/${drill.id}`} style={{ textDecoration: 'none' }}>
            <div
                style={{
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    borderRadius: '12px',
                    padding: '16px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#16a34a'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'}
            >
                {/* Image placeholder */}
                <div style={{
                    width: '100%',
                    height: '120px',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {drill.media_url ? (
                        <img
                            src={drill.media_url}
                            alt={drill.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <svg width="48" height="48" fill="none" stroke="rgba(255,255,255,0.3)" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        fontStyle: 'italic',
                        color: 'white',
                        marginBottom: '8px',
                        lineHeight: '1.3'
                    }}>
                        {drill.title}
                    </h3>

                    {drill.description && (
                        <p style={{
                            fontSize: '13px',
                            color: 'rgba(255,255,255,0.6)',
                            lineHeight: '1.4',
                            marginBottom: '12px',
                            flex: 1
                        }}>
                            {drill.description.length > 80 ? drill.description.substring(0, 80) + '...' : drill.description}
                        </p>
                    )}

                    {/* Tags */}
                    {drill.skill_tags && drill.skill_tags.length > 0 && (
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '6px',
                            marginBottom: '12px'
                        }}>
                            {drill.skill_tags.slice(0, 2).map((tag, idx) => (
                                <span
                                    key={idx}
                                    style={{
                                        padding: '4px 8px',
                                        backgroundColor: 'rgba(22,163,74,0.15)',
                                        border: '1px solid rgba(22,163,74,0.3)',
                                        borderRadius: '4px',
                                        color: '#4ADE80',
                                        fontSize: '11px',
                                        fontWeight: '600'
                                    }}
                                >
                                    {tag}
                                </span>
                            ))}
                            {drill.skill_tags.length > 2 && (
                                <span style={{
                                    padding: '4px 8px',
                                    color: 'rgba(255,255,255,0.5)',
                                    fontSize: '11px',
                                    fontWeight: '600'
                                }}>
                                    +{drill.skill_tags.length - 2}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Stats */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        fontSize: '12px',
                        color: 'rgba(255,255,255,0.6)',
                        marginTop: 'auto'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path d="M5 15l7-7 7 7" />
                            </svg>
                            {score}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            {commentCount}
                        </div>

                        <div style={{ marginLeft: 'auto' }}>
                            {formatDate(drill.created_at)}
                        </div>
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
