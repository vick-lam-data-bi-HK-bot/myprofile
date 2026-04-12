import React from 'react'

export default function Experience(){
  return (
    <section id="experience" className="section container">
      <h2>Experience</h2>
      <div className="exp-item">
        <h3>Business Analyst, Agency Digital, Analytics and Business Acquisition — AIA International Ltd</h3>
        <p className="meta">Sep 2025 – Present</p>
        <ul>
          <li>Led analytics and UAT for the Agency Digital Platform revamp, validating system functionality and resolving defects prior to rollout.</li>
          <li>Analyzed automated agent/customer lead assignment logic and identified operational bottlenecks to improve distribution efficiency.</li>
          <li>Designed and delivered agency mobile app training workshops to strengthen digital prospecting, lead management and performance tracking.</li>
          <li>Synthesized CRM analytics and agency feedback to recommend productivity and digital enablement initiatives.</li>
        </ul>
      </div>
      <div className="exp-item">
        <h3>Senior Business Intelligence Analyst — DCH Business Innovations Ltd</h3>
        <p className="meta">May 2022 – Aug 2024</p>
        <ul>
          <li>Architected 20+ Azure Databricks ETL flows and Power BI models for an enterprise data pool, reducing processing time by 20%.</li>
          <li>Delivered 1,000+ monthly reports with 99% production stability across critical business dashboards.</li>
          <li>Advised seasonal strategy planning by analyzing conglomerate-wide data and enabling business unit decisions for peak cycles.</li>
        </ul>
      </div>
      <div className="exp-item">
        <h3>Business Analyst – Business Intelligence — Everbright Securities International</h3>
        <p className="meta">May 2017 – May 2022</p>
        <ul>
          <li>Delivered an integrated datawarehouse and BI system combining trading transactions, broker agents and client holdings.</li>
          <li>Built executive management dashboards that accelerated reporting cycles by 25% for top-tier stakeholders.</li>
          <li>Led migration of legacy reporting to Qlik Sense and designed incentive logic using broker transactions and AUM data.</li>
        </ul>
      </div>
    </section>
  )
}
