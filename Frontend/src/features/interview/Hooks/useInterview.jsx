import { useState } from "react";
import {
  getAllInterviewReports,
  generateInterviewReport,
  getInterviewReportById,
} from "../services/interview.api";
import { useContext } from "react";
import { InterviewContext } from "../interview.context";
export const useInterview = () => {
  const context = useContext(InterviewContext);

  if (!context) {
    throw new Error("use interview must be used within an interviewProvider");
  }

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [reports, setReports] = useState([]);

  const generateReport = async ({
    jobDescription,
    selfDescription,
    resumeFile,
  }) => {
    setLoading(true);
    let response = null;
    try {
      response = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });

      setReport(response.interviewReport);

      return response.interviewReport;
    } catch (err) {
      console.log(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getReportById = async (interviewId) => {
    setLoading(true);

    try {
      const response = await getInterviewReportById(interviewId);
      console.log("API Response:", response);
      await setReport(response.interviewReport);
      return response.interviewReport;
    } catch (err) {
      console.log(err);
      return null;
    } finally {
      setLoading(false);
    }
  };
  const getReports = async () => {
    setLoading(true);
    let response = null;
    try {
      response = await getAllInterviewReports();
      setReports(response.interviewReports);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
    return response?.interviewReport;
  };

  return {
    getReports,
    getReportById,
    generateReport,
    loading,
    report,
    reports,
  };
};
