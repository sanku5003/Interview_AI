const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "The match score between the candidate's profile and the job description",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The Technical Question can be asked in the interview"),
        intension: z
          .string()
          .describe("The intension of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question , What points to cover , what approach to take etc.",
          ),
      }),
    )
    .describe(
      "The technical Questions that can be asked in the interview along with their intention and how to answer them",
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The Behavioral Question can be asked in the interview"),
        intension: z
          .string()
          .describe("The intension of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question , What points to cover , what approach to take etc.",
          ),
      }),
    )
    .describe(
      "The Behavioral Questions that can be asked in the interview along with their intention and how to answer them",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("The skill which candidate is lacking"),
        severity: z
          .enum(["low", "medium", "high"])
          .describe("the severity of skills which candidate is lacking"),
      }),
    )
    .describe(
      "List of all skill gaps in the cadidate's profile along with their severity",
    ),
  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe("The day number in the preparation plan , starting from 1"),
        focus: z
          .string()
          .describe("The focus of the day in the preparation plan"),
        tasks: z
          .array(z.string())
          .describe(
            "The list of tasks to be done on that day in the preparation plan",
          ),
      }),
    )
    .describe(
      "The preparation plan for the candidate to prepare for the interview , day wise with focus and tasks to be done on that day",
    ),
    title : z.string().describe("Title of the job for which the interview report is generated")
});

async function generateInterviewReport(
  resume,
  selfDescription,
  jobDescription,
) {
  const prompt = `Generate an interview report for the candidate based on the following information: 
Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;

  const rawSchema = zodToJsonSchema(interviewReportSchema);

  delete rawSchema.$schema;

  if (rawSchema.additionalProperties !== undefined) {
    delete rawSchema.additionalProperties;
  }
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: rawSchema,
    },
  });
  const parsedData = JSON.parse(response.text);
  return parsedData;
}

module.exports = generateInterviewReport;
