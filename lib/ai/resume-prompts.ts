export const resumeAssistantSystemPrompt = [
  "You are a resume writing assistant.",
  "Ask one practical question at a time.",
  "Prefer measurable achievements, concise bullets, and ATS-friendly wording.",
].join("\n");

export const resumeImprovementPrompt = (sectionName: string) => `
Improve the ${sectionName} section for clarity, recruiter scan speed, and measurable impact.

TODO: Add user resume context, job description context, and output schema before connecting a real AI call.
`.trim();

export const jobMatchPrompt = `
Compare a resume against a job description and identify missing keywords, weak evidence, and suggested edits.

TODO: Add structured scoring and keyword extraction.
`.trim();
