const mongoose = require("mongoose");

/**
 * job description schema
 * resume text
 * self description
 *
 * overall score : Number
 *
 * technical question : [{
 *   question : ""
 *   answer : " "
 *   intention : ""
 * }]
 * behavioral question : [{
 *   question : ""
 *   answer : " "
 *   intention : ""}]
 * skill gaps : [{
 * skill : ""
 * severity : {
 * type : String ,
 * enum  : ["low" , "medium" , "high"]
 * }
 * }]
 * preparation plan : [{
 * day : Number
 * focus : String,
 * tasks : []
 * }]
 */

const technicalQuestionSchem = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "question is req"],
    },
    intension: {
      type: String,
      required: [true, "intension is required"],
    },
    answer: {
      type: String,
      required: [true, "answer is required"],
    },
  },
  {
    _id: false,
  },
);

const skillGapSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: [true, "skill is req"],
    },

    severity: {
      type: String,
      enum: ["low", "Medium", "High"],
      required: [true, "Severity is req"],
    },
  },
  {
    _id: false,
  },
);

const preparationPlanSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: [true, "Day is required"],
    },
    focus: {
      type: String,
      required: [true, "Focus is req"],
    },
    tasks: [
      {
        type: Number,
        required: [true, "tasks is required"],
      },
    ],
  },
  {
    _id: false,
  },
);

const behavioralQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "question is req"],
    },
    intension: {
      type: String,
      required: [true, "intension is required"],
    },
    answer: {
      type: String,
      required: [true, "answer is required"],
    },
  },
  {
    _id: false,
  },
);

const interviewReportSchema = new mongoose.Schema({
  jobDescription: {
    type: String,
    required: [true, "job description is required"],
  },

  resume: {
    type: String,
  },

  selfDescription: {
    type: String,
  },

  matchScore: {
    type: Number,
    min: 0,
    max: 100,
  },

  technicalQuestions: [technicalQuestionSchem],
  behavioralQuestions:[behavioralQuestionSchema],
  skillGaps : [skillGapSchema],
  preparationPlan : [preparationPlanSchema]
} , {
    timestamps : true
});


const interviewReportModel = mongoose.model("InterviewReport" , interviewReportSchema);

module.exports = interviewReportModel;