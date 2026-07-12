export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          jobDescription,
          selfDescription,
          resumeFileName: resumeFile?.name ?? null,
        },
      });
    }, 500);
  });
};
