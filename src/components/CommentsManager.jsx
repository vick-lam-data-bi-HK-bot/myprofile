import React, { useState, useEffect } from 'react'
import { adminAPI } from '../services/api'
import '../styles/admin.css'

export default function CommentsManager({ onUpdate }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadComments()
  }, [])

  const loadComments = async () => {
    try {
      const response = await adminAPI.getComments()
      setComments(response.data.comments || [])
    } catch (err) {
      setMessage('❌ Failed to load comments')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id, approved) => {
    try {
      await adminAPI.approveComment(id, !approved)
      loadComments()
      onUpdate()
      setMessage(approved ? '✅ Comment rejected' : '✅ Comment approved')
    } catch (err) {
      setMessage('❌ Failed to update comment')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return

    try {
      await adminAPI.deleteComment(id)
      loadComments()
      onUpdate()
      setMessage('✅ Comment deleted')
    } catch (err) {
      setMessage('❌ Failed to delete comment')
    }
  }

  if (loading) {
    return <div className="cms-section"><p>Loading comments...</p></div>
  }

  return (
    <div className="cms-section">
      <h2>Comments Management</h2>

      {message && <div className="message">{message}</div>}

      {comments.length === 0 ? (
        <p className="no-data">No comments yet</p>
      ) : (
        <div className="comments-list">
          {comments.map((comment) => (
            <div key={comment.id} className={`comment-item ${comment.approved ? 'approved' : 'pending'}`}>
              <div className="comment-header">
                <strong>{comment.name}</strong>
                <span className="comment-email">{comment.email}</span>
                <span className={`comment-status ${comment.approved ? 'approved' : 'pending'}`}>
                  {comment.approved ? '✅ Approved' : '⏳ Pending'}
                </span>
              </div>
              
              <p className="comment-message">{comment.message}</p>
              
              <div className="comment-meta">
                <small>{new Date(comment.created_at).toLocaleString()}</small>
              </div>

              <div className="comment-actions">
                <button
                  onClick={() => handleApprove(comment.id, comment.approved)}
                  className={`btn-action ${comment.approved ? 'btn-reject' : 'btn-approve'}`}
                >
                  {comment.approved ? '❌ Reject' : '✅ Approve'}
                </button>
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="btn-action btn-delete"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
