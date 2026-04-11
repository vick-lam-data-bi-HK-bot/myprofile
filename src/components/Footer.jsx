import React from 'react'

export default function Footer(){
  return (
    <footer className="site-footer">
      <div className="container">
        <p>© {new Date().getFullYear()} Vick LAM — Built with React + Vite</p>
        <p className="social">
          <a href="https://linkedin.com/in/vick-lam-data-bi/" target="_blank" rel="noreferrer">LinkedIn</a>
        </p>
      </div>
    </footer>
  )
}
