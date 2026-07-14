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
  // const getReports = async () => {
  //   setLoading(true);
   
  //   try {
  //     const response = await getAllInterviewReports();
  //     setReports(response.interviewReports);
  //     return response?.interviewReports;
  //   } catch (err) {
  //     console.log(err);
  //   } finally {
  //     setLoading(false);
  //   }
    
  // };

  const getReports = async () => {
    setLoading(true);
    
    try {
      const response = await getAllInterviewReports();
      
      // 1. LOG THE RAW RESPONSE HERE:
      console.log("RAW API RESPONSE:", response); 

      // 2. CHECK FOR AXIOS .data WRAPPER
      // If you are using Axios in your api.js file, the data is likely inside response.data
      const reportsData = response.interviewReports || response.data?.interviewReports;
      
      console.log("EXTRACTED REPORTS:", reportsData);

      if (reportsData) {
        setReports(reportsData);
      }
      
      return reportsData;
    } catch (err) {
      console.error("GET REPORTS ERROR:", err);
    } finally {
      setLoading(false);
    }
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
