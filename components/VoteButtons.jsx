'use client'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/app/lib/supabase'

export default function VoteButtons({ contentKind, contentId, initialScore, userVote }) {
  const supabase = createClientComponentClient()
  const [score, setScore] = useState(initialScore || 0)
  const [voted, setVoted] = useState(userVote || null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    setScore(initialScore || 0)
    setVoted(userVote || null)
  }, [initialScore, userVote])

  async function handleVote(e, value) {
    // Stop click from bubbling to parent card
    e.stopPropagation()
    e.preventDefault()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      alert('Please log in to vote')
      return
    }

    // Optimistic update
    const newVote = voted === value ? null : value
    const oldVote = voted
    setVoted(newVote)
    setScore(score + (newVote || 0) - (oldVote || 0))

    // Upsert or delete vote
    if (newVote === null) {
      const { error } = await supabase
        .from('votes')
        .delete()
        .eq('user_id', user.id)
        .eq('content_kind', contentKind)
        .eq('content_id', contentId)
      
      if (error) {
        console.error('Error deleting vote:', error)
        // Revert optimistic update
        setVoted(oldVote)
        setScore(score)
      }
    } else {
      const { error } = await supabase
        .from('votes')
        .upsert({
          user_id: user.id,
          content_kind: contentKind,
          content_id: contentId,
          value: newVote
        }, { onConflict: 'user_id,content_kind,content_id' })
      
      if (error) {
        console.error('Error upserting vote:', error)
        // Revert optimistic update
        setVoted(oldVote)
        setScore(score)
      }
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      minWidth: '80px',
      alignSelf: 'center'
    }}>
      <button 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={(e) => handleVote(e, 1)}
        style={{
          padding: '4px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <svg 
          width="32" 
          height="32" 
          fill={voted === 1 ? '#16a34a' : 'none'}
          stroke={voted === 1 ? '#16a34a' : 'white'}
          viewBox="0 0 24 24" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M5 15l7-7 7 7" />
        </svg>
      </button>
      <span style={{
        fontSize: '20px',
        fontWeight: '700',
        color: voted === 1 ? '#16a34a' : 'rgba(255,255,255,0.8)',
        fontVariantNumeric: 'tabular-nums',
        lineHeight: '1'
      }}>
        {score}
      </span>
    </div>
  )
}
