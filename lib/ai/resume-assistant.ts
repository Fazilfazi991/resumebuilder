import type { ResumeData } from "@/types/resume";

export type ResumeAssistantRequest = {
  resume: ResumeData;
  userMessage: string;
  targetRole?: string;
};

export type ResumeAssistantResponse = {
  message: string;
  suggestedPatch?: Partial<ResumeData>;
};

export async function getResumeAssistantSuggestion(_request: ResumeAssistantRequest): Promise<ResumeAssistantResponse> {
  void _request;
  // TODO: Connect this placeholder to a real resume improvement API.
  return {
    message: "Resume assistant API is not connected yet.",
  };
}
