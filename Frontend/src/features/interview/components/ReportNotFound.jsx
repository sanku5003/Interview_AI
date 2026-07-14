import React from 'react'
import '../style/interview.scss'

const ReportNotFound = () => {
  return (
    <main className="report-error-page">
      <section className="report-error-panel panel">
        <div className="report-error-header">
          <p className="eyebrow">Interview Intelligence</p>
          <h1>Report Not Found</h1>
        </div>
        <p className="report-error-copy">
          We couldn't locate the interview report you were looking for. It may have
          been removed or the link is no longer valid.
        </p>
        <div className="report-error-actions">
          <span className="report-error-tag">Try again or create a new interview plan.</span>
        </div>
      </section>
    </main>
  )
}

export default ReportNotFound
