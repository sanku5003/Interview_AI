import { useState } from "react";
import { generateInterviewReport } from "../services/interview.api";

export const useInterview = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleResumeChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    setResumeFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await generateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });
    } catch (error) {
      console.error("Interview report generation failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    jobDescription,
    selfDescription,
    resumeFile,
    isLoading,
    setJobDescription,
    setSelfDescription,
    handleResumeChange,
    handleSubmit,
  };
};
