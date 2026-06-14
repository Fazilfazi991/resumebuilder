import { ClassicATS } from "@/components/resume-templates/ClassicATS";
import { CreativeDesigner } from "@/components/resume-templates/CreativeDesigner";
import { ElegantTwoColumn } from "@/components/resume-templates/ElegantTwoColumn";
import { ExecutivePro } from "@/components/resume-templates/ExecutivePro";
import { FreshGraduate } from "@/components/resume-templates/FreshGraduate";
import { ModernMinimal } from "@/components/resume-templates/ModernMinimal";
import { PremiumCorporate } from "@/components/resume-templates/PremiumCorporate";
import { SalesResume } from "@/components/resume-templates/SalesResume";
import { SimpleOnePage } from "@/components/resume-templates/SimpleOnePage";
import { TechResume } from "@/components/resume-templates/TechResume";
import { UAEProfessional } from "@/components/resume-templates/UAEProfessional";
import type { TemplateDefinition } from "@/types/template";

export const resumeTemplates: TemplateDefinition[] = [
  {
    id: "classic-ats",
    name: "Classic ATS",
    category: "ATS",
    description: "Simple single-column resume for corporate applications.",
    bestFor: "Corporate applications",
    tags: ["ATS Friendly", "No Photo", "Single Column"],
    features: ["Recruiter-first hierarchy", "ATS-safe text flow", "Compact achievements"],
    isPremium: false,
    supportsPhoto: false,
    component: ClassicATS,
  },
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    category: "Modern",
    description: "Clean professional layout with a subtle accent color.",
    bestFor: "General professionals",
    tags: ["Clean", "Modern", "Minimal", "No Photo"],
    features: ["Balanced white space", "Strong summary area", "Modern accent system"],
    isPremium: false,
    supportsPhoto: false,
    component: ModernMinimal,
  },
  {
    id: "premium-corporate",
    name: "Premium Corporate",
    category: "Executive",
    description: "Premium two-column layout with a navy sidebar, photo, skill bars, and refined corporate hierarchy.",
    bestFor: "Product, business, and leadership applications",
    tags: ["Photo CV", "Photo supported", "Two Column", "Premium", "Metrics Focused"],
    features: ["Reference-inspired navy sidebar", "Timeline experience", "Sidebar skill bars"],
    isPremium: true,
    supportsPhoto: true,
    component: PremiumCorporate,
  },
  {
    id: "uae-professional",
    name: "UAE Professional",
    category: "UAE",
    description: "Two-column profile-friendly resume for UAE hiring standards.",
    bestFor: "UAE job applications",
    tags: ["Photo CV", "Photo supported", "Two Column", "UAE Hiring", "Premium"],
    features: ["Photo-ready header", "Gulf hiring format", "Contact details spotlight"],
    isPremium: true,
    supportsPhoto: true,
    component: UAEProfessional,
  },
  {
    id: "executive-pro",
    name: "Executive Pro",
    category: "Executive",
    description: "Leadership-focused layout for senior professionals.",
    bestFor: "Managers and directors",
    tags: ["Leadership", "Premium", "Photo supported", "Metrics Focused"],
    features: ["Executive headline", "Leadership metrics", "Boardroom polish"],
    isPremium: true,
    supportsPhoto: true,
    component: ExecutivePro,
  },
  {
    id: "fresh-graduate",
    name: "Fresh Graduate",
    category: "Freshers",
    description: "Education and projects-first template for new applicants.",
    bestFor: "Students and freshers",
    tags: ["Education First", "Projects", "Entry Level", "Photo supported"],
    features: ["Education-led structure", "Projects prominence", "Internship friendly"],
    isPremium: true,
    supportsPhoto: true,
    component: FreshGraduate,
  },
  {
    id: "tech-resume",
    name: "Tech Resume",
    category: "Tech",
    description: "Skills-heavy template for engineers and technical roles.",
    bestFor: "Developers and IT roles",
    tags: ["Skills Heavy", "Projects", "Portfolio", "ATS Friendly"],
    features: ["Technical skill map", "Project-first proof", "Developer links visible"],
    isPremium: true,
    supportsPhoto: false,
    component: TechResume,
  },
  {
    id: "sales-resume",
    name: "Sales Resume",
    category: "Sales",
    description: "Metrics-led resume for business development and sales roles.",
    bestFor: "Sales and business development",
    tags: ["Metrics Focused", "Achievements", "Growth", "Photo supported"],
    features: ["Quota and revenue focus", "Achievement bands", "Client-facing polish"],
    isPremium: true,
    supportsPhoto: true,
    component: SalesResume,
  },
  {
    id: "creative-designer",
    name: "Creative Designer",
    category: "Creative",
    description: "Portfolio-friendly design for creative professionals.",
    bestFor: "Designers and creatives",
    tags: ["Portfolio", "Creative", "Photo CV", "Photo supported"],
    features: ["Visual identity header", "Portfolio emphasis", "Creative section rhythm"],
    isPremium: true,
    supportsPhoto: true,
    component: CreativeDesigner,
  },
  {
    id: "elegant-two-column",
    name: "Elegant Two Column",
    category: "Modern",
    description: "Premium two-column layout with refined spacing.",
    bestFor: "Experienced professionals",
    tags: ["Premium", "Two Column", "Photo supported", "Photo CV"],
    features: ["Readable two-column grid", "Elegant sidebar", "Premium spacing"],
    isPremium: true,
    supportsPhoto: true,
    component: ElegantTwoColumn,
  },
  {
    id: "simple-one-page",
    name: "Simple One Page",
    category: "ATS",
    description: "Compact one-page format optimized for scanning.",
    bestFor: "Compact applications",
    tags: ["One Page", "Clean", "ATS Friendly", "No Photo"],
    features: ["One-page density", "Fast recruiter scan", "Simple ATS structure"],
    isPremium: false,
    supportsPhoto: false,
    component: SimpleOnePage,
  },
];

export function getTemplateById(templateId: string) {
  return resumeTemplates.find((template) => template.id === templateId) ?? resumeTemplates[0];
}
