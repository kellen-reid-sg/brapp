'use client'

export default function CommentList({ comments = [] }) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
        No comments yet. Be the first to comment!
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {comments.map(comment => (
        <div key={comment.id} style={{
          backgroundColor: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: '8px',
          padding: '16px'
        }}>
          <div className="flex items-center gap-2 mb-2">
            <span style={{
              fontWeight: '600',
              color: 'white'
            }}>
              {comment.profiles?.display_name || 'Anonymous'}
            </span>
            <span style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.5)'
            }}>
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.8)' }}>{comment.body}</p>
        </div>
      ))}
    </div>
  )
}
