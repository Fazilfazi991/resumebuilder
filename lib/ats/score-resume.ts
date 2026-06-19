import type { ResumeData } from "@/types/resume";

export type AtsIssueSeverity = "success" | "warning" | "error" | "suggestion";

export type AtsIssue = {
  id: string;
  title: string;
  description: string;
  action: string;
  severity: AtsIssueSeverity;
};

export type AtsCategoryScore = {
  id: string;
  label: string;
  score: number;
  maxScore: number;
  passed: number;
  issues: number;
  suggestions: number;
  items: AtsIssue[];
};

export type AtsScoreResult = {
  totalScore: number;
  maxScore: number;
  percentage: number;
  label: "Needs Work" | "Good Start" | "Strong" | "Excellent";
  summary: string;
  categories: AtsCategoryScore[];
};

const firstPersonWords = /\b(i|me|my|mine|myself)\b/i;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const metricPattern = /\d|%|\$|aed|inr|revenue|growth|reduced|increased|improved|saved/i;
const genericSkills = new Set(["communication", "teamwork", "leadership", "hardworking", "responsible"]);

export function calculateAtsScore(resumeData: ResumeData): AtsScoreResult {
  const categories = [
    scorePersonal(resumeData),
    scoreSummary(resumeData),
    scoreSkills(resumeData),
    scoreExperience(resumeData),
    scoreProjects(resumeData),
    scoreEducation(resumeData),
    scoreCertificationsLanguages(resumeData),
    scoreFormatting(),
  ];
  const totalScore = categories.reduce((sum, category) => sum + category.score, 0);
  const maxScore = categories.reduce((sum, category) => sum + category.maxScore, 0);
  const percentage = Math.round((totalScore / maxScore) * 100);

  return {
    totalScore,
    maxScore,
    percentage,
    label: scoreLabel(percentage),
    summary: summaryFor(percentage, categories.reduce((sum, category) => sum + category.issues, 0)),
    categories,
  };
}

function scorePersonal(data: ResumeData): AtsCategoryScore {
  const items: AtsIssue[] = [];
  let score = 0;
  score += pass(Boolean(data.personal.fullName), 3, items, "personal-name", "Full name added", "Your resume has a clear candidate name.", "Keep your full legal/professional name visible.", "Missing full name", "ATS systems and recruiters need a clear candidate identifier.", "Add your full name.");
  score += pass(Boolean(data.personal.jobTitle), 2, items, "personal-title", "Job title added", "Your target role is visible.", "Keep the target role aligned with the job.", "Missing job title", "A target title helps recruiters understand your direction quickly.", "Add a target job title.");
  score += pass(emailPattern.test(data.personal.email), 3, items, "personal-email", "Valid email added", "Your email looks readable.", "Use a professional email address.", "Missing valid email", "Recruiters need a reliable contact method.", "Add a valid email address.");
  score += pass(Boolean(data.personal.phone), 2, items, "personal-phone", "Phone added", "Your phone number is available.", "Use an active phone number.", "Missing phone", "Many recruiters contact candidates by phone.", "Add your phone number.");
  score += pass(Boolean(data.personal.location), 2, items, "personal-location", "Location added", "Your location is visible.", "City and country are usually enough.", "Missing location", "Location helps recruiters assess fit and availability.", "Add your city/country.");
  const hasLink = [data.personal.linkedin, data.personal.portfolio, data.personal.website].some(Boolean);
  score += pass(hasLink, 3, items, "personal-link", "Professional link added", "Your profile includes a link for more proof.", "Keep LinkedIn or portfolio up to date.", "Missing LinkedIn or portfolio", "Links build trust and help recruiters verify your work.", "Add LinkedIn, portfolio, or website.");
  return category("personal", "Personal Details", score, 15, items);
}

function scoreSummary(data: ResumeData): AtsCategoryScore {
  const items: AtsIssue[] = [];
  const words = wordCount(data.summary);
  let score = 0;
  score += pass(Boolean(data.summary.trim()), 5, items, "summary-present", "Summary added", "Your resume has an opening profile.", "Keep it focused on target roles.", "Add professional summary", "A summary gives recruiters context before they scan details.", "Write a 3-5 line professional summary.");
  score += pass(words >= 40 && words <= 120, 5, items, "summary-length", "Summary length is healthy", "Your summary is within a recruiter-friendly range.", "Keep it concise.", words < 40 ? "Summary too short" : "Summary too long", "ATS and recruiters need enough context without long paragraphs.", "Aim for 40-120 words.");
  const keywords = keywordsFrom([data.personal.jobTitle, ...data.skills.map((skill) => skill.name)]);
  score += pass(keywords.some((keyword) => data.summary.toLowerCase().includes(keyword)), 3, items, "summary-keywords", "Summary includes role keywords", "The summary reflects your target role or skills.", "Use natural role-specific keywords.", "Add role keywords", "Relevant keywords improve match quality.", "Mention your target role or strongest skills.");
  score += pass(!firstPersonWords.test(data.summary), 2, items, "summary-first-person", "No first-person wording", "The summary uses resume-style wording.", "Keep it professional and direct.", "Avoid first-person wording", "First-person wording can feel less resume-like.", "Remove words like I, me, or my.");
  return category("summary", "Summary", score, 15, items);
}

function scoreSkills(data: ResumeData): AtsCategoryScore {
  const items: AtsIssue[] = [];
  let score = 0;
  const skills = data.skills.filter((skill) => skill.name.trim());
  score += pass(skills.length >= 6, 6, items, "skills-six", "At least 6 skills added", "You have enough skills for keyword scanning.", "Keep skills relevant.", "Add at least 6 skills", "ATS systems scan skill keywords heavily.", "Add technical and soft skills related to your target role.");
  score += pass(skills.length >= 10, 4, items, "skills-ten", "Strong skill count", "You have a broad keyword base.", "Prioritize relevance over volume.", "Add more role-specific skills", "More targeted skills can improve match quality.", "Aim for 10 relevant skills if possible.");
  score += pass(skills.some((skill) => skill.level.trim()), 2, items, "skills-levels", "Skill levels added", "Your skills include proficiency context.", "Use honest levels.", "Add skill levels", "Levels help readers judge strength quickly.", "Add levels or categories for skills.");
  const genericOnly = skills.length > 0 && skills.every((skill) => genericSkills.has(skill.name.toLowerCase()));
  score += pass(!genericOnly && skills.length > 0, 3, items, "skills-specific", "Skills are role-specific", "Your skills go beyond generic traits.", "Use job-specific keywords.", "Avoid very generic skills only", "Generic-only skills do not help ATS matching enough.", "Add tools, methods, or domain skills.");
  return category("skills", "Skills", score, 15, items);
}

function scoreExperience(data: ResumeData): AtsCategoryScore {
  const items: AtsIssue[] = [];
  const experiences = data.experience;
  const bullets = experiences.flatMap((item) => item.bullets).filter(Boolean);
  let score = 0;
  score += pass(experiences.length > 0, 5, items, "exp-present", "Work experience added", "Your resume includes work history.", "Keep roles relevant.", "Add work experience", "Experience is usually the strongest proof section.", "Add at least one work experience item.");
  score += pass(experiences.every((item) => item.role && item.company), 5, items, "exp-role-company", "Roles and companies added", "Experience entries have clear context.", "Use official company and role names.", "Add company names", "Recruiters need role and company context.", "Add role and company for each experience.");
  score += pass(experiences.every((item) => item.startDate && (item.endDate || item.isCurrent)), 4, items, "exp-dates", "Experience dates added", "Date ranges are visible.", "Keep dates consistent.", "Add dates", "Dates help recruiters understand career timeline.", "Add start and end dates.");
  score += pass(bullets.length > 0, 5, items, "exp-bullets", "Bullet points added", "Experience has scan-friendly detail.", "Use achievement bullets.", "Add bullet points", "Bullets are easier to scan than paragraphs.", "Add responsibility and achievement bullets.");
  score += pass(bullets.length >= 3, 3, items, "exp-three-bullets", "Enough bullets added", "You have multiple proof points.", "Keep strongest bullets first.", "Add more bullet points", "A few bullets help show impact.", "Add at least 3 total bullets.");
  score += pass(bullets.some((bullet) => metricPattern.test(bullet)), 3, items, "exp-metrics", "Metrics included", "At least one bullet includes measurable impact.", "Use numbers where truthful.", "Add measurable achievements", "Metrics make impact easier to trust.", "Add percentages, revenue, users, team size, or volume.");
  return category("experience", "Work Experience", score, 25, items);
}

function scoreProjects(data: ResumeData): AtsCategoryScore {
  const items: AtsIssue[] = [];
  let score = 0;
  score += pass(data.projects.length > 0, 4, items, "projects-present", "Projects added", "Your resume includes project proof.", "Keep projects relevant.", "Add relevant projects", "Projects help prove skills, especially for early-career or technical roles.", "Add 1-2 relevant projects.");
  score += pass(data.projects.some((project) => project.description.trim()), 3, items, "projects-description", "Project outcomes described", "At least one project has context.", "Focus on outcome and tools.", "Add project outcomes", "Project descriptions show what you actually did.", "Add short outcomes for each project.");
  score += pass(data.projects.some((project) => project.link.trim() || project.bullets.some(Boolean)), 3, items, "projects-links", "Project proof added", "Projects include links or bullets.", "Link to public proof when possible.", "Add portfolio/project links", "Links and bullets make projects more credible.", "Add project links or bullet proof.");
  return category("projects", "Projects", score, 10, items);
}

function scoreEducation(data: ResumeData): AtsCategoryScore {
  const items: AtsIssue[] = [];
  let score = 0;
  score += pass(data.education.length > 0, 5, items, "edu-present", "Education added", "Your education section exists.", "Keep it concise.", "Add education", "Education is a common ATS field.", "Add your highest relevant education.");
  score += pass(data.education.some((item) => item.degree && item.institution), 3, items, "edu-degree", "Degree and institution added", "Education has core details.", "Use standard degree names.", "Add institution/degree", "Recruiters need degree and institution context.", "Add degree and institution.");
  score += pass(data.education.some((item) => item.startDate || item.endDate || item.location || item.field), 2, items, "edu-extra", "Education detail added", "Education includes dates, location, or field.", "Only include useful detail.", "Add dates", "Dates, field, or location improve clarity.", "Add education dates, field, or location.");
  return category("education", "Education", score, 10, items);
}

function scoreCertificationsLanguages(data: ResumeData): AtsCategoryScore {
  const items: AtsIssue[] = [];
  let score = 0;
  score += pass(data.certificates.length > 0, 3, items, "certs-present", "Certifications added", "Certifications can strengthen credibility.", "Keep relevant credentials.", "Add certifications if relevant", "Certifications help for regulated or technical roles.", "Add relevant certifications.");
  score += pass(data.languages.length > 0, 2, items, "languages-present", "Languages added", "Languages can help market fit.", "List useful working languages.", "Add languages if useful", "Languages can matter for UAE and international roles.", "Add languages when relevant.");
  return category("certifications-languages", "Certifications & Languages", score, 5, items);
}

function scoreFormatting(): AtsCategoryScore {
  const items: AtsIssue[] = [
    success("format-structured", "Structured resume fields", "Resumi keeps your resume content in structured fields.", "Keep using clear sections."),
    success("format-contact", "Text-based contact details", "Contact details are rendered as selectable text in templates.", "Avoid putting key details only inside images."),
    suggestion("format-template", "Choose ATS-friendly templates for job portals", "Visual templates are useful, but corporate ATS portals often prefer simpler layouts.", "Use Classic ATS or Simple One Page for ATS-heavy applications."),
  ];
  return category("ats-formatting", "ATS Formatting", 4, 5, items);
}

function pass(condition: boolean, points: number, items: AtsIssue[], id: string, successTitle: string, successDescription: string, successAction: string, issueTitle: string, issueDescription: string, issueAction: string) {
  items.push(condition ? success(id, successTitle, successDescription, successAction) : error(id, issueTitle, issueDescription, issueAction));
  return condition ? points : 0;
}

function category(id: string, label: string, score: number, maxScore: number, items: AtsIssue[]): AtsCategoryScore {
  return {
    id,
    label,
    score,
    maxScore,
    passed: items.filter((item) => item.severity === "success").length,
    issues: items.filter((item) => item.severity === "error" || item.severity === "warning").length,
    suggestions: items.filter((item) => item.severity === "suggestion").length,
    items,
  };
}

const success = (id: string, title: string, description: string, action: string): AtsIssue => ({ id, title, description, action, severity: "success" });
const error = (id: string, title: string, description: string, action: string): AtsIssue => ({ id, title, description, action, severity: "error" });
const suggestion = (id: string, title: string, description: string, action: string): AtsIssue => ({ id, title, description, action, severity: "suggestion" });

function scoreLabel(percentage: number): AtsScoreResult["label"] {
  if (percentage >= 85) return "Excellent";
  if (percentage >= 70) return "Strong";
  if (percentage >= 40) return "Good Start";
  return "Needs Work";
}

function summaryFor(percentage: number, issues: number) {
  if (percentage >= 85) return `Excellent foundation. Review ${issues} remaining items for polish.`;
  if (percentage >= 70) return `Strong resume. Fix ${issues} items to improve match quality.`;
  if (percentage >= 40) return `Good start. Fix ${issues} issues before applying.`;
  return `Needs work. Fix ${issues} issues to make the resume application-ready.`;
}

function wordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function keywordsFrom(values: string[]) {
  return values.join(" ").toLowerCase().split(/[^a-z0-9+#.]+/).filter((word) => word.length > 2);
}
