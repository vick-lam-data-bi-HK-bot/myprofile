import React from 'react'

export default function Projects(){
  return (
    <section id="projects" className="section container">
      <h2>Projects</h2>
      <div className="project-grid">
        <article>
          <h3>Agency Digital Platform Revamp</h3>
          <p>Supported end-to-end UAT, analytics and training for a major agency digital platform relaunch, improving lead assignment logic and agent adoption.</p>
        </article>
        <article>
          <h3>Enterprise Data Pool Transformation</h3>
          <p>Designed and built Azure Databricks ETL flows and Power BI data models to support enterprise-wide reporting and improve processing efficiency.</p>
        </article>
        <article>
          <h3>Integrated Data Warehouse & BI System</h3>
          <p>Delivered an integrated reporting solution for trading, broker and client data while migrating legacy dashboards to Qlik Sense.</p>
        </article>
      </div>
    </section>
  )
}
