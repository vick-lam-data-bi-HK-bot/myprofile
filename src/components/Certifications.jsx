import React from 'react'

export default function Certifications(){
  const certifications = [
    { name: "Google - Gemini Certified Educator", date: "Oct 2025", issuer: "Google" },
    { name: "Generative AI for Educators with Gemini", date: "Sep 2025", issuer: "Google/SCOPE, City University of Hong Kong", id: "427506489" },
    { name: "Certificate in Business Applications of Generative Artificial Intelligence", date: "Sep 2025", issuer: "ERB" },
    { name: "Google Analytics Certification", date: "Aug 2025", issuer: "Google Skillshop", id: "158612964" },
    { name: "Data Visualization and Dashboards with Excel and Cognos", date: "Jun 2025", issuer: "IBM/Coursera", id: "10DB9H0GAYXL" },
    { name: "Python for Data Science, AI & Development", date: "Jun 2025", issuer: "IBM/Coursera", id: "TW5CGQ19OJK7" },
    { name: "Alteryx Designer Core Certification", date: "May 2025", issuer: "Alteryx, Inc." },
    { name: "AWS Certified Cloud Practitioner", date: "Dec 2022", issuer: "Amazon Web Services", id: "8QWBYLM25B4E1J9R" }
  ]

  return (
    <section id="certifications" className="section container">
      <h2>Professional Certifications</h2>
      <div className="certifications-list">
        {certifications.map((cert, index) => (
          <div key={index} className="cert-item">
            <h4>{cert.name}</h4>
            <p className="cert-issuer">{cert.issuer}</p>
            <p className="cert-date">{cert.date}</p>
            {cert.id && <p className="cert-id">ID: {cert.id}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}
