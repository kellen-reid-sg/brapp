'use client'
import styles from './CommentList.module.css'

export default function CommentList({ comments = [] }) {
  if (comments.length === 0) {
    return (
      <div className={styles.emptyState}>
        No comments yet. Be the first to comment!
      </div>
    )
  }

  return (
    <div className={styles.commentsList}>
      {comments.map(comment => (
        <div key={comment.id} className={styles.commentItem}>
          <div className={styles.commentHeader}>
            <span className={styles.commentAuthor}>
              {comment.profiles?.display_name || 'Anonymous'}
            </span>
            <span className={styles.commentDate}>
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className={styles.commentBody}>{comment.body}</p>
        </div>
      ))}
    </div>
  )
}
