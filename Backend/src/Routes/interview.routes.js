const express = require('express');
const interviewRouter = express.Router();
const authUser = require('../middleware/auth.middleware');
const interviewController = require('../Controllers/interview.controller')
const upload = require('../middleware/file.middleware')

/**
 * @route POST /api/interview
 * @description generate new interview report on the basis of user self description , resume , pdf and job description
 * @access Private
 */

interviewRouter.post("/" , authUser, upload.single("resume") , interviewController.generateInterviewReportController);

/**
 * @route POST /api/interview/
 * @description get interview report by interviewId
 * @access private
 */

interviewRouter.get("/report/:interviewId" , authUser , interviewController.getInterviewReportByIdController)

/**
 * @route GET /api/interview/
 * @description get all interview reports of looged in user.
 * @access private
 */

interviewRouter.get("/" , authUser , interviewController.getAllInterviewReportsController)

module.exports = interviewRouter;