import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "../style/interview.scss";

import { useInterview } from "../Hooks/useInterview";
import Loading from "../../auth/components/Loading";
import { generateResumePdf } from "../services/interview.api";
import ReportNotFound from "../components/ReportNotFound";
import { useAuth } from "../../auth/Hooks/useAuth";

const Interview = () => {
  const [selectedSection, setSelectedSection] = useState("technical");

  const params = useParams();
  const navigate = useNavigate();
  console.log("URL Parameters:", params);

  const { report, getReportById, loading, getResumePdf } = useInterview();
  const { handleLogout } = useAuth();

  // 2. Fetch the report when the component mounts or when the ID changes
  useEffect(() => {
    console.log("useEffect running interview ID is:", params.interviewId); // <--- ADD THIS LINE
    if (params.interviewId) {
      getReportById(params.interviewId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.interviewId]);

  const handleLogoutClick = async () => {
    await handleLogout();
    navigate("/login");
  };

  if (loading) {
    return <Loading />;
  }

  if (!report) {
    return <ReportNotFound />
  }

  return (
    <div className="interview-page">
      <aside className="panel nav-panel">
        <button type="button" className="logout-btn sidebar-logout" onClick={handleLogoutClick}>
          Logout
        </button>
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

        <button
          className="btn primary"
          onClick={() => getResumePdf(params.interviewId)}
        >
          <div>
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="currentColor"
            >
              <path d="M11.1244 1.09094H12.8753L12.9269 1.9453C13.2227 6.85075 17.1493 10.7773 22.0546 11.0732L22.909 11.1247V12.8757L22.0546 12.9272C17.1493 13.2231 13.2227 17.1498 12.9269 22.0551L12.8753 22.9095H11.1244L11.0728 22.0551C10.777 17.1498 6.85036 13.2231 1.94518 12.9272L1.09082 12.8757V11.1247L1.94518 11.0732C6.85036 10.7773 10.777 6.85075 11.0728 1.9453L11.1244 1.09094ZM11.9999 5.85023C10.83 8.61547 8.61512 10.8304 5.84996 12.0002C8.61512 13.1701 10.83 15.385 11.9999 18.1502C13.1697 15.385 15.3846 13.1701 18.1498 12.0002C15.3846 10.8304 13.1697 8.61547 11.9999 5.85023Z"></path>
            </svg>{" "}
          </div>{" "}
          <div>Download AI Generated Resume</div>
        </button>
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
