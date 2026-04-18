import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Certifications from './components/Certifications'
import Projects from './components/Projects'
import CommentBox from './components/CommentBox'
import CommentViewer from './components/CommentViewer'
import Contact from './components/Contact'
import Footer from './components/Footer'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import { authAPI } from './services/api'

function ProfilePage({ onCommentSubmitted }) {
  return (
    <div className="app">
      <Header />
      <main>
        <About />
        <Skills />
        <Experience />
        <Certifications />
        <Projects />
        <CommentBox onCommentSubmitted={onCommentSubmitted} />
        <CommentViewer key={Math.random()} />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

function AdminPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    verifyAuth()
  }, [])

  const verifyAuth = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      if (token) {
        const response = await authAPI.verify()
        if (response.data.valid) {
          setUser(response.data.user)
        } else {
          localStorage.removeItem('admin_token')
          localStorage.removeItem('admin_user')
        }
      }
    } catch (err) {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
    } finally {
      setLoading(false)
    }
  }

  const handleLoginSuccess = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    setUser(null)
  }

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>Loading...</div>
  }

  if (!user) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />
  }

  return <AdminDashboard user={user} onLogout={handleLogout} />
}

export default function App() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProfilePage onCommentSubmitted={() => setRefreshKey(k => k + 1)} />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  )
}
