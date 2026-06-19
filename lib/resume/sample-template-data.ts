import type { ResumeData } from "@/types/resume";

export const sampleTemplateSectionOrder = [
  "summary",
  "experience",
  "projects",
  "skills",
  "education",
  "certificates",
  "languages",
  "achievements",
  "references",
  "customSections",
];

const samplePhotoUrl = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
  <rect width="160" height="160" fill="#dbeafe"/>
  <circle cx="80" cy="61" r="33" fill="#2563eb"/>
  <path d="M25 150c9-36 29-54 55-54s46 18 55 54" fill="#0f172a"/>
</svg>
`)}`;

export const sampleTemplateData: ResumeData = {
  personal: {
    fullName: "Alex Morgan",
    jobTitle: "Product Manager",
    email: "alex.morgan@email.com",
    phone: "+971 50 234 6789",
    location: "Dubai, UAE",
    website: "alexmorgan.design",
    linkedin: "linkedin.com/in/alexmorganpm",
    portfolio: "portfolio.alexmorgan.design",
    photoUrl: samplePhotoUrl,
  },
  summary:
    "Product manager with 8 years of experience launching B2B SaaS and marketplace products across MENA, India, and Europe. Skilled at translating customer insights into focused roadmaps, improving activation and retention, and aligning engineering, design, sales, and leadership around measurable product outcomes.",
  experience: [
    {
      id: "sample-exp-1",
      company: "Northstar Labs",
      role: "Senior Product Manager",
      location: "Dubai, UAE",
      startDate: "Jan 2022",
      endDate: "Present",
      isCurrent: true,
      description: "Own roadmap strategy for a B2B workflow platform serving enterprise operations teams.",
      bullets: [
        "Led product discovery and roadmap planning for a SaaS platform used by 50K+ monthly users.",
        "Improved onboarding activation by 24% through research-led funnel experiments and clearer first-run tasks.",
        "Partnered with engineering, sales, and support to ship 18 major releases in one year.",
        "Introduced quarterly product health reviews that reduced unresolved customer escalations by 32%.",
      ],
    },
    {
      id: "sample-exp-2",
      company: "BrightApps",
      role: "Product Manager",
      location: "Bengaluru, India",
      startDate: "Jun 2019",
      endDate: "Dec 2021",
      isCurrent: false,
      description: "Managed mobile productivity and analytics features from concept to launch.",
      bullets: [
        "Launched self-serve analytics dashboards that reduced weekly account reporting work by 8 hours.",
        "Increased trial-to-paid conversion by 17% by redesigning plan comparison and upgrade prompts.",
        "Worked with design and data teams to prioritize high-impact user needs across 5 product squads.",
      ],
    },
    {
      id: "sample-exp-3",
      company: "Cloudlane",
      role: "Associate Product Manager",
      location: "London, UK",
      startDate: "Aug 2016",
      endDate: "May 2019",
      isCurrent: false,
      description: "Supported product operations, customer research, and release planning for a cloud collaboration suite.",
      bullets: [
        "Interviewed 120+ customers to identify friction in account setup and team invitation flows.",
        "Helped launch a role-based permissions feature adopted by 64% of enterprise accounts within six months.",
        "Built product dashboards that improved sprint planning accuracy and stakeholder visibility.",
      ],
    },
  ],
  education: [
    {
      id: "sample-edu-1",
      institution: "University of Manchester",
      degree: "Master of Science",
      field: "Innovation Management",
      location: "Manchester, UK",
      startDate: "2014",
      endDate: "2016",
      grade: "Distinction",
      description: "Focused on product strategy, service design, analytics, and technology commercialization.",
    },
    {
      id: "sample-edu-2",
      institution: "University of Mumbai",
      degree: "Bachelor of Engineering",
      field: "Computer Science",
      location: "Mumbai, India",
      startDate: "2010",
      endDate: "2014",
      grade: "First Class",
      description: "Coursework included data structures, systems design, databases, and human-computer interaction.",
    },
  ],
  skills: [
    { id: "sample-skill-1", name: "Product Strategy", level: "Expert" },
    { id: "sample-skill-2", name: "Roadmapping", level: "Expert" },
    { id: "sample-skill-3", name: "User Research", level: "Advanced" },
    { id: "sample-skill-4", name: "A/B Testing", level: "Advanced" },
    { id: "sample-skill-5", name: "Data Analysis", level: "Advanced" },
    { id: "sample-skill-6", name: "SQL", level: "Intermediate" },
    { id: "sample-skill-7", name: "Agile Delivery", level: "Expert" },
    { id: "sample-skill-8", name: "Stakeholder Management", level: "Expert" },
    { id: "sample-skill-9", name: "Go-to-Market Planning", level: "Advanced" },
    { id: "sample-skill-10", name: "Figma", level: "Intermediate" },
    { id: "sample-skill-11", name: "Amplitude", level: "Advanced" },
    { id: "sample-skill-12", name: "Jira", level: "Expert" },
    { id: "sample-skill-13", name: "Pricing Strategy", level: "Advanced" },
    { id: "sample-skill-14", name: "Customer Journey Mapping", level: "Advanced" },
  ],
  languages: [
    { id: "sample-lang-1", name: "English", level: "Fluent" },
    { id: "sample-lang-2", name: "Hindi", level: "Native" },
    { id: "sample-lang-3", name: "Arabic", level: "Conversational" },
  ],
  projects: [
    {
      id: "sample-project-1",
      name: "Self-serve Analytics Launch",
      role: "Product Lead",
      link: "portfolio.alexmorgan.design/analytics",
      description: "Created a reporting experience that helped operations leaders track activation, retention, and revenue outcomes.",
      bullets: [
        "Reached 72% adoption across account teams within the first quarter.",
        "Reduced manual reporting requests by 41% after launch.",
      ],
    },
    {
      id: "sample-project-2",
      name: "AI Support Triage",
      role: "Discovery Lead",
      link: "portfolio.alexmorgan.design/ai-triage",
      description: "Defined an AI-assisted support triage workflow for high-volume customer operations teams.",
      bullets: [
        "Cut first-response time from 6 hours to 52 minutes in pilot accounts.",
        "Designed safeguards and escalation rules with support, legal, and engineering teams.",
      ],
    },
    {
      id: "sample-project-3",
      name: "Enterprise Permissions Redesign",
      role: "Product Manager",
      link: "portfolio.alexmorgan.design/permissions",
      description: "Rebuilt role-based access controls for enterprise admins managing distributed teams.",
      bullets: [
        "Improved enterprise admin task completion by 29%.",
        "Supported expansion deals worth AED 1.8M in annual recurring revenue.",
      ],
    },
  ],
  certificates: [
    { id: "sample-cert-1", name: "Certified Scrum Product Owner", issuer: "Scrum Alliance", date: "2023", link: "scrumalliance.org" },
    { id: "sample-cert-2", name: "Product Analytics Certification", issuer: "Product School", date: "2022", link: "productschool.com" },
    { id: "sample-cert-3", name: "Design Thinking for Innovation", issuer: "University of Virginia", date: "2021", link: "coursera.org" },
  ],
  achievements: [
    { id: "sample-ach-1", title: "Product Excellence Award", description: "Recognized for leading the highest-retention product launch of 2024." },
    { id: "sample-ach-2", title: "Revenue Impact", description: "Contributed to AED 4.2M in expansion pipeline through enterprise workflow improvements." },
    { id: "sample-ach-3", title: "Mentorship", description: "Mentored 6 associate product managers, with 4 promoted into independent product ownership roles." },
  ],
  references: [
    {
      id: "sample-ref-1",
      name: "Maya Kapoor",
      role: "VP Product",
      company: "Northstar Labs",
      email: "available on request",
      phone: "",
    },
  ],
  customSections: [
    {
      id: "sample-custom-1",
      title: "Speaking & Community",
      description: "Regular speaker and mentor for product management communities in Dubai and Bengaluru.",
      bullets: [
        "Presented a workshop on product discovery for 180+ startup founders and product leaders.",
        "Volunteer mentor for early-career product managers transitioning from engineering and design.",
      ],
    },
  ],
};
