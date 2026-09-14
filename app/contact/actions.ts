"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { contactMessageSchema } from "@/lib/validations/contact";

function contactRedirect(kind: "message" | "error", copy: string): never {
  redirect(`/contact?${kind}=${encodeURIComponent(copy)}`);
}

export async function submitContactMessage(formData: FormData) {
  const result = contactMessageSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
    website: formData.get("website") ?? "",
  });

  if (!result.success) {
    contactRedirect("error", result.error.issues[0]?.message ?? "Check the form and try again.");
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("contact_messages").insert({
      name: result.data.name,
      email: result.data.email.toLowerCase(),
      subject: result.data.subject,
      message: result.data.message,
      status: "new",
    });
    if (error) throw error;
  } catch {
    contactRedirect("error", "Your message could not be saved right now. Please try again later.");
  }

  contactRedirect("message", "Thanks — your message was received. We will review it as soon as we can.");
}
