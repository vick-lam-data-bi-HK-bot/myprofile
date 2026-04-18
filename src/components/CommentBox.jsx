import React, { useState } from 'react'
import { commentsAPI } from '../services/api'
import '../styles/comments.css'

export default function CommentBox({ onCommentSubmitted }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await commentsAPI.postComment(
        formData.name,
        formData.email,
        formData.message
      )

      setMessage('✅ ' + response.data.message)
      setFormData({ name: '', email: '', message: '' })

      if (onCommentSubmitted) {
        onCommentSubmitted()
      }
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.error || 'Failed to submit comment'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="comment-box" className="section container">
      <h2>💬 Leave a Comment</h2>
      
      <form className="comment-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Your Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
            maxLength="50"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            required
            maxLength="100"
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your message here (max 1000 characters)"
            required
            maxLength="1000"
            rows="5"
          />
          <small>{formData.message.length}/1000</small>
        </div>

        {message && <div className="message">{message}</div>}

        <button type="submit" disabled={loading} className="btn-submit-comment">
          {loading ? 'Submitting...' : '📤 Submit Comment'}
        </button>
      </form>
    </section>
  )
}
