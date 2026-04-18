import React, { useState, useEffect } from 'react'
import { adminAPI } from '../services/api'

export default function Header(){
  const [profilePic, setProfilePic] = useState(null)

  useEffect(() => {
    loadProfilePic()
  }, [])

  const loadProfilePic = async () => {
    try {
      const response = await adminAPI.getProfilePic()
      if (response.data.success && response.data.profilePic) {
        setProfilePic(response.data.profilePic)
      }
    } catch (err) {
      console.error('Failed to load profile picture:', err)
      // Use default avatar if not found
    }
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="avatar" aria-hidden>
          {profilePic ? (
            <img src={profilePic} alt="Profile" className="avatar-image" />
          ) : (
            <div className="avatar-initials">VL</div>
          )}
        </div>
        <div className="title">
          <h1>Vick LAM (He/Him)</h1>
          <p className="headline">Strategic Data & Business Intelligence Leader</p>
          <p className="location">📍 Hong Kong | Available from 27 April 2026</p>
          <p className="subheadline">13+ years transforming complex data into strategic intelligence across Insurance, Financial Services, Retail and Conglomerates. Specialized in ETL, BI platforms, cloud-based analytics, and AI-enabled insights.</p>
          <div className="contact-info">
            <p>📧 vic1608@gmail.com | 📱 +852 6485 6291</p>
          </div>
          <div className="links">
            <a href="#contact">Contact</a>
            <a href="#projects">Projects</a>
            <a href="assets/resume.docx" download>Download Resume</a>
            <a href="https://linkedin.com/in/vick-lam-data-bi/" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="/admin" className="admin-link">🔐 Admin</a>
          </div>
        </div>
      </div>
    </header>
  )
}
