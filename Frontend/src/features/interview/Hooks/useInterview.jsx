import { useState } from "react";
import {
  getAllInterviewReports,
  generateInterviewReport,
  getInterviewReportById,
  generateResumePdf,
} from "../services/interview.api";
import { useContext } from "react";
import { InterviewContext } from "../interview.context";
export const useInterview = () => {
  const context = useContext(InterviewContext);

  if (!context) {
    throw new Error("use interview must be used within an interviewProvider");
  }

  const [loading, setLoading] = useState(false);
 
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

      const reportsData =
        response.interviewReports || response.data?.interviewReports;

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

  const getResumePdf = async (interviewReportId) => {
    setLoading(true)
    try{
      const response = await generateResumePdf({interviewReportId});
      const url = window.URL.createObjectURL(new Blob([response] , {type : "application/pdf"}))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download" , `resume_${interviewReportId}.pdf`)
      document.body.appendChild(link)
      link.click()
    }catch(err){
      console.log(err);
    } finally {
      setLoading(false)
    }
  }

  return {
    getReports,
    getReportById,
    generateReport,
    loading,
   
    reports,
    getResumePdf
  };
};
