'use client'
import { useState } from 'react'
import { createClientComponentClient } from '@/app/lib/supabase'
import styles from './ProfileHeader.module.css'

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
        if (formData.bio && formData.bio.length > 500) {
            alert('Bio must be 500 characters or less')
            return
        }

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
        <div className={styles.headerContainer}>
            {/* Avatar Section */}
            <div className={styles.avatarSection}>
                <div className={styles.avatarWrapper}>
                    <div className={styles.avatar}>
                        {profile?.avatar_url ? (
                            <img
                                src={profile.avatar_url}
                                alt={profile.display_name}
                                className={styles.avatarImage}
                            />
                        ) : (
                            <div className={styles.avatarPlaceholder}>
                                {profile?.display_name?.charAt(0)?.toUpperCase() || 'C'}
                            </div>
                        )}
                    </div>

                    {isOwnProfile && (
                        <label className={styles.uploadButton}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                className={styles.uploadInput}
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
                            className={styles.inputField}
                            placeholder="Display Name"
                        />
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className={styles.inputFieldSmall}
                            placeholder="Location"
                        />
                    </>
                ) : (
                    <>
                        <h2 className={styles.displayName}>
                            {profile?.display_name || 'Coach'}
                        </h2>
                        {profile?.location && (
                            <p className={styles.location}>
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
                        className={styles.textareaField}
                        placeholder="Bio"
                    />
                ) : profile?.bio ? (
                    <p className={styles.bio}>
                        {profile.bio}
                    </p>
                ) : null}

                {isOwnProfile && !isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className={styles.editButton}
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statNumber}>
                        {stats?.sessions_created || 0}
                    </div>
                    <div className={styles.statLabel}>
                        Sessions
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statNumber}>
                        {stats?.drills_posted || 0}
                    </div>
                    <div className={styles.statLabel}>
                        Drills
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statNumber}>
                        {stats?.upvotes_received || 0}
                    </div>
                    <div className={styles.statLabel}>
                        Upvotes
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statNumber}>
                        {bootRoomAge}
                    </div>
                    <div className={styles.statLabel}>
                        Boot Room Age
                    </div>
                </div>
            </div>

            {/* Clubs & Schools */}
            <div className={styles.clubsSection}>
                <h3 className={styles.sectionTitle}>
                    Clubs & Schools
                </h3>
                {isEditing ? (
                    <input
                        type="text"
                        value={formData.clubs_schools.join(', ')}
                        onChange={(e) => handleClubsChange(e.target.value)}
                        className={styles.inputFieldSmall}
                        placeholder="e.g., Liverpool FC, Manchester United (comma-separated)"
                    />
                ) : profile?.clubs_schools?.length > 0 ? (
                    <div className={styles.clubsList}>
                        {profile.clubs_schools.map((club, idx) => (
                            <span key={idx} className={styles.clubBadge}>
                                {club}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className={styles.emptyText}>
                        No clubs or schools listed
                    </p>
                )}
            </div>

            {/* Licenses */}
            {(profile?.licenses?.length > 0 || isEditing) && (
                <div className={styles.licensesSection}>
                    <h3 className={styles.sectionTitle}>
                        Licenses & Badges
                    </h3>
                    {profile?.licenses?.length > 0 ? (
                        <div className={styles.licensesList}>
                            {profile.licenses.map((license, idx) => (
                                <span key={idx} className={styles.licenseBadge}>
                                    {license}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className={styles.emptyText}>
                            No licenses listed
                        </p>
                    )}
                </div>
            )}

            {/* Save/Cancel Buttons */}
            {isEditing && (
                <div className={styles.actionButtons}>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={styles.saveButton}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                        onClick={handleCancel}
                        disabled={saving}
                        className={styles.cancelButton}
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
