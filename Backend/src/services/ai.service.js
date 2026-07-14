const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer");
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
  title: z
    .string()
    .describe("Title of the job for which the interview report is generated"),
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
    model: "gemini-3.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: rawSchema,
    },
  });
  const parsedData = JSON.parse(response.text);
  return parsedData;
}

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({ format: "A4" });

  await browser.close();

  return pdfBuffer;
}

async function generateResumePdf({
  resume,
  selfDescription,
  jobDescription,
}) {
  const resumepdfSchema = z.object({
    html: z
      .string()
      .describe(
        "The HTML content of the resume which can be converted to PDF using any library like puppeteer",
      ),
  });

  // const prompt = `generate the resume for a candidate with the following data : 
  //                     Resume : ${resume} ,
  //                     Self Description : ${selfDescription} ,
  //                     Job Description : ${jobDescription}
  //                     the response should be a json format with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer 
                      
  //                     `;

 const prompt = `
You are an expert career coach, an executive recruiter. Your task is to generate html for a highly optimized, industry-standard, and ATS-friendly resume in HTML format.

Data Inputs:
- Existing Resume Data: ${resume}
- Candidate's Self Description: ${selfDescription}
- Target Job Description: ${jobDescription}

Content & Optimization Instructions:
1. Keyword Matching: Analyze the Target Job Description and seamlessly integrate relevant keywords and industry jargon into the candidate's experience, skills, and summary.
2. Impactful Writing: Rewrite experience bullet points using strong action verbs. Highlight quantifiable achievements based on the provided data. 
3. Synthesis: Blend the 'Self Description' and 'Existing Resume Data' into a compelling professional summary that directly positions the candidate as the ideal fit for the 'Target Job Description'.
4. Strict Honesty: Do NOT hallucinate or invent experiences, companies, or degrees the candidate does not have. Only enhance and restructure the provided data.

Design & Technical Instructions (Puppeteer-Optimized):
1. Document Structure: Provide a fully complete HTML document (including <html>, <head>, and <body> tags).
2. Styling: Apply modern, clean, and classy styling using embedded CSS. Use a standard web-safe sans-serif font (like Inter, Roboto, or Helvetica) to ensure it renders perfectly. 
3. Layout Rules: Ensure the layout is optimized for an A4 PDF export. Include CSS rules for printing, specifically \`@page { size: A4; margin: 10mm; }\` and use \`page-break-inside: avoid;\` on key sections to prevent awkward splits across pages.
4. Hierarchy: Include standard resume sections: Header (Name & Contact), Professional Summary, Work Experience, Projects, Skills, and Education.

Output Constraints:
You must respond STRICTLY with a valid JSON object containing exactly one key: "html". The value must be the raw HTML string. 
Do NOT wrap the output in markdown code blocks (e.g., no \`\`\`json). Do NOT include any conversational text, explanations, or introductory phrases. Output only the raw, parsable JSON.
`;


  const rawSchema = zodToJsonSchema(resumepdfSchema);

  delete rawSchema.$schema;

  if (rawSchema.additionalProperties !== undefined) {
    delete rawSchema.additionalProperties;
  }

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: rawSchema,
    },
  });

  const parsedData = JSON.parse(response.text);

  const pdfBuffer = await generatePdfFromHtml(parsedData.html);

  return pdfBuffer;
}

module.exports = {generateInterviewReport , generateResumePdf};
