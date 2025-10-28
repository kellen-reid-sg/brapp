'use client'
import { useState } from 'react'
import { createClientComponentClient } from '@/app/lib/supabase'

export default function CommentForm({ contentKind, contentId, onCommentAdded }) {
  const supabase = createClientComponentClient()
  const [body, setBody] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    
    if (!body.trim()) {
      setError('Comment cannot be empty')
      return
    }

    if (body.length > 2000) {
      setError('Comment must be less than 2000 characters')
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      alert('Please log in to comment')
      return
    }

    setIsSubmitting(true)
    setError(null)

    const { data, error: insertError } = await supabase
      .from('comments')
      .insert({
        user_id: user.id,
        content_kind: contentKind,
        content_id: contentId,
        body: body.trim()
      })
      .select(`
        *,
        profiles(display_name, avatar_url)
      `)
      .single()

    if (insertError) {
      console.error('Error posting comment:', insertError)
      setError('Failed to post comment. Please try again.')
      setIsSubmitting(false)
      return
    }

    setBody('')
    setIsSubmitting(false)
    
    if (onCommentAdded) {
      onCommentAdded(data)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{
      backgroundColor: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.10)',
      borderRadius: '8px',
      padding: '16px'
    }}>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Add a comment..."
        disabled={isSubmitting}
        style={{
          width: '100%',
          minHeight: '100px',
          padding: '12px',
          backgroundColor: 'rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '6px',
          color: 'white',
          fontSize: '14px',
          lineHeight: '1.5',
          resize: 'vertical',
          fontFamily: 'inherit',
          outline: 'none'
        }}
        onFocus={(e) => e.target.style.borderColor = 'rgba(22,163,74,0.5)'}
        onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
      />
      
      {error && (
        <div style={{
          marginTop: '8px',
          padding: '8px 12px',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '4px',
          color: '#F87171',
          fontSize: '13px'
        }}>
          {error}
        </div>
      )}
      
      <div style={{
        marginTop: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{
          fontSize: '13px',
          color: body.length > 2000 ? '#F87171' : 'rgba(255,255,255,0.5)'
        }}>
          {body.length} / 2000
        </span>
        
        <button
          type="submit"
          disabled={isSubmitting || !body.trim()}
          style={{
            padding: '8px 20px',
            backgroundColor: isSubmitting || !body.trim() ? 'rgba(255,255,255,0.1)' : 'rgba(22,163,74,0.8)',
            border: 'none',
            borderRadius: '6px',
            color: isSubmitting || !body.trim() ? 'rgba(255,255,255,0.4)' : 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: isSubmitting || !body.trim() ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting && body.trim()) {
              e.currentTarget.style.backgroundColor = 'rgba(22,163,74,1)'
            }
          }}
          onMouseLeave={(e) => {
            if (!isSubmitting && body.trim()) {
              e.currentTarget.style.backgroundColor = 'rgba(22,163,74,0.8)'
            }
          }}
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </form>
  )
}
