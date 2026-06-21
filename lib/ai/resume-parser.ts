import type { ResumeData } from "@/types/resume";

export type ParsedResumeDraft = Partial<ResumeData> & {
  warnings?: string[];
};

export async function parseResumeText(_text: string): Promise<ParsedResumeDraft> {
  void _text;
  // TODO: Parse uploaded resumes into structured ResumeData.
  return {
    warnings: ["Resume parsing is not connected yet."],
  };
}

export function normalizeResumePatch(patch: Partial<ResumeData>): Partial<ResumeData> {
  // TODO: Validate and normalize AI-generated resume patches before applying them.
  return patch;
}
