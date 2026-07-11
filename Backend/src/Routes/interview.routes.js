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

module.exports = interviewRouter;