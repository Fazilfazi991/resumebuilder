import type { ComponentType } from "react";
import type { ResumeTemplateProps } from "./resume";

export type TemplateCategory = "ATS" | "Modern" | "Executive" | "Creative" | "UAE" | "Freshers" | "Tech" | "Sales";

export type TemplateDefinition = {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  bestFor: string;
  tags: string[];
  features: string[];
  isPremium: boolean;
  supportsPhoto?: boolean;
  component?: ComponentType<ResumeTemplateProps>;
};
