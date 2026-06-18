import type { ResumeData } from "@/types/resume";

export type JobMatchResult = {
  percentage: number;
  matchingKeywords: string[];
  missingKeywords: string[];
  suggestedKeywords: string[];
};

const stopWords = new Set([
  "the", "and", "for", "with", "you", "your", "our", "are", "will", "this", "that", "from", "have", "has", "job", "role", "work", "team",
  "candidate", "experience", "skills", "ability", "about", "into", "their", "they", "them", "company", "using", "use", "must", "should",
]);

export function analyzeJobMatch(resumeData: ResumeData, jobDescription: string): JobMatchResult {
  const jobKeywords = unique(extractKeywords(jobDescription)).slice(0, 40);
  const resumeKeywords = new Set(extractKeywords(resumeText(resumeData)));
  const matchingKeywords = jobKeywords.filter((keyword) => resumeKeywords.has(keyword));
  const missingKeywords = jobKeywords.filter((keyword) => !resumeKeywords.has(keyword)).slice(0, 16);
  const percentage = jobKeywords.length ? Math.round((matchingKeywords.length / jobKeywords.length) * 100) : 0;

  return {
    percentage,
    matchingKeywords: matchingKeywords.slice(0, 16),
    missingKeywords,
    suggestedKeywords: missingKeywords.slice(0, 8),
  };
}

function extractKeywords(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 2 && !stopWords.has(word));
}

function resumeText(data: ResumeData) {
  return [
    data.personal.jobTitle,
    data.summary,
    ...data.skills.map((skill) => skill.name),
    ...data.experience.flatMap((item) => [item.role, item.company, item.description, ...item.bullets]),
    ...data.projects.flatMap((project) => [project.name, project.role, project.description, ...project.bullets]),
    ...data.certificates.map((cert) => cert.name),
  ].join(" ");
}

function unique(values: string[]) {
  return Array.from(new Set(values));
}
