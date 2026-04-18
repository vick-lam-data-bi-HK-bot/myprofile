import React, { useState, useEffect } from 'react'
import { trafficAPI } from '../services/api'
import '../styles/admin.css'

export default function TrafficAnalytics() {
  const [timeframe, setTimeframe] = useState('7days')
  const [dailyStats, setDailyStats] = useState([])
  const [topPages, setTopPages] = useState([])
  const [referrers, setReferrers] = useState([])
  const [browsers, setBrowsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [timeframe])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const [analyticsRes, pagesRes, referrersRes, browsersRes] = await Promise.all([
        trafficAPI.getAnalytics(timeframe),
        trafficAPI.getTopPages(),
        trafficAPI.getReferrers(),
        trafficAPI.getBrowsers(),
      ])

      setDailyStats(analyticsRes.data.dailyStats || [])
      setTopPages(pagesRes.data.topPages || [])
      setReferrers(referrersRes.data.referrers || [])
      setBrowsers(browsersRes.data.browsers || [])
    } catch (err) {
      console.error('Failed to load traffic analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="cms-section"><p>Loading traffic data...</p></div>
  }

  return (
    <div className="cms-section traffic-analytics">
      <h2>Traffic Analytics</h2>

      <div className="analytics-controls">
        <label>Timeframe: </label>
        <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="all">All Time</option>
        </select>
      </div>

      <div className="analytics-grid">
        {/* Daily Stats */}
        <div className="analytics-card">
          <h3>📅 Daily Visits</h3>
          {dailyStats.length === 0 ? (
            <p className="no-data">No data available</p>
          ) : (
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Visits</th>
                  <th>Unique</th>
                </tr>
              </thead>
              <tbody>
                {dailyStats.map((stat, idx) => (
                  <tr key={idx}>
                    <td>{stat.date}</td>
                    <td>{stat.visits}</td>
                    <td>{stat.unique_visitors}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Top Pages */}
        <div className="analytics-card">
          <h3>📄 Top Pages</h3>
          {topPages.length === 0 ? (
            <p className="no-data">No data available</p>
          ) : (
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Page</th>
                  <th>Visits</th>
                  <th>Unique</th>
                </tr>
              </thead>
              <tbody>
                {topPages.map((page, idx) => (
                  <tr key={idx}>
                    <td className="page-name">{page.endpoint}</td>
                    <td>{page.visits}</td>
                    <td>{page.unique_visitors}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Referrers */}
        <div className="analytics-card">
          <h3>🔗 Top Referrers</h3>
          {referrers.length === 0 ? (
            <p className="no-data">No referrer data</p>
          ) : (
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Referrer</th>
                  <th>Visits</th>
                </tr>
              </thead>
              <tbody>
                {referrers.map((ref, idx) => (
                  <tr key={idx}>
                    <td className="page-name">{ref.referer || 'Direct'}</td>
                    <td>{ref.visits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Browsers */}
        <div className="analytics-card">
          <h3>🌐 Browser Usage</h3>
          {browsers.length === 0 ? (
            <p className="no-data">No data available</p>
          ) : (
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Browser</th>
                  <th>Visits</th>
                </tr>
              </thead>
              <tbody>
                {browsers.map((browser, idx) => (
                  <tr key={idx}>
                    <td>{browser.browser}</td>
                    <td>{browser.visits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
