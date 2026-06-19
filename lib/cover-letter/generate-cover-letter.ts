import type { ResumeData } from "@/types/resume";

export type CoverLetterTone = "Professional" | "Friendly" | "Confident" | "Executive";
export type CoverLetterLength = "Short" | "Standard" | "Detailed";

export type CoverLetterInput = {
  resumeData: ResumeData;
  companyName: string;
  hiringManagerName?: string;
  targetJobTitle: string;
  jobDescription?: string;
  tone: CoverLetterTone;
  length: CoverLetterLength;
};

export function generateCoverLetter({
  resumeData,
  companyName,
  hiringManagerName,
  targetJobTitle,
  jobDescription,
  tone,
  length,
}: CoverLetterInput) {
  const name = resumeData.personal.fullName || "Your Name";
  const currentTitle = resumeData.personal.jobTitle || targetJobTitle || "professional";
  const company = companyName || "your company";
  const jobTitle = targetJobTitle || currentTitle;
  const greeting = hiringManagerName ? `Dear ${hiringManagerName},` : "Dear Hiring Manager,";
  const topSkills = resumeData.skills.slice(0, 4).map((skill) => skill.name).filter(Boolean).join(", ");
  const recentExperience = resumeData.experience[0];
  const recentRole = recentExperience ? `${recentExperience.role} at ${recentExperience.company}` : currentTitle;
  const project = resumeData.projects[0];
  const toneLine = {
    Professional: "I am excited to submit my application",
    Friendly: "I would be delighted to be considered",
    Confident: "I am confident I can make a strong contribution",
    Executive: "I am pleased to present my candidacy",
  }[tone];
  const jobFit = jobDescription?.trim()
    ? "The role description strongly aligns with my background in building measurable outcomes, collaborating across teams, and turning business goals into practical execution."
    : `I am drawn to ${company} because this opportunity aligns with my experience, strengths, and career focus.`;
  const extra = length === "Short" ? "" : `\n\nIn my recent work as ${recentRole}, I have focused on ${recentExperience?.description || resumeData.summary || "delivering practical business results"}. ${project ? `I also contributed to ${project.name}, where ${project.description}` : "I bring a clear, structured approach to solving business problems."}`;
  const detailed = length === "Detailed" ? `\n\nI would welcome the chance to discuss how my experience with ${topSkills || "cross-functional execution"} can support your team’s priorities and help ${company} move faster with clarity and confidence.` : "";

  return `${greeting}

${toneLine} for the ${jobTitle} position at ${company}. ${resumeData.summary || `With experience as a ${currentTitle}, I bring a practical mix of execution, communication, and problem-solving.`}

My background includes hands-on experience in ${topSkills || "strategy, execution, communication, and delivery"}. These strengths have helped me contribute to teams that need reliable ownership, clear prioritization, and measurable progress.${extra}

${jobFit}${detailed}

Thank you for your time and consideration. I would appreciate the opportunity to discuss how I can contribute to ${company}.

Sincerely,
${name}`;
}
