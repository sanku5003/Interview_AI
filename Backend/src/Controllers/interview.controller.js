const pdfParse = require("pdf-parse");
const {
  generateInterviewReport,
  generateResumePdf,
} = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

/**
 * @description Controller to generate interview reports
 */
async function generateInterviewReportController(req, res) {
  const resumeContent = await new pdfParse.PDFParse(
    Uint8Array.from(req.file.buffer),
  ).getText();
  const { selfDescription, jobDescription } = req.body;

  const interviewReportByAi = await generateInterviewReport(
    resumeContent.text,
    selfDescription,
    jobDescription,
  );

  const interviewReport = await interviewReportModel.create({
    user: req.user.id,
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
    ...interviewReportByAi,
  });

  res.status(201).json({
    message: "interview report generated successfully",
    interviewReport,
  });
}

/**
 * @description controller to get the interview report
 */

async function getInterviewReportByIdController(req, res) {
  const { interviewId } = req.params;

  const userId = req.user.id || req.user._id;

  const interviewReport = await interviewReportModel.findOne({
    _id: interviewId,
    user: userId,
  });

  if (!interviewReport) {
    return res.status(404).json({
      message: "interview report not found",
    });
  }

  res.status(200).json({
    message: "Interview report fetched successfully.",
    interviewReport,
  });
}
/**
 * @description controller to get all the interview reports
 */
async function getAllInterviewReportsController(req, res) {
  const userId = req.user.id || req.user._id;

  const interviewReports = await interviewReportModel
    .find({ user: userId })
    .sort({ createdAt: -1 })
    .select(
      "-resume -selfDescription -jobdescription -_v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan",
    );

  res.status(200).json({
    message: "Interview reports fetched successfully",
    interviewReports,
  });
}

/**
 * @description Controller to generate PDF based on user self description , resume and job description
 */
async function generateResumePdfController(req, res) {
  const { interviewReportId } = req.params;
  const interviewReport = await interviewReportModel.findById(interviewReportId);

  if(!interviewReport){
    return res.status(404).json({message : "Interview Report not found"});
  }

  const {resume , jobDescription , selfDescription} = interviewReport;

  const pdfBuffer = await generateResumePdf({resume , jobDescription , selfDescription})

  res.set({
    "Content-Type" : "application/pdf",
    "Content-Disposition" : `attatchment; filename=resume_${interviewReportId}.pdf`
  })

  res.send(pdfBuffer)
}

module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController
};
