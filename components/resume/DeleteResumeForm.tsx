"use client";

import { SubmitButton } from "@/components/app/SubmitButton";
import { Trash2 } from "lucide-react";

export function DeleteResumeForm({ action, resumeTitle }: { action: () => Promise<void>; resumeTitle: string }) {
  return (
    <form action={action} onSubmit={(event) => {
      if (!window.confirm(`Delete “${resumeTitle}”? This cannot be undone.`)) event.preventDefault();
    }}>
      <SubmitButton variant="danger" pendingText="Deleting..."><Trash2 size={15} aria-hidden="true" /> Delete</SubmitButton>
    </form>
  );
}
