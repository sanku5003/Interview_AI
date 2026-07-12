import React from "react";
import "../style/home.scss";
import { useInterview } from "../Hooks/useInterview";

const Home = () => {
  const {
    jobDescription,
    selfDescription,
    resumeFile,
    isLoading,
    setJobDescription,
    setSelfDescription,
    handleResumeChange,
    handleSubmit,
  } = useInterview();

  return (
    <main className="home">
      <div className="hero-panel">
        <p className="eyebrow">Interview Intel</p>
        <h1>Candidate Analysis Engine</h1>
        <p className="hero-copy">
          Analyze candidate resumes against specific job descriptions to generate an
          AI-powered interview scorecard.
        </p>
      </div>

      <form className="interview-panel" onSubmit={handleSubmit}>
        <section className="card job-card">
          <div className="card-header">
            <span>Job Description</span>
            <button type="button" className="ghost-btn">
              Load Template
            </button>
          </div>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the official job description here... include key responsibilities, required skills, and cultural expectations for the most accurate analysis."
          />
        </section>

        <div className="card-grid">
          <section className="card upload-card">
            <div className="card-title-row">
              <span>Resume Upload</span>
              <small>Recommended for depth analysis</small>
            </div>
            <p className="upload-copy">
              Drag and drop the PDF/Doc candidate resume, or browse to upload.
            </p>
            <label htmlFor="resume" className="dropzone">
              <span>{resumeFile ? resumeFile.name : "Drop file here or browse"}</span>
            </label>
            <input
              hidden
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
            />
            {resumeFile && <div className="file-info">Selected: {resumeFile.name}</div>}
          </section>

          <section className="card insight-card">
            <div className="card-header">
              <span>AI Optimizer</span>
              <span className="status-chip">Enhanced</span>
            </div>
            <p>
              Providing both a resume and a self-description allows our AI to
              cross-reference hard skills with the candidate's personal narrative.
            </p>
            <div className="meta-row">
              <span className="meta-dot" />
              <span>Recently analyzed by your team</span>
            </div>
          </section>
        </div>

        <section className="card self-card">
          <div className="card-title-row">
            <span>Self Description</span>
            <small>Optional</small>
          </div>
          <textarea
            value={selfDescription}
            onChange={(e) => setSelfDescription(e.target.value)}
            placeholder="Enter a self-description, bio, or cover letter snippet to help the engine understand soft skills and culture fit."
          />
          <div className="self-footer">
            <span className="char-count">{selfDescription.length} / 5000 CHARACTERS</span>
            <button type="submit" className="generate-btn btn">
              {isLoading ? "Generating..." : "Generate Interview Report"}
            </button>
          </div>
        </section>
      </form>
    </main>
  );
};

export default Home;
