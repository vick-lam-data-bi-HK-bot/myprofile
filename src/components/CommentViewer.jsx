import React, { useState, useEffect } from 'react'
import { commentsAPI } from '../services/api'
import '../styles/comments.css'

export default function CommentViewer() {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadComments()
  }, [])

  const loadComments = async () => {
    try {
      const response = await commentsAPI.getComments()
      setComments(response.data.comments || [])
    } catch (err) {
      console.error('Failed to load comments:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="section container"><p>Loading comments...</p></div>
  }

  return (
    <section id="comments-viewer" className="section container">
      <h2>📖 Recent Comments ({comments.length})</h2>

      {comments.length === 0 ? (
        <div className="no-comments">
          <p>No comments yet. Be the first to leave one! 👇</p>
        </div>
      ) : (
        <div className="comments-container">
          {comments.map((comment) => (
            <div key={comment.id} className="comment-card">
              <div className="comment-card-header">
                <h4>{comment.name}</h4>
                <span className="comment-date">
                  {new Date(comment.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <p className="comment-card-message">{comment.message}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
