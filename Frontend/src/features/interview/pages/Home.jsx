import React, { useRef, useState , useEffect} from "react";
import "../style/home.scss";
import { useInterview } from "../Hooks/useInterview";
import { useNavigate } from "react-router";
import Loading from "../../auth/components/Loading";

const Home = () => {
  const { loading, generateReport , reports , getReports} = useInterview();
  const navigate = useNavigate();

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const resumeInputRef = useRef();
  const [resumePdf, setResumePdf] = useState(null);

  const handleResumeChange = () => {
    setResumePdf(resumeInputRef.current.files[0]);
  };

  const handleGenerateReport = async (e) => {
    e.preventDefault();

    console.log("SUBMIT CLICKED");

    const resumeFile = resumeInputRef.current.files[0];

    const data = await generateReport({
      jobDescription,
      selfDescription,
      resumeFile,
    });
    console.log("DATA OBJECT:", data);
    console.log("ID:", data?._id);

    if (data?._id) {
      navigate(`/interview/${data._id}`);
    }
  };
  useEffect(() => {
    getReports();
  }, []);

  if (loading) {
    return <Loading />;
  }

  console.log("Current reports state:", reports);
  return (
    <main className="home">
      <div className="hero-panel">
        <p className="eyebrow">Interview Intel</p>
        <h1>Candidate Analysis Engine</h1>
        <p className="hero-copy">
          Analyze candidate resumes against specific job descriptions to
          generate an AI-powered interview scorecard.
        </p>
      </div>

      <form className="interview-panel" onSubmit={handleGenerateReport}>
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
              <span>
                {resumePdf ? resumePdf.name : "Drop file here or browse"}
              </span>
            </label>
            <input
              hidden
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              ref={resumeInputRef}
              onChange={handleResumeChange}
            />
            {resumePdf && (
              <div className="file-info">Selected: {resumePdf.name}</div>
            )}
          </section>

          <section className="card insight-card">
            <div className="card-header">
              <span>AI Optimizer</span>
              <span className="status-chip">Enhanced</span>
            </div>
            <p>
              Providing both a resume and a self-description allows our AI to
              cross-reference hard skills with the candidate's personal
              narrative.
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
            <span className="char-count">
              {selfDescription.length} / 5000 CHARACTERS
            </span>
            <button type="submit" className="generate-btn btn">
              {loading ? "Generating..." : "Generate Interview Report"}
            </button>
          </div>
        </section>
      </form>

     {reports && reports.length > 0 && (
        <section className="recent-reports">
          <h2>My Recent Interview Plans</h2>
          <ul className="reports-list">
             {reports.map((report) => (
              <li 
                key={report._id} 
                className="report-item" 
                onClick={() => navigate(`/interview/${report._id}`)}
              >
                <h3>{report.title || 'Untitled Position'}</h3>
                <p className="report-meta"> 
                  Generated on {new Date(report.createdAt).toLocaleDateString()}
                </p>
              </li>
             ))}
          </ul>
        </section>
      )}
    </main>
  );
};

export default Home;
