import {
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  CloudDownload,
  FileCheck2,
  GraduationCap,
  Layers3,
  LockKeyhole,
  PenLine,
  Rocket,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Target,
  UserRoundCheck,
  UsersRound,
  WandSparkles,
  type LucideIcon,
} from "lucide-react";
import { BuilderMockup } from "./BuilderMockup";
import { ButtonLink } from "./ButtonLink";
import { FeatureCard } from "./FeatureCard";
import { HeroVisual } from "./HeroVisual";
import { PricingCard } from "./PricingCard";
import { SectionHeading } from "./SectionHeading";
import { TemplateCard } from "./TemplateCard";
import { resumeTemplates } from "@/lib/resume/template-registry";

const featuredTemplates = resumeTemplates.slice(0, 6).map((template) => ({
  id: template.id,
  name: template.name,
  category: template.category,
  bestFor: template.bestFor,
  badge: template.isPremium ? "Premium" as const : "Free" as const,
}));

const pricing = [
  {
    name: "Free",
    price: "$0",
    features: ["Create resume", "Basic templates", "Preview resume", "Watermarked download"],
  },
  {
    name: "Premium",
    price: "AED 19 / INR 399",
    features: ["Premium templates", "No watermark", "PDF download", "AI writing tools", "Cover letter"],
    featured: true,
  },
  {
    name: "Lifetime",
    price: "AED 49 / INR 999",
    features: ["Unlimited resumes", "All templates", "Lifetime access", "Priority templates"],
  },
];

type IconItem = [LucideIcon, string, string];

const trustFeatures: IconItem[] = [
  [ScanSearch, "ATS-Friendly", "Optimized to pass ATS scanners"],
  [FileCheck2, "Expert Templates", "Designed by hiring professionals"],
  [Bot, "AI-Powered", "Write better with smart suggestions"],
  [Rocket, "Easy to Use", "Intuitive builder, no learning curve"],
  [LockKeyhole, "Secure & Private", "Your data stays confidential"],
];

const aiTools: IconItem[] = [
  [WandSparkles, "AI Summary Writer", "Turn your experience into a strong professional summary."],
  [PenLine, "Bullet Point Improver", "Convert basic duties into achievement-focused bullet points."],
  [Target, "ATS Keyword Checker", "Compare your resume with a job description and find missing keywords."],
  [BriefcaseBusiness, "Cover Letter Generator", "Create matching cover letters using your resume profile."],
];

const audienceCards: IconItem[] = [
  [GraduationCap, "Fresh Graduates", "Create your first professional resume with guided sections."],
  [UsersRound, "Experienced Professionals", "Highlight achievements, promotions, and leadership experience."],
  [ShieldCheck, "UAE Job Seekers", "Build clean resumes suitable for UAE hiring standards."],
  [UserRoundCheck, "Students & Interns", "Showcase education, projects, certificates, and skills."],
];

export function Homepage() {
  return (
    <main>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-20">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-700">
              <Sparkles size={15} aria-hidden="true" />
              ATS-friendly resumes, ready in minutes
            </p>
            <h1 className="max-w-2xl text-5xl font-bold leading-[1.03] tracking-normal text-slate-950 sm:text-6xl">
              Create a Professional Resume. <span className="text-teal-600">Fast.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Fill your details once, choose from professional templates, and download a polished PDF resume instantly.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/builder/sample-resume">Create My Resume</ButtonLink>
              <ButtonLink href="/templates" variant="secondary">
                View Templates
              </ButtonLink>
            </div>
            <div className="mt-9 grid gap-4 text-sm font-medium text-slate-600 sm:grid-cols-3">
              {["No credit card required", "ATS-friendly", "PDF ready"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-teal-700" aria-hidden="true" />
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
              {["50+ Templates", "PDF Export", "AI Writing Help", "ATS Friendly"].map((stat) => (
                <div key={stat} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-center text-sm font-bold text-slate-800">
                  {stat}
                </div>
              ))}
            </div>
          </div>
          <HeroVisual />
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50/80 py-8" id="how-it-works">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[0.65fr_1fr_1fr_1fr] lg:px-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">How It Works</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">Create your perfect resume in 3 simple steps.</p>
          </div>
          {[
            ["1", Layers3, "Add your details", "Enter your personal info, education, experience, skills, projects, and achievements."],
            ["2", PenLine, "Pick a template", "Choose from clean, modern, ATS-friendly, executive, or creative templates."],
            ["3", CloudDownload, "Download PDF", "Export a perfectly formatted resume ready for job applications."],
          ].map(([index, Icon, title, description]) => (
            <div key={String(title)} className="flex gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                <Icon size={22} aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-bold text-slate-500">{String(index)}</p>
                <h3 className="mt-1 font-bold text-slate-950">{String(title)}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{String(description)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-20" id="templates">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Professional templates for every career stage"
            subtitle="Switch templates anytime without rewriting your resume."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTemplates.map((template) => (
              <TemplateCard key={template.name} {...template} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <ButtonLink href="/templates" variant="secondary">Browse all templates</ButtonLink>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-teal-50/40 py-10">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-5 lg:px-8">
          {trustFeatures.map(([Icon, title, copy]) => (
            <div key={title} className="flex items-start gap-3 border-slate-200 lg:border-l lg:pl-5 first:lg:border-l-0 first:lg:pl-0">
              <Icon className="mt-1 shrink-0 text-teal-700" size={23} aria-hidden="true" />
              <div>
                <h3 className="font-bold text-slate-950">{title}</h3>
                <p className="mt-1 text-sm leading-5 text-slate-600">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="builder-showcase overflow-hidden bg-white py-16 sm:py-20" id="builder">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.18fr_0.82fr] lg:px-8">
          <BuilderMockup />
          <div className="scroll-reveal scroll-reveal-delay">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-sm font-bold text-teal-700">
              <Sparkles size={15} aria-hidden="true" />
              Live builder workspace
            </p>
            <h2 className="max-w-md text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">Edit once. Preview instantly.</h2>
            <p className="mt-5 text-base leading-7 text-slate-600">
              Your resume updates live as you type, with polished templates, photo support, AI writing help, and export-ready formatting in one focused workspace.
            </p>
            <ul className="mt-7 space-y-4">
              {["Photo-ready resume preview", "Drag-and-drop sections", "Add unlimited experience and education items", "Switch templates anytime", "Auto-save resumes"].map((feature) => (
                <li key={feature} className="builder-feature-item flex items-center gap-3 text-sm font-semibold text-slate-700">
                  <CheckCircle2 size={18} className="text-teal-700" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/builder/sample-resume">Try the Builder</ButtonLink>
              <ButtonLink href="/templates" variant="secondary">View Photo Templates</ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-16" id="ai-tools">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Write better resumes with AI" subtitle="Smarter wording, sharper achievements, and stronger job matching." />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {aiTools.map(([Icon, title, description]) => (
              <FeatureCard key={title} icon={Icon} title={title} description={description} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Built for every career stage" subtitle="Whether you are starting out or leveling up, ResumeCraft keeps the path clear." />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {audienceCards.map(([Icon, title, description]) => (
              <FeatureCard key={title} icon={Icon} title={title} description={description} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-16" id="pricing">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Simple, transparent pricing" subtitle="Choose the plan that matches how often you apply." />
          <div className="grid gap-6 lg:grid-cols-3">
            {pricing.map((plan) => (
              <PricingCard key={plan.name} {...plan} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-teal-800 py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <h2 className="text-3xl font-bold">Your next opportunity needs a better resume</h2>
            <p className="mt-3 max-w-2xl text-teal-50">
              Start with one profile and generate resumes for multiple job applications.
            </p>
          </div>
          <a
            href="/builder/sample-resume"
            className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-bold text-teal-800 shadow-lg transition hover:bg-teal-50"
          >
            Create Resume Now
          </a>
        </div>
      </section>
    </main>
  );
}
