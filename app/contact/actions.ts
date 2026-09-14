"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { contactMessageSchema } from "@/lib/validations/contact";
import { contactRateLimitFingerprints, requestNetworkIdentifier } from "@/lib/contact/rate-limit";

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
    const requestHeaders = await headers();
    const rateLimitSecret = process.env.CONTACT_RATE_LIMIT_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
    const fingerprints = contactRateLimitFingerprints(
      result.data.email,
      requestNetworkIdentifier(requestHeaders),
      rateLimitSecret,
    );
    const supabase = createAdminClient();
    const { error } = await supabase.rpc("submit_contact_message", {
      contact_name: result.data.name,
      contact_email: result.data.email.toLowerCase(),
      contact_subject: result.data.subject,
      contact_message: result.data.message,
      email_fingerprint: fingerprints.emailFingerprint,
      network_fingerprint: fingerprints.networkFingerprint,
    });
    if (error) throw new Error(error.message);
  } catch (error) {
    if (error instanceof Error && error.message.includes("CONTACT_RATE_LIMITED")) {
      contactRedirect("error", "Too many messages were sent recently. Please wait 15 minutes and try again.");
    }
    contactRedirect("error", "Your message could not be saved right now. Please try again later.");
  }

  contactRedirect("message", "Thanks — your message was received. We will review it as soon as we can.");
}
