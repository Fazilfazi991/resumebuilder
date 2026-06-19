const ownerEmails = ["admin@resumi.live"];

export function adminEmails() {
  const envEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  return Array.from(new Set([...ownerEmails, ...envEmails]));
}

export function isAdminEmail(email: string | null | undefined) {
  const normalizedEmail = email?.trim().toLowerCase();
  return Boolean(normalizedEmail && adminEmails().includes(normalizedEmail));
}
