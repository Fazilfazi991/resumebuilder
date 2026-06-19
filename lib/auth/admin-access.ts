export function adminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined) {
  const normalizedEmail = email?.trim().toLowerCase();
  return Boolean(normalizedEmail && adminEmails().includes(normalizedEmail));
}
