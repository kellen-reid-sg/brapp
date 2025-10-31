'use client'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@/app/lib/supabase'
import { useState } from 'react'
import styles from './SessionBuilder.module.css'

export default function SessionBuilder({
  selectedDrills,
  sessionTitle,
  sessionDescription,
  sessionDate,
  totalDuration,
  onTitleChange,
  onDescriptionChange,
  onDateChange,
  onRemoveDrill,
  onMoveDrill,
  onUpdateDuration,
  onUpdateNotes
}) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [saving, setSaving] = useState(false)

  // Custom scrollbar styles
  const scrollbarStyles = `
    .session-builder-scroll::-webkit-scrollbar {
      width: 8px;
    }
    .session-builder-scroll::-webkit-scrollbar-track {
      background: rgba(255,255,255,0.05);
      border-radius: 4px;
    }
    .session-builder-scroll::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.2);
      border-radius: 4px;
    }
    .session-builder-scroll::-webkit-scrollbar-thumb:hover {
      background: rgba(255,255,255,0.3);
    }
  `

  async function handleSaveSession() {
    if (!sessionTitle.trim()) {
      alert('Please enter a session title')
      return
    }

    if (selectedDrills.length === 0) {
      alert('Please add at least one drill to the session')
      return
    }

    setSaving(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        alert('Please log in to save sessions')
        router.push('/auth/login')
        return
      }

      // 1. Insert session
      const { data: session, error: sessionError } = await supabase
        .from('sessions')
        .insert({
          author_id: user.id,
          title: sessionTitle,
          description: sessionDescription,
          session_date: sessionDate || null,
          total_duration: totalDuration,
          is_public: true
        })
        .select()
        .single()

      if (sessionError) {
        console.error('Error saving session:', sessionError)
        alert('Failed to save session')
        setSaving(false)
        return
      }

      // 2. Insert session_drills
      const drillsToInsert = selectedDrills.map(d => ({
        session_id: session.id,
        drill_id: d.drill.id,
        order_index: d.order_index,
        custom_duration: d.custom_duration,
        notes: d.notes
      }))

      const { error: drillsError } = await supabase
        .from('session_drills')
        .insert(drillsToInsert)

      if (drillsError) {
        console.error('Error saving session drills:', drillsError)
        alert('Failed to save session drills')
        setSaving(false)
        return
      }

      // 3. Navigate to session view
      router.push(`/sessions/${session.id}`)
    } catch (error) {
      console.error('Unexpected error:', error)
      alert('An error occurred while saving')
      setSaving(false)
    }
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
      'Warm-up': { bg: 'rgba(251, 191, 36, 0.15)', border: 'rgba(251, 191, 36, 0.3)', text: '#FCD34D' },
      'Passing': { bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.3)', text: '#60A5FA' },
      'Possession': { bg: 'rgba(139, 92, 246, 0.15)', border: 'rgba(139, 92, 246, 0.3)', text: '#A78BFA' },
      'Finishing': { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.3)', text: '#F87171' },
      'Defending': { bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.3)', text: '#4ADE80' },
      'Dribbling': { bg: 'rgba(236, 72, 153, 0.15)', border: 'rgba(236, 72, 153, 0.3)', text: '#F472B6' },
      'Technical': { bg: 'rgba(34, 211, 238, 0.15)', border: 'rgba(34, 211, 238, 0.3)', text: '#22D3EE' }
    }
    return colors[category] || colors['Technical']
  }

  return (
    <>
      <style>{scrollbarStyles}</style>
      <div className={styles.container}>
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{
          fontSize: '24px',
          fontWeight: '700',
          fontStyle: 'italic',
          color: 'white',
          marginBottom: '4px',
          textTransform: 'uppercase'
        }}>
          Your Session
        </h3>
        <p style={{
          fontSize: '13px',
          fontStyle: 'italic',
          color: 'rgba(255,255,255,0.6)',
          lineHeight: '1.4'
        }}>
          Craft your perfect session
        </p>
      </div>

      {/* Session Date Input */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{
          display: 'block',
          fontSize: '10px',
          fontWeight: '600',
          color: 'white',
          marginBottom: '3px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Session Date
        </label>
        <input
          type="date"
          value={sessionDate}
          onChange={(e) => onDateChange(e.target.value)}
          style={{
            width: '130px',
            padding: '6px 10px',
            backgroundColor: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: '5px',
            color: 'white',
            fontSize: '12px',
            fontWeight: '600',
            outline: 'none',
            boxSizing: 'border-box',
            colorScheme: 'dark'
          }}
        />
      </div>

      {/* Session Title Input */}
      <input
        type="text"
        placeholder="Session Title (e.g., U12 Passing Practice)"
        value={sessionTitle}
        onChange={(e) => onTitleChange(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 14px',
          backgroundColor: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: '6px',
          color: 'white',
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '12px',
          outline: 'none',
          boxSizing: 'border-box'
        }}
      />

      {/* Session Description */}
      <textarea
        placeholder="Optional description..."
        value={sessionDescription}
        onChange={(e) => onDescriptionChange(e.target.value)}
        rows={2}
        style={{
          width: '100%',
          padding: '10px 14px',
          backgroundColor: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: '6px',
          color: 'white',
          fontSize: '13px',
          marginBottom: '16px',
          outline: 'none',
          resize: 'none',
          fontFamily: 'inherit',
          boxSizing: 'border-box'
        }}
      />

      {/* Drill List */}
      <div className="session-builder-scroll" style={{
        flex: 1,
        overflowY: 'auto',
        marginRight: '-8px',
        paddingRight: '8px',
        marginBottom: '16px'
      }}>
        {selectedDrills.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: 'rgba(255,255,255,0.5)',
            padding: '48px 24px',
            border: '2px dashed rgba(255,255,255,0.10)',
            borderRadius: '8px'
          }}>
            <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" style={{ margin: '0 auto 12px', opacity: 0.5 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <p style={{ fontSize: '14px' }}>Add drills from the left to start building your session</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {selectedDrills.map((item, index) => {
              const category = item.drill.category || getCategoryFromTitle(item.drill.title)
              const categoryColor = getCategoryColor(category)

              return (
                <div
                  key={`${item.drill.id}-${index}`}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    padding: '12px',
                    transition: 'all 0.2s'
                  }}
                >
                  {/* Drill Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: '10px'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px'
                      }}>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: '700',
                          color: 'rgba(255,255,255,0.5)'
                        }}>
                          #{index + 1}
                        </span>
                        <h4 style={{
                          fontSize: '14px',
                          fontWeight: '700',
                          fontStyle: 'italic',
                          color: 'white',
                          lineHeight: '1.3'
                        }}>
                          {item.drill.title}
                        </h4>
                      </div>
                      <span style={{ 
                        padding: '2px 8px',
                        backgroundColor: categoryColor.bg,
                        border: `1px solid ${categoryColor.border}`,
                        borderRadius: '3px',
                        color: categoryColor.text,
                        fontSize: '10px',
                        fontWeight: '600'
                      }}>
                        {category}
                      </span>
                    </div>

                    {/* Controls */}
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {/* Move Up */}
                      <button
                        onClick={() => onMoveDrill(index, -1)}
                        disabled={index === 0}
                        className={styles.controlButton}
                        style={{
                          color: index === 0 ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)',
                          cursor: index === 0 ? 'not-allowed' : 'pointer'
                        }}
                      >
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path d="M18 15l-6-6-6 6" />
                        </svg>
                      </button>

                      {/* Move Down */}
                      <button
                        onClick={() => onMoveDrill(index, 1)}
                        disabled={index === selectedDrills.length - 1}
                        className={styles.controlButton}
                        style={{
                          color: index === selectedDrills.length - 1 ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)',
                          cursor: index === selectedDrills.length - 1 ? 'not-allowed' : 'pointer'
                        }}
                      >
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </button>

                      {/* Remove */}
                      <button
                        onClick={() => onRemoveDrill(index)}
                        className={styles.deleteButton}
                      >
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Duration Input */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '8px'
                  }}>
                    <label style={{
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.6)',
                      fontWeight: '600'
                    }}>
                      Duration:
                    </label>
                    <input
                      type="number"
                      value={item.custom_duration}
                      onChange={(e) => onUpdateDuration(index, e.target.value)}
                      min="1"
                      style={{
                        width: '50px',
                        padding: '4px 6px',
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.10)',
                        borderRadius: '4px',
                        color: 'white',
                        fontSize: '12px',
                        outline: 'none',
                        textAlign: 'center'
                      }}
                    />
                    <span style={{
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.6)'
                    }}>
                      mins
                    </span>
                  </div>

                  {/* Notes Input */}
                  <input
                    type="text"
                    placeholder="Add notes (optional)..."
                    value={item.notes}
                    onChange={(e) => onUpdateNotes(index, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '6px 10px',
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.10)',
                      borderRadius: '4px',
                      color: 'white',
                      fontSize: '11px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer - Total Duration & Save Button */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.10)',
        paddingTop: '16px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <span style={{
            fontSize: '14px',
            fontWeight: '600',
            color: 'rgba(255,255,255,0.7)'
          }}>
            Total Duration:
          </span>
          <span style={{
            fontSize: '20px',
            fontWeight: '700',
            fontStyle: 'italic',
            color: '#4ADE80'
          }}>
            {totalDuration} mins
          </span>
        </div>

        <button
          onClick={handleSaveSession}
          disabled={saving || !sessionTitle.trim() || selectedDrills.length === 0}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: saving || !sessionTitle.trim() || selectedDrills.length === 0 
              ? 'rgba(255,255,255,0.10)' 
              : 'rgba(34, 197, 94, 0.20)',
            border: saving || !sessionTitle.trim() || selectedDrills.length === 0
              ? '1px solid rgba(255,255,255,0.10)'
              : '2px solid #4ADE80',
            borderRadius: '8px',
            color: saving || !sessionTitle.trim() || selectedDrills.length === 0
              ? 'rgba(255,255,255,0.4)'
              : '#4ADE80',
            fontSize: '16px',
            fontWeight: '700',
            fontStyle: 'italic',
            textTransform: 'uppercase',
            cursor: saving || !sessionTitle.trim() || selectedDrills.length === 0 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {saving ? 'Saving...' : 'Save Session'}
        </button>
      </div>
      </div>
    </>
  )
}
