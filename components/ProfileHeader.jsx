'use client'
import { useState } from 'react'
import { createClientComponentClient } from '@/app/lib/supabase'

export default function ProfileHeader({ profile, stats, isOwnProfile, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        display_name: profile?.display_name || '',
        bio: profile?.bio || '',
        location: profile?.location || '',
        clubs_schools: profile?.clubs_schools || []
    })
    const [uploading, setUploading] = useState(false)
    const [saving, setSaving] = useState(false)

    const bootRoomAge = profile?.created_at
        ? getTimeSinceJoined(new Date(profile.created_at))
        : '0d'

    async function handleAvatarUpload(e) {
        const file = e.target.files?.[0]
        if (!file) return

        const supabase = createClientComponentClient()
        setUploading(true)
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${profile.id}-${Date.now()}.${fileExt}`
            const filePath = `avatars/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('profile-images')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('profile-images')
                .getPublicUrl(filePath)

            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', profile.id)

            if (updateError) throw updateError

            onUpdate?.()
        } catch (error) {
            console.error('Error uploading avatar:', error)
            alert('Failed to upload avatar')
        } finally {
            setUploading(false)
        }
    }

    async function handleSave() {
        const supabase = createClientComponentClient()
        setSaving(true)
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    display_name: formData.display_name,
                    bio: formData.bio,
                    location: formData.location,
                    clubs_schools: formData.clubs_schools
                })
                .eq('id', profile.id)

            if (error) throw error

            setIsEditing(false)
            onUpdate?.()
        } catch (error) {
            console.error('Error updating profile:', error)
            alert('Failed to update profile')
        } finally {
            setSaving(false)
        }
    }

    function handleCancel() {
        setFormData({
            display_name: profile?.display_name || '',
            bio: profile?.bio || '',
            location: profile?.location || '',
            clubs_schools: profile?.clubs_schools || []
        })
        setIsEditing(false)
    }

    function handleClubsChange(value) {
        const clubs = value.split(',').map(c => c.trim()).filter(Boolean)
        setFormData({ ...formData, clubs_schools: clubs })
    }

    return (
        <div style={{
            backgroundColor: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: '12px',
            overflow: 'hidden',
            transition: 'all 0.2s',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Avatar Section */}
            <div style={{ padding: '32px 24px 24px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        border: '3px solid white',
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        overflow: 'hidden'
                    }}>
                        {profile?.avatar_url ? (
                            <img
                                src={profile.avatar_url}
                                alt={profile.display_name}
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
                                fontSize: '48px',
                                fontWeight: '900',
                                fontStyle: 'italic'
                            }}>
                                {profile?.display_name?.charAt(0)?.toUpperCase() || 'C'}
                            </div>
                        )}
                    </div>

                    {isOwnProfile && (
                        <label style={{
                            position: 'absolute',
                            bottom: '4px',
                            right: '4px',
                            backgroundColor: 'rgba(26,26,26,0.95)',
                            border: '1px solid rgba(255,255,255,0.20)',
                            borderRadius: '50%',
                            padding: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                style={{ display: 'none' }}
                                disabled={uploading}
                            />
                            <svg width="16" height="16" fill="none" stroke="rgba(255,255,255,0.9)" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <circle cx="12" cy="13" r="3" />
                            </svg>
                        </label>
                    )}
                </div>

                {/* Name and Location */}
                {isEditing ? (
                    <>
                        <input
                            type="text"
                            value={formData.display_name}
                            onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                            style={{
                                width: '100%',
                                backgroundColor: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.20)',
                                borderRadius: '6px',
                                padding: '8px 12px',
                                color: 'white',
                                fontSize: '20px',
                                fontWeight: '700',
                                fontStyle: 'italic',
                                textAlign: 'center',
                                marginBottom: '8px'
                            }}
                            placeholder="Display Name"
                        />
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            style={{
                                width: '100%',
                                backgroundColor: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.20)',
                                borderRadius: '6px',
                                padding: '6px 12px',
                                color: 'rgba(255,255,255,0.7)',
                                fontSize: '14px',
                                textAlign: 'center',
                                marginBottom: '8px'
                            }}
                            placeholder="Location"
                        />
                    </>
                ) : (
                    <>
                        <h2 style={{
                            fontSize: '24px',
                            fontWeight: '900',
                            fontStyle: 'italic',
                            color: 'white',
                            marginBottom: '4px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.02em'
                        }}>
                            {profile?.display_name || 'Coach'}
                        </h2>
                        {profile?.location && (
                            <p style={{
                                fontSize: '14px',
                                color: 'rgba(255,255,255,0.6)',
                                marginBottom: '12px'
                            }}>
                                {profile.location}
                            </p>
                        )}
                    </>
                )}

                {/* Bio */}
                {isEditing ? (
                    <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        style={{
                            width: '100%',
                            backgroundColor: 'rgba(255,255,255,0.08)',
                            border: '1px solid rgba(255,255,255,0.20)',
                            borderRadius: '6px',
                            padding: '8px 12px',
                            color: 'rgba(255,255,255,0.9)',
                            fontSize: '14px',
                            minHeight: '80px',
                            fontFamily: 'inherit',
                            resize: 'vertical'
                        }}
                        placeholder="Bio"
                    />
                ) : profile?.bio ? (
                    <p style={{
                        fontSize: '14px',
                        color: 'rgba(255,255,255,0.7)',
                        lineHeight: '1.5',
                        marginTop: '12px'
                    }}>
                        {profile.bio}
                    </p>
                ) : null}

                {isOwnProfile && !isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        style={{
                            marginTop: '16px',
                            padding: '6px 16px',
                            backgroundColor: 'rgba(255,255,255,0.08)',
                            border: '1px solid rgba(255,255,255,0.20)',
                            borderRadius: '6px',
                            color: 'rgba(255,255,255,0.9)',
                            fontSize: '13px',
                            fontWeight: '600',
                            fontStyle: 'italic',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'
                            e.currentTarget.style.borderColor = '#16a34a'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'
                        }}
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                padding: '20px',
                borderBottom: '1px solid rgba(255,255,255,0.10)'
            }}>
                <div style={{
                    padding: '20px',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    border: '2px solid rgba(255,255,255,0.20)',
                    borderRadius: '8px',
                    textAlign: 'center',
                    transition: 'all 0.2s'
                }}>
                    <div style={{
                        fontSize: '32px',
                        fontWeight: '900',
                        color: '#16a34a',
                        fontVariantNumeric: 'tabular-nums'
                    }}>
                        {stats?.sessions_created || 0}
                    </div>
                    <div style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: 'rgba(255,255,255,0.5)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em'
                    }}>
                        Sessions
                    </div>
                </div>
                <div style={{
                    padding: '20px',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    border: '2px solid rgba(255,255,255,0.20)',
                    borderRadius: '8px',
                    textAlign: 'center',
                    transition: 'all 0.2s'
                }}>
                    <div style={{
                        fontSize: '32px',
                        fontWeight: '900',
                        color: '#16a34a',
                        fontVariantNumeric: 'tabular-nums'
                    }}>
                        {stats?.drills_posted || 0}
                    </div>
                    <div style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: 'rgba(255,255,255,0.5)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em'
                    }}>
                        Drills
                    </div>
                </div>
                <div style={{
                    padding: '20px',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    border: '2px solid rgba(255,255,255,0.20)',
                    borderRadius: '8px',
                    textAlign: 'center',
                    transition: 'all 0.2s'
                }}>
                    <div style={{
                        fontSize: '32px',
                        fontWeight: '900',
                        color: '#16a34a',
                        fontVariantNumeric: 'tabular-nums'
                    }}>
                        {stats?.upvotes_received || 0}
                    </div>
                    <div style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: 'rgba(255,255,255,0.5)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em'
                    }}>
                        Upvotes
                    </div>
                </div>
                <div style={{
                    padding: '20px',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    border: '2px solid rgba(255,255,255,0.20)',
                    borderRadius: '8px',
                    textAlign: 'center',
                    transition: 'all 0.2s'
                }}>
                    <div style={{
                        fontSize: '32px',
                        fontWeight: '900',
                        color: '#16a34a',
                        fontVariantNumeric: 'tabular-nums'
                    }}>
                        {bootRoomAge}
                    </div>
                    <div style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: 'rgba(255,255,255,0.5)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em'
                    }}>
                        Boot Room Age
                    </div>
                </div>
            </div>

            {/* Clubs & Schools */}
            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: 'rgba(255,255,255,0.6)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '12px'
                }}>
                    Clubs & Schools
                </h3>
                {isEditing ? (
                    <input
                        type="text"
                        value={formData.clubs_schools.join(', ')}
                        onChange={(e) => handleClubsChange(e.target.value)}
                        style={{
                            width: '100%',
                            backgroundColor: 'rgba(255,255,255,0.08)',
                            border: '1px solid rgba(255,255,255,0.20)',
                            borderRadius: '6px',
                            padding: '8px 12px',
                            color: 'white',
                            fontSize: '14px'
                        }}
                        placeholder="e.g., Liverpool FC, Manchester United (comma-separated)"
                    />
                ) : profile?.clubs_schools?.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {profile.clubs_schools.map((club, idx) => (
                            <span
                                key={idx}
                                style={{
                                    padding: '6px 12px',
                                    backgroundColor: 'rgba(22,163,74,0.15)',
                                    border: '1px solid rgba(22,163,74,0.3)',
                                    borderRadius: '4px',
                                    color: '#4ADE80',
                                    fontSize: '12px',
                                    fontWeight: '600'
                                }}
                            >
                                {club}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p style={{
                        fontSize: '14px',
                        color: 'rgba(255,255,255,0.4)',
                        fontStyle: 'italic'
                    }}>
                        No clubs or schools listed
                    </p>
                )}
            </div>

            {/* Licenses */}
            {(profile?.licenses?.length > 0 || isEditing) && (
                <div style={{
                    padding: '20px',
                    borderTop: '1px solid rgba(255,255,255,0.10)'
                }}>
                    <h3 style={{
                        fontSize: '12px',
                        fontWeight: '700',
                        color: 'rgba(255,255,255,0.6)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        marginBottom: '12px'
                    }}>
                        Licenses & Badges
                    </h3>
                    {profile?.licenses?.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {profile.licenses.map((license, idx) => (
                                <span
                                    key={idx}
                                    style={{
                                        padding: '6px 12px',
                                        backgroundColor: 'rgba(251,191,36,0.15)',
                                        border: '1px solid rgba(251,191,36,0.3)',
                                        borderRadius: '4px',
                                        color: '#FCD34D',
                                        fontSize: '12px',
                                        fontWeight: '600'
                                    }}
                                >
                                    {license}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p style={{
                            fontSize: '14px',
                            color: 'rgba(255,255,255,0.4)',
                            fontStyle: 'italic'
                        }}>
                            No licenses listed
                        </p>
                    )}
                </div>
            )}

            {/* Save/Cancel Buttons */}
            {isEditing && (
                <div style={{
                    padding: '20px',
                    borderTop: '1px solid rgba(255,255,255,0.10)',
                    display: 'flex',
                    gap: '12px'
                }}>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        style={{
                            flex: 1,
                            padding: '12px',
                            backgroundColor: '#16a34a',
                            border: '1px solid #16a34a',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: '700',
                            fontStyle: 'italic',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            opacity: saving ? 0.5 : 1
                        }}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                        onClick={handleCancel}
                        disabled={saving}
                        style={{
                            flex: 1,
                            padding: '12px',
                            backgroundColor: 'transparent',
                            border: '1px solid rgba(255,255,255,0.20)',
                            borderRadius: '8px',
                            color: 'rgba(255,255,255,0.9)',
                            fontSize: '14px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            opacity: saving ? 0.5 : 1
                        }}
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    )
}

function getTimeSinceJoined(joinDate) {
    const now = new Date()
    const diffMs = now - joinDate
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays < 30) {
        return `${diffDays}d`
    } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30)
        return `${months}mo`
    } else {
        const years = Math.floor(diffDays / 365)
        return `${years}y`
    }
}
