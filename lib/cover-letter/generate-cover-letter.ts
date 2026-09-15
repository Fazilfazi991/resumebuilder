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
  const topSkills = resumeData.skills.slice(0, 4).map((skill) => skill.name.trim()).filter(Boolean).join(", ");
  const recentExperience = resumeData.experience.find((item) => Boolean(item.role.trim() || item.company.trim() || item.description.trim() || item.bullets.some((bullet) => bullet.trim())));
  const recentRole = recentExperience
    ? [recentExperience.role.trim(), recentExperience.company.trim() ? `at ${recentExperience.company.trim()}` : ""].filter(Boolean).join(" ") || currentTitle
    : currentTitle;
  const project = resumeData.projects.find((item) => Boolean(item.name.trim() || item.description.trim() || item.bullets.some((bullet) => bullet.trim())));
  const experienceDetail = experienceNarrative(recentRole, recentExperience?.description || resumeData.summary || "delivering practical business results");
  const projectDescription = cleanFragment(project?.description || "");
  const projectDetail = project
    ? project.name.trim() && projectDescription
      ? `I also contributed to ${project.name.trim()}, ${projectClause(projectDescription)}.`
      : project.name.trim()
        ? `I also contributed to ${project.name.trim()}, strengthening my planning, execution, and collaboration.`
        : `I also delivered project work ${projectClause(projectDescription)}.`
    : "I bring a clear, structured approach to solving business problems.";
  const toneLine = {
    Professional: "I am excited to submit my application",
    Friendly: "I would be delighted to be considered",
    Confident: "I am confident I can make a strong contribution",
    Executive: "I am pleased to present my candidacy",
  }[tone];
  const jobFit = jobDescription?.trim()
    ? "The role description strongly aligns with my background in building measurable outcomes, collaborating across teams, and turning business goals into practical execution."
    : `I am drawn to ${company} because this opportunity aligns with my experience, strengths, and career focus.`;
  const extra = length === "Short" ? "" : `\n\n${experienceDetail} ${projectDetail}`;
  const detailed = length === "Detailed" ? `\n\nI would welcome the chance to discuss how my experience with ${topSkills || "cross-functional execution"} can support your team’s priorities and help ${company} move faster with clarity and confidence.` : "";

  return `${greeting}

${toneLine} for the ${jobTitle} position at ${company}. ${resumeData.summary || `With experience as a ${currentTitle}, I bring a practical mix of execution, communication, and problem-solving.`}

My background includes hands-on experience in ${topSkills || "strategy, execution, communication, and delivery"}. These strengths have helped me contribute to teams that need reliable ownership, clear prioritization, and measurable progress.${extra}

${jobFit}${detailed}

Thank you for your time and consideration. I would appreciate the opportunity to discuss how I can contribute to ${company}.

Sincerely,
${name}`;
}

const actionVerb = /^(?:lead|led|own(?:ed)?|manage(?:d)?|develop(?:ed)?|create(?:d)?|deliver(?:ed)?|improve(?:d)?|increase(?:d)?|reduce(?:d)?|launch(?:ed)?|design(?:ed)?|implement(?:ed)?|drive|drove|driven|grow|grew|grown|run|ran|oversee|oversaw|overseen|achieve(?:d)?|generate(?:d)?|coordinate(?:d)?|collaborate(?:d)?|support(?:ed)?|direct(?:ed)?|establish(?:ed)?|streamline(?:d)?|automate(?:d)?|optimize(?:d)?|mentor(?:ed)?|negotiate(?:d)?|secure(?:d)?|build|built)\b/i;

function cleanFragment(value: string) {
  return value.trim().replace(/[.!?]+$/, "");
}

function lowerFirst(value: string) {
  if (/^I\b/.test(value) || /^[A-Z]{2,}\b/.test(value)) return value;
  return `${value[0]?.toLowerCase() ?? ""}${value.slice(1)}`;
}

function experienceNarrative(recentRole: string, value: string) {
  const detail = cleanFragment(value);
  if (/^I\b/.test(detail)) return `In my recent work as ${recentRole}, ${detail}.`;
  if (/^(?:Responsible|Accountable)\s+for\b/i.test(detail)) return `In my recent work as ${recentRole}, I was ${lowerFirst(detail)}.`;
  if (actionVerb.test(detail)) return `In my recent work as ${recentRole}, I ${lowerFirst(detail)}.`;
  return `In my recent work as ${recentRole}, my work focused on ${lowerFirst(detail)}.`;
}

function projectClause(value: string) {
  if (/^I\b/.test(value)) return `where ${value}`;
  if (actionVerb.test(value)) return `where I ${lowerFirst(value)}`;
  if (/^[A-Za-z]+ing\b/.test(value)) return `where the work involved ${lowerFirst(value)}`;
  return `which involved ${lowerFirst(value)}`;
}
