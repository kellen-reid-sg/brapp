'use client'
import { useState } from 'react'
import { createClientComponentClient } from '@/app/lib/supabase'
import styles from './CommentForm.module.css'

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
    <form onSubmit={handleSubmit} className={styles.commentForm}>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Add a comment..."
        disabled={isSubmitting}
        className={styles.textarea}
        onFocus={(e) => e.target.style.borderColor = 'rgba(22,163,74,0.5)'}
        onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
      />
      
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}
      
      <div className={styles.footer}>
        <span 
          className={styles.charCount}
          style={{
            color: body.length > 2000 ? '#F87171' : 'rgba(255,255,255,0.5)'
          }}
        >
          {body.length} / 2000
        </span>
        
        <button
          type="submit"
          disabled={isSubmitting || !body.trim()}
          className={styles.submitButton}
          style={{
            backgroundColor: isSubmitting || !body.trim() ? 'rgba(255,255,255,0.1)' : 'rgba(22,163,74,0.8)',
            color: isSubmitting || !body.trim() ? 'rgba(255,255,255,0.4)' : 'white',
            cursor: isSubmitting || !body.trim() ? 'not-allowed' : 'pointer'
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
