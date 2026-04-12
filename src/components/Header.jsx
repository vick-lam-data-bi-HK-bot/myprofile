import React from 'react'

export default function Header(){
  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="avatar" aria-hidden>
          <div className="avatar-initials">VL</div>
        </div>
        <div className="title">
          <h1>Vick LAM</h1>
          <p className="headline">Strategic Data & Business Intelligence Leader</p>
          <p className="subheadline">Driving digital transformation, agency performance, and executive decision support in Insurance and Financial Services.</p>
          <div className="links">
            <a href="#contact">Contact</a>
            <a href="#projects">Projects</a>
            <a href="assets/resume.docx" download>Download Resume</a>
            <a href="https://linkedin.com/in/vick-lam-data-bi/" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>
      </div>
    </header>
  )
}
