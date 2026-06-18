import { z } from "zod";

const personalSchema = z.object({
  fullName: z.string().max(120),
  jobTitle: z.string().max(120),
  email: z.string().max(200),
  phone: z.string().max(50),
  location: z.string().max(120),
  website: z.string().max(300),
  linkedin: z.string().max(300),
  portfolio: z.string().max(300),
  photoUrl: z.string().max(1000),
});

const experienceSchema = z.object({
  id: z.string(),
  company: z.string().max(160),
  role: z.string().max(160),
  location: z.string().max(120),
  startDate: z.string().max(40),
  endDate: z.string().max(40),
  isCurrent: z.boolean(),
  description: z.string().max(3000),
  bullets: z.array(z.string().max(1000)).max(30),
});

const educationSchema = z.object({
  id: z.string(),
  institution: z.string().max(200),
  degree: z.string().max(160),
  field: z.string().max(160),
  location: z.string().max(120),
  startDate: z.string().max(40),
  endDate: z.string().max(40),
  grade: z.string().max(80),
  description: z.string().max(3000),
});

export const resumeDataSchema = z.object({
  personal: personalSchema,
  summary: z.string().max(5000),
  experience: z.array(experienceSchema).max(30),
  education: z.array(educationSchema).max(20),
  skills: z.array(z.object({ id: z.string(), name: z.string().max(100), level: z.string().max(50) })).max(100),
  languages: z.array(z.object({ id: z.string(), name: z.string().max(100), level: z.string().max(50) })).max(50),
  projects: z.array(z.object({
    id: z.string(),
    name: z.string().max(200),
    role: z.string().max(160),
    link: z.string().max(500),
    description: z.string().max(3000),
    bullets: z.array(z.string().max(1000)).max(30),
  })).max(30),
  certificates: z.array(z.object({
    id: z.string(),
    name: z.string().max(200),
    issuer: z.string().max(200),
    date: z.string().max(40),
    link: z.string().max(500),
  })).max(50),
  achievements: z.array(z.object({
    id: z.string(),
    title: z.string().max(200),
    description: z.string().max(2000),
  })).max(50),
  references: z.array(z.object({
    id: z.string(),
    name: z.string().max(160),
    role: z.string().max(160),
    company: z.string().max(160),
    email: z.string().max(200),
    phone: z.string().max(50),
  })).max(20),
  customSections: z.array(z.object({
    id: z.string(),
    title: z.string().max(160),
    description: z.string().max(3000),
    bullets: z.array(z.string().max(1000)).max(30),
  })).max(20),
});

export const createResumeSchema = z.object({
  title: z.string().trim().min(1).max(120),
  templateId: z.string().trim().min(1).max(100),
  resumeData: resumeDataSchema,
  sectionOrder: z.array(z.string().max(100)).max(30),
});

export const updateResumeSchema = createResumeSchema.partial().extend({
  isPublic: z.boolean().optional(),
});
