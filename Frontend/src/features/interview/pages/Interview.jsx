import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import "../style/interview.scss";

import { useInterview } from "../Hooks/useInterview";
import Loading from "../../auth/components/Loading";

const Interview = () => {
  const [selectedSection, setSelectedSection] = useState("technical");

  const params = useParams();
  console.log("URL Parameters:", params);

  const { report, getReportById, loading } = useInterview();

  // 2. Fetch the report when the component mounts or when the ID changes
  useEffect(() => {
    console.log("useEffect running interview ID is:", params.interviewId); // <--- ADD THIS LINE
    if (params.interviewId) {
      getReportById(params.interviewId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.interviewId]);

  if (loading) {
    return <Loading />;
  }

  if (!report) {
    return <div>No report found or failed to load.</div>;
  }

  return (
    <div className="interview-page">
      <aside className="panel nav-panel">
        <div className="panel-label">Sections</div>
        <nav className="nav-list">
          <button
            type="button"
            className={`nav-link ${selectedSection === "technical" ? "active" : ""}`}
            onClick={() => setSelectedSection("technical")}
          >
            Interview questions
          </button>
          <button
            type="button"
            className={`nav-link ${selectedSection === "behavioral" ? "active" : ""}`}
            onClick={() => setSelectedSection("behavioral")}
          >
            Behavioral questions
          </button>
          <button
            type="button"
            className={`nav-link ${selectedSection === "roadmap" ? "active" : ""}`}
            onClick={() => setSelectedSection("roadmap")}
          >
            Road map
          </button>
        </nav>
      </aside>

      <main className="panel content-panel">
        <div className="content-header">
          <div>
            <p className="eyebrow">Interview review</p>
            <h1>Candidate assessment</h1>
            <p className="content-copy">
              Review the match score, candidate questions, and preparation plan
              one section at a time.
            </p>
          </div>
        </div>

        {selectedSection === "technical" && (
          <section className="content-block" id="technical">
            <div className="content-block-heading">
              <h2>Technical questions</h2>
              <p>
                Questions likely to be asked in the technical portion of the
                interview.
              </p>
            </div>
            <div className="question-grid">
              {report.technicalQuestions.map((item, index) => (
                <article className="question-card" key={index}>
                  <h3>{item.question}</h3>
                  <p className="label">Intention</p>
                  <p>{item.intension}</p>
                  <p className="label">Suggested answer</p>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {selectedSection === "behavioral" && (
          <section className="content-block" id="behavioral">
            <div className="content-block-heading">
              <h2>Behavioral questions</h2>
              <p>Structured prompts with goals and response guidance.</p>
            </div>
            <div className="question-grid">
              {report.behavioralQuestions.map((item, index) => (
                <article className="question-card" key={index}>
                  <h3>{item.question}</h3>
                  <p className="label">Intention</p>
                  <p>{item.intension}</p>
                  <p className="label">Suggested answer</p>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {selectedSection === "roadmap" && (
          <section className="content-block" id="roadmap">
            <div className="content-block-heading">
              <h2>Preparation timeline</h2>
              <p>Daily focus areas and task checkpoints for preparation.</p>
            </div>
            <div className="timeline-list">
              {report.preparationPlan.map((day) => (
                <article className="timeline-item" key={day.day}>
                  <div className="timeline-badge">Day {day.day}</div>
                  <div className="timeline-card">
                    <h3>{day.focus}</h3>
                    <ul>
                      {day.tasks.map((task, idx) => (
                        <li key={idx}>{task}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <aside className="panel right-panel">
        <div className="score-pill right-score">
          <span>Match score</span>
          <strong>{report.matchScore}%</strong>
        </div>

        <div className="panel-label">Skill gaps</div>
        <div className="gap-list">
          {report.skillGaps.map((gap, index) => (
            <div className={`gap-chip gap-${gap.severity}`} key={index}>
              {gap.skill}
            </div>
          ))}
        </div>
        <div className="gap-note">
          Highlight the strongest areas for coaching and focus before the
          interview.
        </div>
      </aside>
    </div>
  );
};

export default Interview;
