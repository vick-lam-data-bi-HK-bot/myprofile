import React, { useState, useEffect } from 'react'
import { adminAPI } from '../services/api'
import CMSProfilePicEditor from './CMSProfilePicEditor'
import CommentsManager from './CommentsManager'
import TrafficAnalytics from './TrafficAnalytics'
import '../styles/admin.css'

export default function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('profile')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await adminAPI.getStats()
      setStats(response.data.stats)
    } catch (err) {
      console.error('Failed to load stats:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-content">
          <h1>📊 CMS Dashboard</h1>
          <div className="user-info">
            <span>Welcome, <strong>{user?.username}</strong></span>
            <button onClick={onLogout} className="btn-logout">Logout</button>
          </div>
        </div>
      </header>

      {!loading && stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{stats.approved_comments || 0}</div>
            <div className="stat-label">Approved Comments</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.pending_comments || 0}</div>
            <div className="stat-label">Pending Comments</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.visits_today || 0}</div>
            <div className="stat-label">Visits Today</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.unique_visitors_week || 0}</div>
            <div className="stat-label">Unique Visitors (7d)</div>
          </div>
        </div>
      )}

      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          🖼️ Profile Picture
        </button>
        <button 
          className={`tab-button ${activeTab === 'comments' ? 'active' : ''}`}
          onClick={() => setActiveTab('comments')}
        >
          💬 Comments ({stats?.pending_comments || 0})
        </button>
        <button 
          className={`tab-button ${activeTab === 'traffic' ? 'active' : ''}`}
          onClick={() => setActiveTab('traffic')}
        >
          📈 Traffic Analytics
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'profile' && <CMSProfilePicEditor onUpdate={loadStats} />}
        {activeTab === 'comments' && <CommentsManager onUpdate={loadStats} />}
        {activeTab === 'traffic' && <TrafficAnalytics />}
      </div>
    </div>
  )
}
