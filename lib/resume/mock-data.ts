import type { ResumeData } from "@/types/resume";

export const defaultSectionOrder = [
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "certificates",
  "languages",
  "achievements",
  "references",
];

export const defaultResumeData: ResumeData = {
  personal: {
    fullName: "Sophia Bennett",
    jobTitle: "Product Manager",
    email: "sophia.bennett@email.com",
    phone: "+971 50 123 4567",
    location: "Dubai, UAE",
    website: "sophiabennett.com",
    linkedin: "linkedin.com/in/sophiabennett",
    portfolio: "portfolio.sophiabennett.com",
    photoUrl: "",
  },
  summary:
    "Product manager with 6 years of experience building customer-focused SaaS products, leading cross-functional teams, and improving activation, retention, and revenue outcomes.",
  experience: [
    {
      id: "exp-1",
      company: "Northstar Labs",
      role: "Senior Product Manager",
      location: "Dubai, UAE",
      startDate: "Jan 2022",
      endDate: "",
      isCurrent: true,
      description: "Own roadmap strategy for a B2B workflow platform serving regional enterprise customers.",
      bullets: [
        "Led product discovery and roadmap planning for a SaaS platform used by 50K+ monthly users.",
        "Improved onboarding activation by 24% through research-led funnel improvements.",
        "Partnered with engineering, sales, and support to ship 18 major releases in one year.",
      ],
    },
    {
      id: "exp-2",
      company: "BrightApps",
      role: "Product Manager",
      location: "Bengaluru, India",
      startDate: "Jun 2019",
      endDate: "Dec 2021",
      isCurrent: false,
      description: "Managed a portfolio of mobile productivity features from concept to launch.",
      bullets: [
        "Launched analytics dashboards that reduced support escalations by 31%.",
        "Worked closely with design and data teams to prioritize high-impact user needs.",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of Mumbai",
      degree: "Bachelor of Engineering",
      field: "Computer Science",
      location: "Mumbai, India",
      startDate: "2015",
      endDate: "2019",
      grade: "First Class",
      description: "Coursework in systems design, data structures, product analytics, and software engineering.",
    },
  ],
  skills: [
    { id: "skill-1", name: "Product Strategy", level: "Expert" },
    { id: "skill-2", name: "User Research", level: "Advanced" },
    { id: "skill-3", name: "Roadmapping", level: "Expert" },
    { id: "skill-4", name: "SQL", level: "Intermediate" },
  ],
  languages: [
    { id: "lang-1", name: "English", level: "Fluent" },
    { id: "lang-2", name: "Hindi", level: "Native" },
  ],
  projects: [
    {
      id: "project-1",
      name: "Self-serve Analytics Launch",
      role: "Product Lead",
      link: "sophiabennett.com/analytics",
      description: "Created a reporting experience for operations teams to track business outcomes.",
      bullets: ["Reduced weekly reporting work by 8 hours per account team.", "Reached 72% adoption within the first quarter."],
    },
  ],
  certificates: [
    { id: "cert-1", name: "Certified Scrum Product Owner", issuer: "Scrum Alliance", date: "2023", link: "" },
  ],
  achievements: [
    { id: "ach-1", title: "Product Excellence Award", description: "Recognized for leading the highest-retention launch of 2024." },
  ],
  references: [
    {
      id: "ref-1",
      name: "Aisha Khan",
      role: "Director of Product",
      company: "Northstar Labs",
      email: "available on request",
      phone: "",
    },
  ],
};

export const mockResumes = [
  {
    id: "sample-resume",
    title: "Product Manager Resume",
    templateId: "modern-minimal",
    templateName: "Modern Minimal",
    lastEdited: "Today, 10:42 AM",
    downloads: 6,
  },
  {
    id: "uae-profile",
    title: "UAE Applications Resume",
    templateId: "uae-professional",
    templateName: "UAE Professional",
    lastEdited: "Yesterday",
    downloads: 3,
  },
  {
    id: "ats-version",
    title: "ATS Corporate Resume",
    templateId: "classic-ats",
    templateName: "Classic ATS",
    lastEdited: "Jun 10, 2026",
    downloads: 1,
  },
];
