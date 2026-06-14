export type ResumeData = {
  personal: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    portfolio: string;
    photoUrl: string;
  };
  summary: string;
  experience: {
    id: string;
    company: string;
    role: string;
    location: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    description: string;
    bullets: string[];
  }[];
  education: {
    id: string;
    institution: string;
    degree: string;
    field: string;
    location: string;
    startDate: string;
    endDate: string;
    grade: string;
    description: string;
  }[];
  skills: {
    id: string;
    name: string;
    level: string;
  }[];
  languages: {
    id: string;
    name: string;
    level: string;
  }[];
  projects: {
    id: string;
    name: string;
    role: string;
    link: string;
    description: string;
    bullets: string[];
  }[];
  certificates: {
    id: string;
    name: string;
    issuer: string;
    date: string;
    link: string;
  }[];
  achievements: {
    id: string;
    title: string;
    description: string;
  }[];
  references: {
    id: string;
    name: string;
    role: string;
    company: string;
    email: string;
    phone: string;
  }[];
};

export type ResumeSection =
  | "personal"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "languages"
  | "projects"
  | "certificates"
  | "achievements"
  | "references"
  | "customSections";

export type ResumeTemplateProps = {
  data: ResumeData;
  sectionOrder: string[];
  isWatermarked?: boolean;
};
